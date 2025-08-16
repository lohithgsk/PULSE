import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyBreakGlass = ({ isActive = false, onActivate, onDeactivate, emergencyContacts = [] }) => {
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showDeactivationModal, setShowDeactivationModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const handleActivate = async () => {
    if (confirmationText !== 'EMERGENCY ACCESS') {
      return;
    }

    setIsProcessing(true);
    try {
      if (onActivate) {
        await onActivate();
      }
    } finally {
      setIsProcessing(false);
      setShowActivationModal(false);
      setConfirmationText('');
    }
  };

  const handleDeactivate = async () => {
    setIsProcessing(true);
    try {
      if (onDeactivate) {
        await onDeactivate();
      }
    } finally {
      setIsProcessing(false);
      setShowDeactivationModal(false);
    }
  };

  if (isActive) {
    return (
      <>
        <div className="bg-error/10 border-2 border-error/20 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-error/20 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-error">Emergency Access Active</h3>
              <p className="text-sm text-error/80">Break glass protocol is currently active</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-error/5 border border-error/10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Shield" size={16} className="text-error" />
                <span className="text-sm font-medium text-error">All Access Logged</span>
              </div>
              <p className="text-xs text-error/80">
                Every data access is being recorded immutably on the blockchain. 
                Emergency contacts have full access to your medical records.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Active Emergency Contacts:</h4>
              {emergencyContacts?.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                      <p className="text-xs text-muted-foreground">{contact?.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-clinical-green rounded-full animate-pulse" />
                    <span className="text-xs text-clinical-green">Active</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowDeactivationModal(true)}
              iconName="X"
              iconPosition="left"
              fullWidth
            >
              Deactivate Emergency Access
            </Button>
          </div>
        </div>
        {/* Deactivation Modal */}
        {showDeactivationModal && (
          <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-popover/80 backdrop-blur-md rounded-lg shadow-medical-modal">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-clinical-green/10 rounded-lg flex items-center justify-center">
                    <Icon name="Check" size={20} className="text-clinical-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-popover-foreground">Deactivate Emergency Access</h3>
                    <p className="text-sm text-muted-foreground">Return to normal access control</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-popover-foreground mb-3">
                    This will restore normal consent-based access control and revoke emergency access for all contacts.
                  </p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">This action will:</p>
                    <ul className="text-xs text-foreground space-y-1">
                      <li>• Revoke emergency access for all contacts</li>
                      <li>• Restore normal consent requirements</li>
                      <li>• Create an immutable deactivation record</li>
                      <li>• Send notifications to emergency contacts</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeactivationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleDeactivate}
                    loading={isProcessing}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Deactivate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-clinical-amber/10 border-2 border-clinical-amber/20 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-clinical-amber/20 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={24} className="text-clinical-amber" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-clinical-amber">Emergency Break Glass</h3>
            <p className="text-sm text-clinical-amber/80">Override all consent restrictions in case of emergency</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-clinical-amber/5 border border-clinical-amber/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-clinical-amber" />
              <span className="text-sm font-medium text-clinical-amber">Emergency Protocol</span>
            </div>
            <p className="text-xs text-clinical-amber/80">
              This will grant immediate access to your medical records for all configured emergency contacts. 
              All access will be logged immutably on the blockchain.
            </p>
          </div>

          {emergencyContacts?.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Emergency Contacts ({emergencyContacts?.length}):</h4>
              {emergencyContacts?.slice(0, 3)?.map((contact, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                    <p className="text-xs text-muted-foreground">{contact?.relationship}</p>
                  </div>
                </div>
              ))}
              {emergencyContacts?.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{emergencyContacts?.length - 3} more contact{emergencyContacts?.length - 3 !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-muted/50 border border-border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertCircle" size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">No Emergency Contacts</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Configure emergency contacts before activating break glass protocol.
              </p>
            </div>
          )}

          <Button
            variant="destructive"
            onClick={() => setShowActivationModal(true)}
            disabled={emergencyContacts?.length === 0}
            iconName="AlertTriangle"
            iconPosition="left"
            fullWidth
          >
            Activate Emergency Access
          </Button>
        </div>
      </div>
      {/* Activation Modal */}
      {showActivationModal && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-popover/80 backdrop-blur-md rounded-lg shadow-medical-modal">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">Activate Emergency Access</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone easily</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-error/10 border border-error/20 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                    <span className="text-sm font-medium text-error">Warning</span>
                  </div>
                  <p className="text-xs text-error/80">
                    This will immediately grant full access to your medical records for all emergency contacts. 
                    All access will be permanently logged on the blockchain.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-popover-foreground">
                    Type <strong>EMERGENCY ACCESS</strong> to confirm:
                  </p>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e?.target?.value)}
                    placeholder="Type confirmation text"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowActivationModal(false);
                    setConfirmationText('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleActivate}
                  loading={isProcessing}
                  disabled={confirmationText !== 'EMERGENCY ACCESS'}
                  iconName="AlertTriangle"
                  iconPosition="left"
                >
                  Activate Emergency
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyBreakGlass;