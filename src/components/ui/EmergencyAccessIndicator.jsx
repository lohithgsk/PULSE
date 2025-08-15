import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const EmergencyAccessIndicator = ({ 
  emergencyConfigured = false, 
  emergencyContacts = [], 
  onEmergencyActivate, 
  onManageContacts,
  isBreakGlassActive = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleEmergencyActivate = async () => {
    setIsActivating(true);
    try {
      if (onEmergencyActivate) {
        await onEmergencyActivate();
      }
    } finally {
      setIsActivating(false);
      setIsModalOpen(false);
    }
  };

  const handleManageContacts = () => {
    if (onManageContacts) {
      onManageContacts();
    }
    setIsModalOpen(false);
  };

  if (!emergencyConfigured && !isBreakGlassActive) {
    return null;
  }

  return (
    <>
      {/* Indicator Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-clinical ${
          isBreakGlassActive
            ? 'bg-error/10 border-error/20 text-error hover:bg-error/20' :'bg-clinical-amber/10 border-clinical-amber/20 text-clinical-amber hover:bg-clinical-amber/20'
        }`}
      >
        <Icon 
          name={isBreakGlassActive ? "AlertTriangle" : "Shield"} 
          size={16} 
          className={isBreakGlassActive ? "text-error" : "text-clinical-amber"} 
        />
        <span className="text-sm font-medium hidden sm:inline">
          {isBreakGlassActive ? 'Emergency Active' : 'Emergency Access'}
        </span>
        {isBreakGlassActive && (
          <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
        )}
      </button>
      {/* Emergency Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-popover rounded-lg shadow-medical-modal">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  isBreakGlassActive ? 'bg-error/10' : 'bg-clinical-amber/10'
                }`}>
                  <Icon 
                    name={isBreakGlassActive ? "AlertTriangle" : "Shield"} 
                    size={20} 
                    className={isBreakGlassActive ? "text-error" : "text-clinical-amber"} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">
                    {isBreakGlassActive ? 'Emergency Access Active' : 'Emergency Access'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isBreakGlassActive ? 'Break glass protocol is active' : 'Manage emergency access settings'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isBreakGlassActive ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="AlertTriangle" size={16} className="text-error" />
                      <span className="text-sm font-medium text-error">Break Glass Active</span>
                    </div>
                    <p className="text-sm text-error/80">
                      Emergency access has been activated. All access is being logged immutably on the blockchain.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-popover-foreground">Active Emergency Contacts</h4>
                    {emergencyContacts?.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={14} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{contact?.name}</p>
                            <p className="text-xs text-muted-foreground">{contact?.relationship}</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-clinical-green rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Info" size={16} className="text-clinical-amber" />
                      <span className="text-sm font-medium text-clinical-amber">Emergency Access Configured</span>
                    </div>
                    <p className="text-sm text-clinical-amber/80">
                      {emergencyContacts?.length} emergency contact{emergencyContacts?.length !== 1 ? 's' : ''} configured. 
                      They can access your medical records in case of emergency.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-popover-foreground">Emergency Contacts</h4>
                    {emergencyContacts?.slice(0, 3)?.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
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
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleManageContacts}
                iconName="Settings"
                iconPosition="left"
              >
                Manage Contacts
              </Button>

              {!isBreakGlassActive && (
                <Button
                  variant="destructive"
                  onClick={handleEmergencyActivate}
                  loading={isActivating}
                  iconName="AlertTriangle"
                  iconPosition="left"
                >
                  Activate Emergency
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyAccessIndicator;