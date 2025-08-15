import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

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
        <h2 className="text-xl font-semibold text-foreground mb-2">Wallet Connected Successfully</h2>
        <p className="text-sm text-muted-foreground">
          Your decentralized identity is now established and ready to access your health records
        </p>
      </div>

      {/* Wallet Information */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon name="Wallet" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Connected Wallet</span>
            </div>
            <span className="text-xs text-muted-foreground">{walletType}</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Wallet Address</span>
                <button
                  onClick={() => copyToClipboard(walletAddress, setCopied)}
                  className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-clinical"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={12} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-foreground">{formatAddress(walletAddress)}</span>
                <div className="w-2 h-2 bg-clinical-green rounded-full" />
              </div>
            </div>

            <div>
              <span className="text-xs text-muted-foreground">Balance</span>
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
              <span className="text-sm font-medium text-foreground">Decentralized Identity</span>
            </div>
            <button
              onClick={() => copyToClipboard(did, setDidCopied)}
              className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-clinical"
            >
              <Icon name={didCopied ? "Check" : "Copy"} size={12} />
              <span>{didCopied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Your unique healthcare identity on the blockchain
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
            Access Health Dashboard
          </Button>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              iconName="Settings"
              iconPosition="left"
            >
              Wallet Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onDisconnect}
              iconName="LogOut"
              iconPosition="left"
            >
              Disconnect
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Shield" size={16} className="text-clinical-green mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Secure Connection Established</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your wallet connection is encrypted and secure. Your private keys never leave your device, 
                and all health data access is logged immutably on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedWalletInfo;