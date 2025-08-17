import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useI18n } from '../../../i18n/I18nProvider';

const WalletStatusCard = ({ 
  walletConnected, 
  walletAddress, 
  currentNetwork, 
  userDID,
  onCopyDID,
  onShareDID,
  onNetworkSwitch 
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [showFullDID, setShowFullDID] = useState(false);
  const { t } = useI18n();

  const formatAddress = (address) => {
  if (!address) return t('header.notConnected');
    if (showFullAddress) return address;
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const formatDID = (did) => {
  if (!did) return t('dashboard.didNotGenerated') || 'Not generated';
    if (showFullDID) return did;
    return `${did?.slice(0, 20)}...${did?.slice(-10)}`;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here
  };

  const networkConfig = {
    'Sepolia': { color: 'text-clinical-amber', bg: 'bg-clinical-amber/10', icon: 'TestTube' },
    'Mainnet': { color: 'text-clinical-green', bg: 'bg-clinical-green/10', icon: 'Globe' },
    'Polygon': { color: 'text-purple-600', bg: 'bg-purple-600/10', icon: 'Hexagon' }
  };

  const config = networkConfig?.[currentNetwork] || networkConfig?.['Sepolia'];

  return (
    <div className="bg-card rounded-lg border border-border shadow-medical-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            walletConnected ? 'bg-clinical-green/10' : 'bg-clinical-red/10'
          }`}>
            <Icon 
              name={walletConnected ? "Wallet" : "WalletX"} 
              size={20} 
              className={walletConnected ? "text-clinical-green" : "text-clinical-red"} 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">{t('header.walletStatus')}</h3>
            <p className={`text-sm font-medium ${
              walletConnected ? 'text-clinical-green' : 'text-clinical-red'
            }`}>
              {walletConnected ? (t('common.connected') || 'Connected') : t('header.notConnected')}
            </p>
          </div>
        </div>
        
        {walletConnected && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-clinical-green rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">{t('dashboard.live') || 'Live'}</span>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-6 space-y-4">
        {walletConnected ? (
          <>
            {/* Network Status */}
            <div className={`p-4 rounded-lg ${config?.bg} border border-opacity-20`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={config?.icon} size={16} className={config?.color} />
                  <span className={`text-sm font-medium ${config?.color}`}>
                    {currentNetwork} {t('dashboard.network') || 'Network'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNetworkSwitch}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  {t('dashboard.switch') || 'Switch'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentNetwork === 'Sepolia' ? t('dashboard.testNetwork') || 'Test network for development and testing' : t('dashboard.productionNetwork') || 'Production blockchain network'
                }
              </p>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-card-foreground">{t('auth.connected.walletAddress')}</label>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-xs text-primary hover:underline"
                >
                  {showFullAddress ? t('common.hide') : (t('dashboard.showFull') || 'Show Full')}
                </button>
              </div>
              <div className="flex flex-wrap items-center space-x-2 p-3 rounded-lg bg-muted/50 border border-border">
                <code className="flex-1 text-sm font-mono text-card-foreground break-all">
                  {formatAddress(walletAddress)}
                </code>
                <button
                  onClick={() => copyToClipboard(walletAddress, 'address')}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title={t('header.address')}
                >
                  <Icon name="Copy" size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={onShareDID}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title={t('dashboard.shareAddress') || 'Share Address'}
                >
                  <Icon name="Share" size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Patient DID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-card-foreground">{t('dashboard.patientDid') || 'Patient DID'}</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFullDID(!showFullDID)}
                    className="text-xs text-primary hover:underline"
                  >
          {showFullDID ? t('common.hide') : (t('dashboard.showFull') || 'Show Full')}
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center space-x-2 p-3 rounded-lg bg-muted/50 border border-border">
                <code className="flex-1 text-sm font-mono text-card-foreground break-all">
                  {formatDID(userDID)}
                </code>
                <button
                  onClick={() => copyToClipboard(userDID, 'did')}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title={t('header.did')}
                >
                  <Icon name="Copy" size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={onShareDID}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title={t('dashboard.shareDid') || 'Share DID'}
                >
                  <Icon name="Share" size={14} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('auth.connected.didDescription')}
              </p>
            </div>

            {/* Connection Info */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.connectedVia') || 'Connected via'}</span>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} className="text-clinical-green" />
                  <span className="text-card-foreground font-medium">MetaMask</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-lg mx-auto mb-4">
              <Icon name="WalletX" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">{t('dashboard.walletNotConnected') || 'Wallet Not Connected'}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.connectWalletPrompt') || 'Connect your wallet to access PULSE features'}
            </p>
            <Button
              variant="default"
              size="sm"
              iconName="Wallet"
              iconPosition="left"
            >
              {t('header.connectWallet')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatusCard;