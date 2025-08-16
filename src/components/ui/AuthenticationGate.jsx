import React, { useState } from 'react';
import Icon from '../AppIcon';


const AuthenticationGate = ({ onWalletConnect, onCancelConnect, isConnecting = false, error = null }) => {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'Wallet',
      description: 'Connect using MetaMask browser extension',
      popular: true
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'Smartphone',
      description: 'Connect using mobile wallet apps',
      popular: false
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'CreditCard',
      description: 'Connect using Coinbase Wallet',
      popular: false
    }
  ];

  const handleWalletSelect = (walletId) => {
    setSelectedWallet(walletId);
    if (onWalletConnect) {
      onWalletConnect(walletId);
    }
  };

  const SecurityFeature = ({ icon, title, description }) => (
    <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
        <Icon name={icon} size={20} className="text-primary" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto mb-4">
            <Icon name="Heart" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to PULSE</h1>
          <p className="text-muted-foreground">
            Connect your wallet to securely access your decentralized health records
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm text-error font-medium">Connection Failed</span>
            </div>
            <p className="text-sm text-error/80 mt-1">{error}</p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Choose your wallet</h3>
          {walletOptions?.map((wallet) => (
            <button
              key={wallet?.id}
              onClick={() => handleWalletSelect(wallet?.id)}
              disabled={isConnecting}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-clinical ${
                selectedWallet === wallet?.id
                  ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted'
              } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                  <Icon name={wallet?.icon} size={20} className="text-foreground" />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{wallet?.name}</span>
                    {wallet?.popular && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{wallet?.description}</p>
                </div>
              </div>
              {isConnecting && selectedWallet === wallet?.id ? (
                <div className="animate-spin">
                  <Icon name="Loader2" size={16} className="text-primary" />
                </div>
              ) : (
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* Cancel action when connecting */}
        {isConnecting && (
          <div className="mb-6">
            <button
              type="button"
              onClick={onCancelConnect}
              className="w-full py-2 text-sm rounded-md border border-border hover:bg-muted transition-clinical"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Security Features */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Your data is protected</h3>
          <SecurityFeature
            icon="Shield"
            title="End-to-End Encryption"
            description="Your medical data is encrypted and only accessible with your private keys"
          />
          <SecurityFeature
            icon="Lock"
            title="Blockchain Security"
            description="Immutable audit trails ensure your data integrity and access history"
          />
          <SecurityFeature
            icon="Eye"
            title="Full Transparency"
            description="You control who can access your data and can revoke permissions anytime"
          />
        </div>

        {/* Network Status */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-clinical-green rounded-full" />
              <span className="text-sm text-foreground">Sepolia Testnet</span>
            </div>
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Connected to Ethereum test network for secure development
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By connecting, you agree to our{' '}
            <button className="text-primary hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationGate;