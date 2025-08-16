import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BreakGlassPanel = ({ isActive, onActivate, onDeactivate, activationHistory = [] }) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleActivateBreakGlass = async () => {
    setIsActivating(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      onActivate();
      setIsConfirmModalOpen(false);
      setConfirmationCode('');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivateBreakGlass = async () => {
    try {
      onDeactivate();
    } catch (error) {
      console.error('Failed to deactivate break glass:', error);
    }
  };

  const generateConfirmationCode = () => {
    const code = Math.random()?.toString(36)?.substring(2, 8)?.toUpperCase();
    setConfirmationCode(code);
  };

  return (
    <>
      <div className={`p-6 rounded-lg border-2 ${
        isActive 
          ? 'bg-error/5 border-error/20' :'bg-clinical-amber/5 border-clinical-amber/20'
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            isActive ? 'bg-error/10' : 'bg-clinical-amber/10'
          }`}>
            <Icon 
              name={isActive ? "AlertTriangle" : "Shield"} 
              size={24} 
              className={isActive ? "text-error" : "text-clinical-amber"} 
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {isActive ? 'Emergency Access Active' : 'Break Glass Emergency Access'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isActive 
                ? 'Emergency access protocol is currently active. All access is being logged immutably on the blockchain.' :'Activate emergency access to allow designated contacts immediate access to your medical records during critical situations.'
              }
            </p>

            {isActive && (
              <div className="mb-4 p-3 rounded-lg bg-background/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">
                    Activated: {new Date()?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Link" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-mono text-card-foreground">
                    Tx: 0x1a2b3c4d...ef56
                  </span>
                  <Button variant="ghost" size="sm" iconName="ExternalLink">
                    View on Explorer
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {isActive ? (
                <Button 
                  variant="outline" 
                  onClick={handleDeactivateBreakGlass}
                  iconName="ShieldOff"
                  iconPosition="left"
                >
                  Deactivate Emergency Access
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={() => setIsConfirmModalOpen(true)}
                  iconName="AlertTriangle"
                  iconPosition="left"
                >
                  Activate Break Glass
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Warning Information */}
        {!isActive && (
          <div className="mt-6 p-4 rounded-lg bg-background/50 border border-border">
            <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span>Important Information</span>
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All emergency access activities are permanently logged on the blockchain</li>
              <li>• Designated contacts will receive immediate notifications</li>
              <li>• Access cannot be revoked once activated until manually deactivated</li>
              <li>• Emergency access overrides all existing consent restrictions</li>
            </ul>
          </div>
        )}

        {/* Activation History */}
        {activationHistory?.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-card-foreground mb-3">Recent Activations</h4>
            <div className="space-y-2">
              {activationHistory?.slice(0, 3)?.map((activation, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-clinical-amber rounded-full" />
                    <div>
                      <p className="text-sm text-card-foreground">
                        {activation?.type === 'activated' ? 'Emergency Activated' : 'Emergency Deactivated'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activation.timestamp)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" iconName="ExternalLink">
                    View Tx
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-popover/80 backdrop-blur-md rounded-lg shadow-medical-modal">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-lg">
                  <Icon name="AlertTriangle" size={24} className="text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">
                    Activate Emergency Access
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                  <h4 className="text-sm font-medium text-error mb-2">⚠️ Critical Warning</h4>
                  <ul className="text-sm text-error/80 space-y-1">
                    <li>• This will grant immediate access to ALL your medical records</li>
                    <li>• All designated emergency contacts will be notified</li>
                    <li>• Every access will be permanently logged on blockchain</li>
                    <li>• This action requires blockchain transaction confirmation</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-popover-foreground">
                    To confirm activation, click the button below to generate a confirmation code:
                  </p>
                  
                  {!confirmationCode ? (
                    <Button 
                      variant="outline" 
                      onClick={generateConfirmationCode}
                      iconName="Key"
                      iconPosition="left"
                      fullWidth
                    >
                      Generate Confirmation Code
                    </Button>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <p className="text-xs text-muted-foreground mb-1">Confirmation Code</p>
                      <p className="text-lg font-mono font-semibold text-foreground">{confirmationCode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setConfirmationCode('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleActivateBreakGlass}
                  loading={isActivating}
                  disabled={!confirmationCode}
                  iconName="AlertTriangle"
                  iconPosition="left"
                >
                  {isActivating ? 'Activating...' : 'Confirm Activation'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BreakGlassPanel;