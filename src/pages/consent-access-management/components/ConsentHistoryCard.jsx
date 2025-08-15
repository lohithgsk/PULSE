import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConsentHistoryCard = ({ historyItem, onViewTransaction }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getActionIcon = (action) => {
    switch (action) {
      case 'granted': return 'Check';
      case 'revoked': return 'X';
      case 'expired': return 'Clock';
      case 'modified': return 'Edit';
      case 'emergency_access': return 'AlertTriangle';
      default: return 'FileText';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'granted': return 'text-clinical-green';
      case 'revoked': return 'text-error';
      case 'expired': return 'text-clinical-amber';
      case 'modified': return 'text-primary';
      case 'emergency_access': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case 'granted': return 'bg-clinical-green/10';
      case 'revoked': return 'bg-error/10';
      case 'expired': return 'bg-clinical-amber/10';
      case 'modified': return 'bg-primary/10';
      case 'emergency_access': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatActionText = (action) => {
    switch (action) {
      case 'granted': return 'Access Granted';
      case 'revoked': return 'Access Revoked';
      case 'expired': return 'Consent Expired';
      case 'modified': return 'Consent Modified';
      case 'emergency_access': return 'Emergency Access';
      default: return action?.replace('_', ' ')?.toUpperCase();
    }
  };

  const handleViewTransaction = () => {
    if (onViewTransaction) {
      onViewTransaction(historyItem?.transactionHash);
    }
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-medical-card transition-clinical">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActionBg(historyItem?.action)}`}>
              <Icon name={getActionIcon(historyItem?.action)} size={20} className={getActionColor(historyItem?.action)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{historyItem?.providerName}</h3>
              <p className="text-xs text-muted-foreground">{historyItem?.providerType}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-2 py-1 text-xs rounded-full ${getActionBg(historyItem?.action)}`}>
              <span className={getActionColor(historyItem?.action)}>{formatActionText(historyItem?.action)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(historyItem?.timestamp)}</p>
          </div>
        </div>

        {/* Data Categories */}
        {historyItem?.dataCategories && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Data Categories:</p>
            <div className="flex flex-wrap gap-1">
              {historyItem?.dataCategories?.map((category, index) => (
                <span key={index} className="px-2 py-1 bg-muted text-xs text-foreground rounded">
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transaction Details */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Transaction:</span>
            <span className="text-foreground font-mono">{historyItem?.transactionHash?.slice(0, 10)}...{historyItem?.transactionHash?.slice(-8)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Block:</span>
            <span className="text-foreground font-mono">#{historyItem?.blockNumber}</span>
          </div>
        </div>

        {/* Additional Details */}
        {historyItem?.details && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">Details:</p>
            <p className="text-xs text-foreground bg-muted/50 p-2 rounded">
              {historyItem?.details}
            </p>
          </div>
        )}

        {/* Gas Information */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Gas Used:</span>
          <span className="text-foreground">{historyItem?.gasUsed} ETH</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailsModal(true)}
            iconName="Info"
            iconPosition="left"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTransaction}
            iconName="ExternalLink"
            iconPosition="left"
          >
            Block Explorer
          </Button>
        </div>

        {/* Immutable Badge */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Shield" size={12} className="text-clinical-green" />
            <span className="text-xs text-clinical-green font-medium">Immutable Blockchain Record</span>
          </div>
        </div>
      </div>
      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-popover rounded-lg shadow-medical-modal max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">Consent History Details</h3>
                <p className="text-sm text-muted-foreground">{formatActionText(historyItem?.action)}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Action Summary */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Action Summary</h4>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActionBg(historyItem?.action)}`}>
                    <Icon name={getActionIcon(historyItem?.action)} size={20} className={getActionColor(historyItem?.action)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatActionText(historyItem?.action)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(historyItem?.timestamp)}</p>
                  </div>
                </div>
              </div>

              {/* Provider Information */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Provider Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{historyItem?.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">{historyItem?.providerType}</span>
                  </div>
                  {historyItem?.providerAddress && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wallet:</span>
                      <span className="text-foreground font-mono">{historyItem?.providerAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Categories */}
              {historyItem?.dataCategories && (
                <div>
                  <h4 className="text-sm font-medium text-popover-foreground mb-2">Data Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {historyItem?.dataCategories?.map((category, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-xs text-foreground rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Blockchain Details */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Blockchain Details</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Hash:</span>
                    <span className="text-foreground font-mono">{historyItem?.transactionHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Number:</span>
                    <span className="text-foreground font-mono">#{historyItem?.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Used:</span>
                    <span className="text-foreground">{historyItem?.gasUsed} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="text-foreground">Sepolia Testnet</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              {historyItem?.details && (
                <div>
                  <h4 className="text-sm font-medium text-popover-foreground mb-2">Additional Details</h4>
                  <div className="p-3 bg-muted/50 rounded text-xs text-foreground">
                    {historyItem?.details}
                  </div>
                </div>
              )}

              {/* NFT Information */}
              {historyItem?.nftTokenId && (
                <div>
                  <h4 className="text-sm font-medium text-popover-foreground mb-2">NFT Token</h4>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Token ID:</span>
                    <span className="text-foreground font-mono">#{historyItem?.nftTokenId}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                variant="default"
                onClick={handleViewTransaction}
                iconName="ExternalLink"
                iconPosition="left"
              >
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsentHistoryCard;