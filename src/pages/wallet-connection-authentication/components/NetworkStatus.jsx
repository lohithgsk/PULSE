import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkStatus = ({ currentNetwork = 'Sepolia', networkStatus = 'connected', blockHeight = 4521890 }) => {
  const getNetworkColor = (network) => {
    switch (network?.toLowerCase()) {
      case 'mainnet':
        return 'text-clinical-green';
      case 'sepolia': case'testnet':
        return 'text-clinical-amber';
      case 'goerli':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-clinical-green';
      case 'connecting':
        return 'bg-clinical-amber';
      case 'disconnected':
        return 'bg-error';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Network Status</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(networkStatus)}`} />
            <span className="text-xs text-muted-foreground">{getStatusText(networkStatus)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Network</span>
            <span className={`text-sm font-medium ${getNetworkColor(currentNetwork)}`}>
              {currentNetwork}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Block Height</span>
            <span className="text-sm font-mono text-foreground">
              #{blockHeight?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Gas Price</span>
            <span className="text-sm font-mono text-foreground">12 gwei</span>
          </div>
        </div>

        {currentNetwork?.toLowerCase() === 'sepolia' && (
          <div className="mt-3 p-3 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-clinical-amber" />
              <span className="text-xs font-medium text-clinical-amber">Testnet Environment</span>
            </div>
            <p className="text-xs text-clinical-amber/80 mt-1">
              You're connected to Sepolia testnet. No real ETH will be used for transactions.
            </p>
          </div>
        )}
      </div>
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Transaction Fees</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Record Access</span>
            <span className="text-xs font-mono text-foreground">~$0.02</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Consent Update</span>
            <span className="text-xs font-mono text-foreground">~$0.05</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Emergency Access</span>
            <span className="text-xs font-mono text-clinical-green">Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;