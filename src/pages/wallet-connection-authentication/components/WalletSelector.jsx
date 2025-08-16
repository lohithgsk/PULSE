import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { blockchainService } from '../../../utils/blockchainService';
import { useI18n } from '../../../i18n/I18nProvider';

const WalletSelector = ({ onWalletSelect, isConnecting, selectedWallet, error }) => {
  const [connectionError, setConnectionError] = useState(null);
  const { t } = useI18n();

  const walletOptions = [
    {
      id: 'metamask',
  name: 'MetaMask',
      icon: 'Wallet',
  description: t('auth.wallet.metaMaskDesc'),
      available: typeof window?.ethereum !== 'undefined',
      recommended: true
    },
    {
      id: 'walletconnect',
  name: 'WalletConnect',
      icon: 'Link',
  description: t('auth.wallet.walletConnectDesc'),
      available: true,
      recommended: false
    },
    {
      id: 'coinbase',
  name: 'Coinbase Wallet',
      icon: 'CreditCard',
  description: t('auth.wallet.coinbaseDesc'),
      available: true,
      recommended: false
    },
    {
      id: 'trust',
  name: 'Trust Wallet',
      icon: 'Shield',
  description: t('auth.wallet.trustDesc'),
      available: true,
      recommended: false
    }
  ];

  const handleWalletConnect = async (walletId) => {
    setConnectionError(null);
    
    if (walletId === 'metamask') {
      try {
        const walletInfo = await blockchainService?.connectWallet();
        onWalletSelect(walletInfo);
      } catch (error) {
        setConnectionError(error?.message);
        console.error('MetaMask connection error:', error);
      }
    } else {
      // For other wallets, use the existing mock implementation
      onWalletSelect(walletId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{t('auth.chooseWallet')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('auth.chooseWalletSubtitle')}
        </p>
      </div>

      {(error || connectionError) && (
        <div className="p-4 bg-clinical-red/10 border border-clinical-red/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-clinical-red" />
            <p className="text-sm text-clinical-red">{error || connectionError}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {walletOptions?.map((wallet) => (
          <button
            key={wallet?.id}
            onClick={() => handleWalletConnect(wallet?.id)}
            disabled={!wallet?.available || isConnecting || selectedWallet === wallet?.id}
            className={`w-full p-4 rounded-lg border transition-clinical text-left ${
              !wallet?.available
                ? 'border-border bg-muted/50 text-muted-foreground cursor-not-allowed'
                : isConnecting && selectedWallet === wallet?.id
                ? 'border-primary bg-primary/5 text-primary' :'border-border bg-card hover:bg-muted hover:border-primary/30 text-card-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  wallet?.recommended ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  {isConnecting && selectedWallet === wallet?.id ? (
                    <div className="animate-spin">
                      <Icon name="Loader2" size={20} className="text-primary" />
                    </div>
                  ) : (
                    <Icon 
                      name={wallet?.icon} 
                      size={20} 
                      className={wallet?.recommended ? 'text-primary' : 'text-muted-foreground'} 
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{wallet?.name}</span>
                    {wallet?.recommended && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {t('auth.recommended')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {wallet?.description}
                  </p>
                </div>
              </div>
              
              {!wallet?.available ? (
                <span className="text-xs text-muted-foreground">{t('auth.notAvailable')}</span>
              ) : isConnecting && selectedWallet === wallet?.id ? (
                <span className="text-xs text-primary">{t('common.connecting')}</span>
              ) : (
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Installation Help */}
      {walletOptions?.some(wallet => !wallet?.available) && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">{t('auth.install.metaMaskTitle')}</h4>
          <p className="text-xs text-muted-foreground mb-3">
            {t('auth.install.metaMaskBody')}
          </p>
          <Button
            variant="outline"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
          >
            {t('auth.install.installMetaMask')}
          </Button>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-clinical-green/10 border border-clinical-green/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-clinical-green mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-clinical-green mb-1">{t('auth.security.title')}</h4>
            <p className="text-xs text-clinical-green/80">
              {t('auth.security.body')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSelector;