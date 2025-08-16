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
import { useI18n } from '../../i18n/I18nProvider';

const Header = ({
  walletConnected: walletConnectedProp = undefined,
  currentNetwork: currentNetworkProp = undefined,
  emergencyConfigured = false,
  onWalletConnect,
  onNetworkSwitch,
  onEmergencyActivate,
}) => {
  const location = useLocation();
  const { t } = (() => { try { return useI18n(); } catch { return { t: (k, v) => typeof k === 'string' ? k.replace('{network}', v?.network ?? '') : k }; } })();

  // Safe optional hooks
  const session = (() => { try { return useSession(); } catch { return null; } })();
  const toast = (() => { try { return useToast(); } catch { return { success(){}, error(){}, info(){}, warning(){}, show(){}, hide(){} }; } })();

  // Connection state
  const [navOpen, setNavOpen] = useState(false); // mobile
  // Close mobile nav automatically on route change (ensures state stays in sync)
  useEffect(() => {
    setNavOpen(false);
  }, [location?.pathname]);

  // Feature flag: off-canvas vs inline fallback (inline is more bulletproof if styling issues occur)
  const useOffCanvas = false; // set true to re-enable drawer version
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
    { label: t('nav.dashboard'), path: '/health-dashboard-overview', icon: 'Activity', tooltip: t('nav.dashboardTip') },
    { label: t('nav.records'), path: '/medical-records-management', icon: 'FileText', tooltip: t('nav.recordsTip') },
    { label: t('nav.aiAssistant'), path: '/ai-health-assistant-analysis', icon: 'Brain', tooltip: t('nav.aiAssistantTip') },
    { label: t('nav.accessControl'), path: '/consent-access-management', icon: 'Shield', tooltip: t('nav.accessControlTip') },
    { label: t('nav.profile'), path: '/profile', icon: 'User', tooltip: t('nav.profileTip') },
  ]), [t]);

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

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (navOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return undefined;
  }, [navOpen]);

  // Subcomponents (kept inline for a single file, but now clearly separated)

  const Brand = () => (
  <Link to="/health-dashboard-overview" className="flex items-center gap-3" aria-label={t('header.homeAriaLabel')}>
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
                ? 'text-black dark:text-foreground font-semibold border border-border bg-transparent'
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
        <span className="text-sm font-medium text-clinical-amber">{t('header.emergencyActive')}</span>
        <button
          onClick={onEmergencyActivate}
          className="text-xs text-clinical-amber hover:text-clinical-amber/80 transition-clinical"
        >
          {t('header.manage')}
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
          {walletConnected ? t('header.connectedWithNetwork', { network: currentNetwork || 'Unknown' }) : t('header.notConnected')}
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
              <span className="text-sm font-medium text-popover-foreground">{t('header.walletStatus')}</span>
              <span className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-clinical-green' : 'bg-clinical-red'}`} />
            </div>

            {walletConnected ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t('header.network')}</p>
                  <p className="text-sm font-mono text-foreground">{currentNetwork || 'Unknown'}</p>
                </div>

                <div>
      <p className="text-xs text-muted-foreground mb-1">{t('header.address')}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p title={address || ''} className="text-sm font-mono text-foreground truncate max-w-[180px]">{shortAddress}</p>
                    {address && (
                      <button
        onClick={() => copyToClipboard(address, t('header.addressCopied'))}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title={t('header.address')}
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {did && (
                  <div>
          <p className="text-xs text-muted-foreground mb-1">{t('header.did')}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p title={did} className="text-xs font-mono text-foreground truncate max-w-[180px]">{did}</p>
                      <button
            onClick={() => copyToClipboard(did, t('header.didCopied'))}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        title={t('header.did')}
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {balance != null && (
                  <div>
          <p className="text-xs text-muted-foreground mb-1">{t('header.balance')}</p>
                    <p className="text-sm font-mono text-foreground">{balance} ETH</p>
                  </div>
                )}

                <div className="pt-2 border-t border-border space-y-2">
                  <Button variant="outline" size="sm" onClick={handleNetworkSwitch} className="w-full">
                    {t('header.switchNetwork')}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
                    {t('header.logout')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{t('header.connectYourWallet')}</p>
                {isWalletConnecting ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancelConnect} className="w-full">
                      {t('common.cancel')}
                    </Button>
                    <Button variant="default" size="sm" disabled className="w-full">
                      <span className="inline-flex items-center gap-2">
                        <Icon name="Loader2" size={16} className="animate-spin" />
                        {t('common.connecting')}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" size="sm" onClick={handleWalletConnect} className="w-full">
                    {t('header.connectWallet')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const MobileMenu = () => {
    if (!navOpen) return null;
    if (useOffCanvas) {
      // (Off-canvas retained but currently disabled by flag)
      return (
        <div className="fixed inset-0 z-[1600] flex md:hidden">
          <button aria-hidden onClick={() => setNavOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1550]" />
          <aside
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            className="relative w-80 max-w-full bg-background border-r border-border shadow-lg p-4 overflow-y-auto z-[1601]"
          >
            <div className="flex items-center justify-between mb-4">
              <Brand />
              <button onClick={() => setNavOpen(false)} className="p-2 rounded-md text-muted-foreground hover:text-foreground">
                <Icon name="X" size={18} />
              </button>
            </div>
            <nav className="space-y-2" aria-label="Mobile primary navigation">
              {navigationItems.map((item) => {
                const active = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setNavOpen(false)}
                    className={[
                      'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-clinical w-full',
                      active ? 'text-black dark:text-foreground font-semibold border border-border bg-transparent' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      );
    }
    // Inline fallback menu under header (simple & reliable)
    return (
      <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
        <nav className="space-y-1 px-3 py-3" aria-label="Mobile navigation">
          {navigationItems.map((item) => {
            const active = isActivePath(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setNavOpen(false)}
                className={[
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-clinical',
                  active ? 'text-black dark:text-foreground font-semibold border border-border bg-transparent' : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                ].join(' ')}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

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
            {/* Notifications */}
            
            <WalletControl />

            {/* Mobile hamburger */}
            <button
              onClick={() => setNavOpen(v => !v)}
              aria-label={navOpen ? t('common.closeNavigation') : t('common.openNavigation')}
              aria-expanded={navOpen}
              aria-controls="mobile-menu"
              className="md:hidden relative w-11 h-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black z-50"
            >
              {/* Hamburger / Close icon constructed with spans */}
              <span
                className={`absolute left-1/2 top-[30%] -translate-x-1/2 h-0.5 w-7 rounded bg-black transition-all duration-300 ${navOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-0.5 w-7 rounded bg-black transition-all duration-300 ${navOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-1/2 bottom-[30%] -translate-x-1/2 h-0.5 w-7 rounded bg-black transition-all duration-300 ${navOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
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