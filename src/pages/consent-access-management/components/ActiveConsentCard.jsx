import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveConsentCard = ({ consent, onRevoke, onViewDetails }) => {
  const [isRevoking, setIsRevoking] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      if (onRevoke) {
        await onRevoke(consent?.id);
      }
    } finally {
      setIsRevoking(false);
      setShowRevokeModal(false);
    }
  };

  const getConsentTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return 'AlertTriangle';
      case 'routine': return 'Heart';
      case 'research': return 'FlaskConical';
      default: return 'Shield';
    }
  };

  const getConsentTypeColor = (type) => {
    switch (type) {
      case 'emergency': return 'text-clinical-red';
      case 'routine': return 'text-clinical-green';
      case 'research': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const isExpiringSoon = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;
    const hoursRemaining = diffMs / (1000 * 60 * 60);
    return hoursRemaining <= 24 && hoursRemaining > 0;
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-medical-card transition-clinical backdrop-blur-lg bg-card/70 border border-white/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={getConsentTypeIcon(consent?.type)} size={20} className={getConsentTypeColor(consent?.type)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{consent?.providerName}</h3>
              <p className="text-xs text-muted-foreground">{consent?.providerType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {consent?.isMultiSig && (
              <div className="px-2 py-1 bg-clinical-amber/10 text-clinical-amber text-xs rounded-full">
                Multi-Sig
              </div>
            )}
            <div className={`px-2 py-1 text-xs rounded-full ${
              consent?.status === 'active' ?'bg-clinical-green/10 text-clinical-green' :'bg-muted text-muted-foreground'
            }`}>
              {consent?.status}
            </div>
          </div>
        </div>

        {/* Data Categories */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Granted Access:</p>
          <div className="flex flex-wrap gap-1">
            {consent?.dataCategories?.map((category, index) => (
              <span key={index} className="px-2 py-1 bg-muted text-xs text-foreground rounded">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Expiry Information */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Expires:</span>
            <span className={`text-xs font-medium ${
              isExpiringSoon(consent?.expiryDate) ? 'text-clinical-amber' : 'text-foreground'
            }`}>
              {formatTimeRemaining(consent?.expiryDate)}
            </span>
          </div>
          {isExpiringSoon(consent?.expiryDate) && (
            <div className="mt-2 p-2 bg-clinical-amber/10 border border-clinical-amber/20 rounded">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} className="text-clinical-amber" />
                <span className="text-xs text-clinical-amber">Expiring soon</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails && onViewDetails(consent)}
            iconName="Eye"
            iconPosition="left"
          >
            View Details
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowRevokeModal(true)}
            iconName="X"
            iconPosition="left"
          >
            Revoke
          </Button>
        </div>

        {/* NFT Token Info */}
        {consent?.nftTokenId && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">NFT Token:</span>
              <span className="text-xs font-mono text-foreground">#{consent?.nftTokenId}</span>
            </div>
          </div>
        )}
      </div>
      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-modal bg-black/60 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="w-full max-w-md bg-popover bg-opacity-90 backdrop-blur rounded-lg shadow-medical-modal border border-white/20">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">Revoke Consent</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-popover-foreground mb-3">
                  You are about to revoke access for <strong>{consent?.providerName}</strong>.
                </p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">This will:</p>
                  <ul className="text-xs text-foreground space-y-1">
                    <li>• Immediately block all data access</li>
                    <li>• Create an immutable blockchain record</li>
                    <li>• Notify the healthcare provider</li>
                    <li>• Burn the associated NFT token</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRevokeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRevoke}
                  loading={isRevoking}
                  iconName="X"
                  iconPosition="left"
                >
                  Revoke Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveConsentCard;