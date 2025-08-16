// src/components/ui/Header.jsx (Redesigned - drop-in replacement)
// Keeps the same public API and behavior while improving structure and UX.
// - Brand (left), Primary Nav (center on md+), Actions (right): Emergency + Wallet
// - Single mobile menu for all nav links
// - Accessible dropdowns and improved aria usage
// - Fully themed with tokens from THEME.md

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useSession } from '../../context/SessionContext';
import { blockchainService } from '../../utils/blockchainService';
import { connectWithWalletConnect, disconnectWalletConnect } from '../../utils/walletConnectService';
import { useToast } from './ToastProvider';

const Header = ({
  walletConnected: walletConnectedProp = undefined,
  currentNetwork: currentNetworkProp = undefined,
  emergencyConfigured = false,
  onWalletConnect,
  onNetworkSwitch,
  onEmergencyActivate,
}) => {
  const location = useLocation();

  // Safe optional hooks
  const session = (() => { try { return useSession(); } catch { return null; } })();
  const toast = (() => { try { return useToast(); } catch { return { success(){}, error(){}, info(){}, warning(){}, show(){}, hide(){} }; } })();

  // Connection state
  const [navOpen, setNavOpen] = useState(false); // mobile
  const [walletOpen, setWalletOpen] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const walletMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const currentWalletRef = useRef(null); // which wallet flow is in progress

  // Derive wallet/session state
  const walletConnected = typeof walletConnectedProp === 'boolean'
    ? walletConnectedProp
    : !!session?.isAuthenticated;
  const currentNetwork = currentNetworkProp || session?.wallet?.network || 'Unknown';
  const address = session?.wallet?.address;
  const did = session?.wallet?.did;
  const balance = session?.wallet?.balance;
  const shortAddress = address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'N/A';

  // Nav model (add all visible items; Profile included)
  const navigationItems = useMemo(() => ([
    { label: 'Dashboard', path: '/health-dashboard-overview', icon: 'Activity', tooltip: 'Health overview and recent activity' },
    { label: 'My Records', path: '/medical-records-management', icon: 'FileText', tooltip: 'Complete medical history management' },
    { label: 'AI Assistant', path: '/ai-health-assistant-analysis', icon: 'Brain', tooltip: 'Interactive health insights and medical Q&A' },
    { label: 'Access Control', path: '/consent-access-management', icon: 'Shield', tooltip: 'Consent management and emergency access' },
    { label: 'Profile', path: '/profile', icon: 'User', tooltip: 'View and manage your profile' },
  ]), []);

  // Active path logic (Access Control groups emergency contacts as active)
  const isActivePath = (path) => {
    if (path === '/consent-access-management') {
      return location?.pathname === '/consent-access-management' || location?.pathname === '/emergency-access-contacts';
    }
    return location?.pathname === path;
  };

  // Clipboard helper with toast
  const copyToClipboard = async (text, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info(`${label} to clipboard`);
    } catch (_) {}
  };

  // Wallet handlers
  const handleWalletConnect = async () => {
    try {
      if (onWalletConnect) return onWalletConnect();
      if (!session) return;

      setIsWalletConnecting(true);
      // Try MetaMask first
      try {
        currentWalletRef.current = 'metamask';
        const info = await blockchainService.connectWallet();
        session.login({
          provider: info?.type || 'MetaMask',
          address: info?.address,
          did: info?.did,
          chainId: info?.chainId,
          network: info?.network,
          balance: info?.balance,
        });
        toast.success('Wallet connected via MetaMask');
      } catch {
        // Fallback to WalletConnect with timeout protection
        currentWalletRef.current = 'walletconnect';
        let timeoutId;
        try {
          const connectPromise = connectWithWalletConnect();
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('WalletConnect cancelled or timed out.')), 30000);
          });
          const info = await Promise.race([connectPromise, timeoutPromise]);
          if (timeoutId) clearTimeout(timeoutId);
          session.login({
            provider: info?.type || 'WalletConnect',
            address: info?.address,
            did: info?.did,
            chainId: info?.chainId,
            network: info?.network,
            balance: info?.balance,
          });
          toast.success('Wallet connected via WalletConnect');
        } catch (err) {
          try { await disconnectWalletConnect(); } catch (_) {}
          const msg = err?.message || '';
          if (/closed|cancel|timeout/i.test(msg)) {
            toast.error('WalletConnect cancelled or timed out.');
          }
        }
      }
    } finally {
      setIsWalletConnecting(false);
      setWalletOpen(false);
    }
  };

  const handleCancelConnect = async () => {
    // Stop spinner and close walletconnect session if active
    setIsWalletConnecting(false);
    if (currentWalletRef.current === 'walletconnect') {
      try { await disconnectWalletConnect(); } catch (_) {}
    }
    toast.info('Connection cancelled.');
  };

  const handleNetworkSwitch = async () => {
    try {
      if (onNetworkSwitch) return onNetworkSwitch();
      const ok = await blockchainService.switchToSepolia();
      if (ok && session) {
        const status = await blockchainService.getNetworkStatus();
        session.updateWallet({ network: status?.name, chainId: status?.chainId });
        toast.success('Switched to Sepolia');
      } else {
        toast.error('Failed to switch network.');
      }
    } finally {
      setWalletOpen(false);
    }
  };

  const handleLogout = () => {
    if (session) session.logout();
    setWalletOpen(false);
  };

  // Close menus on outside click & Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(e.target) && walletOpen) {
        setWalletOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && navOpen) {
        setNavOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (walletOpen) setWalletOpen(false);
        if (navOpen) setNavOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [walletOpen, navOpen]);

  // Subcomponents (kept inline for a single file, but now clearly separated)

  const Brand = () => (
    <Link to="/health-dashboard-overview" className="flex items-center gap-3" aria-label="PULSE Home">
      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
        <Icon name="Heart" size={20} className="text-primary-foreground" />
      </div>
      <span className="text-xl font-semibold text-foreground">PULSE</span>
    </Link>
  );

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
      {navigationItems.map((item) => {
        const active = isActivePath(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            title={item.tooltip}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-clinical',
              active
                ? 'bg-primary bg-opacity-80 backdrop-blur-md text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            ].join(' ')}
          >
            <Icon name={item.icon} size={16} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const EmergencyIndicator = () => (
    emergencyConfigured ? (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
        <Icon name="AlertTriangle" size={16} className="text-clinical-amber" />
        <span className="text-sm font-medium text-clinical-amber">Emergency Access Active</span>
        <button
          onClick={onEmergencyActivate}
          className="text-xs text-clinical-amber hover:text-clinical-amber/80 transition-clinical"
        >
          Manage
        </button>
      </div>
    ) : null
  );

  const WalletControl = () => (
    <div className="relative hidden md:block" ref={walletMenuRef}>
      <button
        onClick={() => setWalletOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={walletOpen}
        aria-controls="wallet-menu"
        className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-clinical"
      >
        <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {walletConnected ? `Connected (${currentNetwork || 'Unknown'})` : 'Not Connected'}
        </span>
        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
      </button>

      {walletOpen && (
        <div
          id="wallet-menu"
          role="menu"
          className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-xs sm:max-w-sm md:w-64 border border-border rounded-lg shadow-medical-modal z-dropdown bg-popover/80 backdrop-blur-md"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-popover-foreground">Wallet Status</span>
              <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
            </div>

            {walletConnected ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <p className="text-sm font-mono text-foreground">{currentNetwork || 'Unknown'}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <div className="flex items-center justify-between gap-2">
                    <p title={address || ''} className="text-sm font-mono text-foreground truncate max-w-[180px]">{shortAddress}</p>
                    {address && (
                      <button
                        onClick={() => copyToClipboard(address, 'Address copied')}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title="Copy address"
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {did && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">DID</p>
                    <div className="flex items-center justify-between gap-2">
                      <p title={did} className="text-xs font-mono text-foreground truncate max-w-[180px]">{did}</p>
                      <button
                        onClick={() => copyToClipboard(did, 'DID copied')}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title="Copy DID"
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {balance != null && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className="text-sm font-mono text-foreground">{balance} ETH</p>
                  </div>
                )}

                <div className="pt-2 border-t border-border space-y-2">
                  <Button variant="outline" size="sm" onClick={handleNetworkSwitch} className="w-full">
                    Switch Network
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Connect your wallet to access PULSE</p>
                {isWalletConnecting ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelConnect} className="w-full">
                      Cancel
                    </Button>
                    <Button variant="default" size="sm" disabled className="w-full">
                      <span className="inline-flex items-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Connecting...
                      </span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" size="sm" onClick={handleWalletConnect} className="w-full">
                    Connect Wallet
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const MobileMenu = () => (
    navOpen ? (
      <div
        ref={mobileMenuRef}
        className="md:hidden py-3 border-t border-border bg-background/95 backdrop-blur-sm rounded-b-xl"
      >
        {/* Wallet quick actions on mobile */}
        <div className="px-3 sm:px-4 pb-3">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Wallet</span>
              <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
            </div>
            {walletConnected ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Network</div>
                <div className="text-sm font-mono text-foreground">{currentNetwork || 'Unknown'}</div>
                <div className="text-xs text-muted-foreground mt-2">Address</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-mono text-foreground truncate max-w-[200px]">{shortAddress}</div>
                  {address && (
                    <button
                      onClick={() => copyToClipboard(address, 'Address copied')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                      title="Copy address"
                    >
                      <Icon name="Copy" size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={handleNetworkSwitch}>Network</Button>
                  <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Connect your wallet to access PULSE</p>
                {isWalletConnecting ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelConnect}>Cancel</Button>
                    <Button variant="default" size="sm" disabled>
                      <span className="inline-flex items-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        Connecting...
                      </span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" size="sm" onClick={handleWalletConnect} className="w-full">Connect Wallet</Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-2 px-2 max-h-[75vh] overflow-y-auto" aria-label="Mobile">
          {navigationItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setNavOpen(false)}
                className={[
                  'flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-sm font-medium transition-clinical',
                  active
                    ? 'bg-primary/80 backdrop-blur-md text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                ].join(' ')}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    ) : null
  );

  return (
    <header className="sticky top-0 z-header bg-background/95 backdrop-blur-sm border-b border-border safe-t">
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Brand */}
          <Brand />

          {/* Center: Primary nav (desktop only) */}
          <DesktopNav />

          {/* Right: Emergency + Wallet + Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <EmergencyIndicator />
            <WalletControl />

            {/* Mobile hamburger */}
            <button
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={navOpen}
              aria-controls="mobile-menu"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
            >
              <Icon name={navOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;