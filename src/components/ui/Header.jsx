import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ walletConnected = false, currentNetwork = 'Sepolia', emergencyConfigured = false, onWalletConnect, onNetworkSwitch, onEmergencyActivate }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

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

  const handleWalletConnect = () => {
    if (onWalletConnect) {
      onWalletConnect();
    }
    setIsWalletDropdownOpen(false);
  };

  const handleNetworkSwitch = () => {
    if (onNetworkSwitch) {
      onNetworkSwitch();
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
                  <p className="text-sm font-mono text-foreground">0x1234...5678</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <Button variant="outline" size="sm" onClick={handleNetworkSwitch} className="w-full">
                    Switch Network
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Connect your wallet to access MedLedger</p>
                <Button variant="default" size="sm" onClick={handleWalletConnect} className="w-full">
                  Connect Wallet
                </Button>
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
            <span className="text-xl font-semibold text-foreground">MedLedger</span>
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