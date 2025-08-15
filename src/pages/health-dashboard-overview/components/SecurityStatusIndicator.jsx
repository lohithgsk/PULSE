import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SecurityStatusIndicator = ({ securityStatus, recentAccessAttempts }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSecurityLevelConfig = (level) => {
    const configs = {
      high: {
        color: 'text-clinical-green',
        bg: 'bg-clinical-green/10',
        border: 'border-clinical-green/20',
        icon: 'ShieldCheck',
        label: 'High Security'
      },
      medium: {
        color: 'text-clinical-amber',
        bg: 'bg-clinical-amber/10',
        border: 'border-clinical-amber/20',
        icon: 'Shield',
        label: 'Medium Security'
      },
      low: {
        color: 'text-clinical-red',
        bg: 'bg-clinical-red/10',
        border: 'border-clinical-red/20',
        icon: 'ShieldAlert',
        label: 'Security Alert'
      }
    };
    return configs?.[level] || configs?.medium;
  };

  const config = getSecurityLevelConfig(securityStatus?.level);

  const formatAccessTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccessTypeConfig = (type) => {
    const configs = {
      authorized: { icon: 'CheckCircle', color: 'text-clinical-green' },
      suspicious: { icon: 'AlertTriangle', color: 'text-clinical-amber' },
      blocked: { icon: 'XCircle', color: 'text-clinical-red' }
    };
    return configs?.[type] || configs?.authorized;
  };

  return (
    <div className={`bg-card rounded-lg border ${config?.border} shadow-medical-card`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${config?.bg}`}>
            <Icon name={config?.icon} size={20} className={config?.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Security Status</h3>
            <p className={`text-sm font-medium ${config?.color}`}>{config?.label}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 rounded-lg hover:bg-muted transition-clinical"
        >
          <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
        </button>
      </div>
      {/* Security Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Encryption Level</span>
              <Icon name="Lock" size={14} className="text-clinical-green" />
            </div>
            <p className="text-sm font-semibold text-card-foreground">{securityStatus?.encryptionLevel}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Last Audit</span>
              <Icon name="Search" size={14} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-card-foreground">{securityStatus?.lastAudit}</p>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-card-foreground">Active Security Features</h4>
          {securityStatus?.features?.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <Icon name={feature?.icon} size={16} className="text-clinical-green" />
                <span className="text-sm text-card-foreground">{feature?.name}</span>
              </div>
              <div className="w-2 h-2 bg-clinical-green rounded-full" />
            </div>
          ))}
        </div>

        {/* Recent Access Attempts */}
        {showDetails && (
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-card-foreground">Recent Access Attempts</h4>
              <span className="text-xs text-muted-foreground">{recentAccessAttempts?.length} in last 24h</span>
            </div>
            
            {recentAccessAttempts?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent access attempts</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentAccessAttempts?.map((attempt, index) => {
                  const accessConfig = getAccessTypeConfig(attempt?.type);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <Icon name={accessConfig?.icon} size={14} className={accessConfig?.color} />
                        <div>
                          <p className="text-sm text-card-foreground">{attempt?.source}</p>
                          <p className="text-xs text-muted-foreground">{attempt?.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{formatAccessTime(attempt?.timestamp)}</p>
                        <p className={`text-xs font-medium ${accessConfig?.color}`}>
                          {attempt?.type?.charAt(0)?.toUpperCase() + attempt?.type?.slice(1)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityStatusIndicator;