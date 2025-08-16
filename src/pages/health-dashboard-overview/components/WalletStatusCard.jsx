import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

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

  const formatAddress = (address) => {
    if (!address) return 'Not connected';
    if (showFullAddress) return address;
    return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  };

  const formatDID = (did) => {
    if (!did) return 'Not generated';
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
            <h3 className="text-lg font-semibold text-card-foreground">Wallet Status</h3>
            <p className={`text-sm font-medium ${
              walletConnected ? 'text-clinical-green' : 'text-clinical-red'
            }`}>
              {walletConnected ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
        
        {walletConnected && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-clinical-green rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
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
                    {currentNetwork} Network
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNetworkSwitch}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Switch
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentNetwork === 'Sepolia' ?'Test network for development and testing' :'Production blockchain network'
                }
              </p>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-card-foreground">Wallet Address</label>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-xs text-primary hover:underline"
                >
                  {showFullAddress ? 'Hide' : 'Show Full'}
                </button>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50 border border-border">
                <code className="flex-1 text-sm font-mono text-card-foreground">
                  {formatAddress(walletAddress)}
                </code>
                <button
                  onClick={() => copyToClipboard(walletAddress, 'address')}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title="Copy address"
                >
                  <Icon name="Copy" size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Patient DID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-card-foreground">Patient DID</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFullDID(!showFullDID)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showFullDID ? 'Hide' : 'Show Full'}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50 border border-border">
                <code className="flex-1 text-sm font-mono text-card-foreground">
                  {formatDID(userDID)}
                </code>
                <button
                  onClick={() => copyToClipboard(userDID, 'did')}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title="Copy DID"
                >
                  <Icon name="Copy" size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={onShareDID}
                  className="p-1 rounded hover:bg-muted transition-clinical"
                  title="Share DID"
                >
                  <Icon name="Share" size={14} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your unique decentralized identifier for healthcare data
              </p>
            </div>

            {/* Connection Info */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Connected via</span>
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
            <h4 className="text-sm font-medium text-card-foreground mb-2">Wallet Not Connected</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet to access PULSE features
            </p>
            <Button
              variant="default"
              size="sm"
              iconName="Wallet"
              iconPosition="left"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatusCard;