import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useI18n } from '../../../i18n/I18nProvider';

const ConnectedWalletInfo = ({ 
  walletAddress = '0x1234567890abcdef1234567890abcdef12345678',
  walletType = 'MetaMask',
  did = 'did:ethr:0x1234567890abcdef1234567890abcdef12345678',
  balance = '0.0523',
  onDisconnect,
  onNavigateToDashboard 
}) => {
  const [copied, setCopied] = useState(false);
  const [didCopied, setDidCopied] = useState(false);
  const { t } = useI18n();

  const formatAddress = (address) => {
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const copyToClipboard = async (text, setCopiedState) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-clinical-green/10 rounded-2xl mx-auto mb-4">
          <Icon name="CheckCircle" size={32} className="text-clinical-green" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{t('auth.connected.successTitle')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.connected.successBody')}
        </p>
      </div>

      {/* Wallet Information */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Wallet" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{t('auth.connected.wallet')}</span>
            </div>
            <span className="text-xs text-muted-foreground">{walletType}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{t('auth.connected.walletAddress')}</span>
                <button
                  onClick={() => copyToClipboard(walletAddress, setCopied)}
                  className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-clinical"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={12} />
                  <span>{copied ? t('common.copied') || 'Copied!' : t('common.copy') || 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-foreground">{formatAddress(walletAddress)}</span>
                <div className="w-2 h-2 bg-clinical-green rounded-full" />
              </div>
            </div>

            <div>
              <span className="text-xs text-muted-foreground">{t('header.balance')}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-foreground">{balance} ETH</span>
                <span className="text-xs text-muted-foreground">($127.45)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DID Information */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Fingerprint" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{t('auth.connected.did')}</span>
            </div>
            <button
              onClick={() => copyToClipboard(did, setDidCopied)}
              className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-clinical"
            >
              <Icon name={didCopied ? "Check" : "Copy"} size={12} />
              <span>{didCopied ? t('common.copied') || 'Copied!' : t('common.copy') || 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {t('auth.connected.didDescription')}
            </p>
            <div className="p-2 rounded bg-background/50 border border-border/50">
              <span className="text-xs font-mono text-foreground break-all">{did}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={onNavigateToDashboard}
            iconName="ArrowRight"
            iconPosition="right"
          >
            {t('auth.connected.goToDashboard')}
          </Button>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              iconName="Settings"
              iconPosition="left"
            >
              {t('auth.connected.walletSettings')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onDisconnect}
              iconName="LogOut"
              iconPosition="left"
            >
              {t('auth.connected.disconnect')}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-clinical-green mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">{t('auth.connected.secureTitle')}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('auth.connected.secureBody')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedWalletInfo;