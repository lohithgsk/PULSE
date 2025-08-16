import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useSession } from '../../context/SessionContext';
import { blockchainService } from '../../utils/blockchainService';
import { connectWithWalletConnect, disconnectWalletConnect } from '../../utils/walletConnectService';

const Header = ({ walletConnected: walletConnectedProp = undefined, currentNetwork: currentNetworkProp = undefined, emergencyConfigured = false, onWalletConnect, onNetworkSwitch, onEmergencyActivate }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const currentWalletRef = useRef(null);
  const cancelRejectRef = useRef(null);
  const session = (() => { try { return useSession(); } catch { return null; } })();

  const walletConnected = typeof walletConnectedProp === 'boolean'
    ? walletConnectedProp
    : !!session?.isAuthenticated;
  const currentNetwork = currentNetworkProp || session?.wallet?.network || 'Unknown';

  const navigationItems = [
    { label: 'Dashboard', path: '/health-dashboard-overview', icon: 'Activity', tooltip: 'Health overview and recent activity' },
    { label: 'My Records', path: '/medical-records-management', icon: 'FileText', tooltip: 'Complete medical history management' },
    { label: 'AI Assistant', path: '/ai-health-assistant-analysis', icon: 'Brain', tooltip: 'Interactive health insights and medical Q&A' },
    { label: 'Access Control', path: '/consent-access-management', icon: 'Shield', tooltip: 'Consent management and emergency access' }
  ];

  const secondaryItems = [
    { label: 'Emergency Contacts', path: '/emergency-access-contacts', icon: 'Phone', tooltip: 'Configure emergency access contacts' }
  ];

  const isActivePath = (path) => {
    if (path === '/consent-access-management') {
      return location?.pathname === '/consent-access-management' || location?.pathname === '/emergency-access-contacts';
    }
    return location?.pathname === path;
  };

  const handleWalletConnect = async () => {
    try {
      if (onWalletConnect) return onWalletConnect();
      if (!session) return;
      setIsWalletConnecting(true);
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
      } catch (e) {
        // Fallback to WalletConnect with cancel/timeout handling
        currentWalletRef.current = 'walletconnect';
        let timeoutId;
        try {
          const connectPromise = connectWithWalletConnect();
          const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('WalletConnect cancelled or timed out.')), 25000);
          });
          const cancelPromise = new Promise((_, reject) => {
            cancelRejectRef.current = reject;
          });
          const info = await Promise.race([connectPromise, timeoutPromise, cancelPromise]);
          clearTimeout(timeoutId);
          session.login({
            provider: info?.type || 'WalletConnect',
            address: info?.address,
            did: info?.did,
            chainId: info?.chainId,
            network: info?.network,
            balance: info?.balance,
          });
        } catch (err) {
          try { await disconnectWalletConnect(); } catch (_) {}
          // Swallow cancel/timeout errors to allow user to retry without noise
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          cancelRejectRef.current = null;
        }
      }
    } finally {
      setIsWalletConnecting(false);
      setIsWalletDropdownOpen(false);
    }
  };

  const handleCancelConnect = async () => {
    // Cancels WalletConnect flow and stops any spinner
    if (currentWalletRef.current === 'walletconnect') {
      try { await disconnectWalletConnect(); } catch (_) {}
      if (cancelRejectRef.current) {
        cancelRejectRef.current(new Error('User cancelled'));
      }
    }
    setIsWalletConnecting(false);
  };

  const handleNetworkSwitch = async () => {
    try {
      if (onNetworkSwitch) return onNetworkSwitch();
      const ok = await blockchainService.switchToSepolia();
      if (ok && session) {
        const status = await blockchainService.getNetworkStatus();
        session.updateWallet({ network: status?.name, chainId: status?.chainId });
      }
    } finally {
      setIsWalletDropdownOpen(false);
    }
  };

  const handleLogout = () => {
    if (session) {
      session.logout();
    }
    setIsWalletDropdownOpen(false);
  };

  const WalletStatus = () => (
    <div className="relative">
      <button
        onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-clinical"
      >
        <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
        <span className="text-sm font-medium text-foreground hidden sm:inline">
          {walletConnected ? `Connected (${currentNetwork})` : 'Not Connected'}
        </span>
        <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
      </button>

      {isWalletDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-medical-modal z-dropdown">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-popover-foreground">Wallet Status</span>
              <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
            </div>
            
            {walletConnected ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <p className="text-sm font-mono text-foreground">{currentNetwork}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-sm font-mono text-foreground">{(session?.wallet?.address && `${session.wallet.address.slice(0,6)}...${session.wallet.address.slice(-4)}`) || 'N/A'}</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <Button variant="outline" size="sm" onClick={handleNetworkSwitch} className="w-full">
                    Switch Network
                  </Button>
                </div>
                <div>
                  <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full mt-2">
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

  const EmergencyIndicator = () => (
    emergencyConfigured && (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
        <Icon name="AlertTriangle" size={16} className="text-clinical-amber" />
        <span className="text-sm font-medium text-clinical-amber hidden sm:inline">Emergency Access Active</span>
        <button
          onClick={onEmergencyActivate}
          className="text-xs text-clinical-amber hover:text-clinical-amber/80 transition-clinical"
        >
          Manage
        </button>
      </div>
    )
  );

  return (
    <header className="sticky top-0 z-header bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-nav">
          {/* Logo */}
          <Link to="/health-dashboard-overview" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Heart" size={20} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">PULSE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>More</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-medical-modal z-dropdown">
                  <div className="py-2">
                    {secondaryItems?.map((item) => (
                      <Link
                        key={item?.path}
                        to={item?.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm transition-clinical ${
                          isActivePath(item?.path)
                            ? 'bg-accent text-accent-foreground'
                            : 'text-popover-foreground hover:bg-muted'
                        }`}
                        title={item?.tooltip}
                      >
                        <Icon name={item?.icon} size={16} />
                        <span>{item?.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <EmergencyIndicator />
            <WalletStatus />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              {[...navigationItems, ...secondaryItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-clinical ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;