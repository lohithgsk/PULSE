import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingRequestCard = ({ request, onApprove, onDeny }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      if (onApprove) {
        await onApprove(request?.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    try {
      if (onDeny) {
        await onDeny(request?.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-clinical-amber';
      case 'normal': return 'text-clinical-green';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-error/10 border-error/20';
      case 'high': return 'bg-clinical-amber/10 border-clinical-amber/20';
      case 'normal': return 'bg-clinical-green/10 border-clinical-green/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
    const diffMs = now - requestTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-medical-card transition-clinical">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="UserCheck" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">{request?.providerName}</h3>
              <p className="text-xs text-muted-foreground">{request?.providerType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 text-xs rounded-full border ${getPriorityBg(request?.priority)}`}>
              <span className={getPriorityColor(request?.priority)}>{request?.priority}</span>
            </div>
            <span className="text-xs text-muted-foreground">{formatTimeAgo(request?.timestamp)}</span>
          </div>
        </div>

        {/* Request Details */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Requested Access:</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {request?.requestedData?.map((data, index) => (
              <span key={index} className="px-2 py-1 bg-muted text-xs text-foreground rounded">
                {data}
              </span>
            ))}
          </div>
          {request?.duration && (
            <p className="text-xs text-muted-foreground">
              Duration: <span className="text-foreground">{request?.duration}</span>
            </p>
          )}
        </div>

        {/* Justification */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Justification:</p>
          <p className="text-xs text-foreground bg-muted/50 p-2 rounded">
            {request?.justification}
          </p>
        </div>

        {/* Provider Credentials */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">License:</span>
            <span className="text-foreground font-mono">{request?.providerLicense}</span>
          </div>
          {request?.institution && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Institution:</span>
              <span className="text-foreground">{request?.institution}</span>
            </div>
          )}
        </div>

        {/* Multi-Signature Requirements */}
        {request?.requiresMultiSig && (
          <div className="mb-4 p-3 bg-clinical-amber/10 border border-clinical-amber/20 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={14} className="text-clinical-amber" />
              <span className="text-xs font-medium text-clinical-amber">Multi-Signature Required</span>
            </div>
            <p className="text-xs text-clinical-amber/80">
              This request requires additional confirmation from {request?.multiSigRequiredCount} authorized parties.
            </p>
          </div>
        )}

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
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeny}
              loading={isProcessing}
              iconName="X"
              iconPosition="left"
            >
              Deny
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApprove}
              loading={isProcessing}
              iconName="Check"
              iconPosition="left"
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-popover rounded-lg shadow-medical-modal max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">Access Request Details</h3>
                <p className="text-sm text-muted-foreground">{request?.providerName}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Provider Information */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Provider Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{request?.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">{request?.providerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="text-foreground font-mono">{request?.providerLicense}</span>
                  </div>
                  {request?.institution && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Institution:</span>
                      <span className="text-foreground">{request?.institution}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Requested Data */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Requested Data Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {request?.requestedData?.map((data, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-xs text-foreground rounded">
                      {data}
                    </span>
                  ))}
                </div>
              </div>

              {/* Access Details */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Access Details</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground">{request?.duration || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className={getPriorityColor(request?.priority)}>{request?.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested:</span>
                    <span className="text-foreground">{formatTimeAgo(request?.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Full Justification */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Medical Justification</h4>
                <div className="p-3 bg-muted/50 rounded text-xs text-foreground">
                  {request?.justification}
                </div>
              </div>

              {/* Blockchain Information */}
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Blockchain Details</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Request Hash:</span>
                    <span className="text-foreground font-mono">{request?.requestHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Number:</span>
                    <span className="text-foreground font-mono">{request?.blockNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeny}
                loading={isProcessing}
                iconName="X"
                iconPosition="left"
              >
                Deny Request
              </Button>
              <Button
                variant="default"
                onClick={handleApprove}
                loading={isProcessing}
                iconName="Check"
                iconPosition="left"
              >
                Approve Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingRequestCard;