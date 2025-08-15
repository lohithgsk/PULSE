import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EmergencyAccessAuditLog = ({ auditLogs = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'contact_added', label: 'Contact Added' },
    { value: 'contact_verified', label: 'Contact Verified' },
    { value: 'break_glass_activated', label: 'Break Glass Activated' },
    { value: 'break_glass_deactivated', label: 'Break Glass Deactivated' },
    { value: 'emergency_access', label: 'Emergency Access' },
    { value: 'alert_configured', label: 'Alert Configured' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  // Mock audit log data
  const mockAuditLogs = auditLogs?.length > 0 ? auditLogs : [
    {
      id: '1',
      type: 'contact_added',
      timestamp: '2024-08-15T14:30:00Z',
      description: 'Emergency contact added: Jane Doe (Spouse)',
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      blockNumber: 18456789,
      gasUsed: '21000',
      details: {
        contactName: 'Jane Doe',
        relationship: 'Spouse',
        accessLevel: 'full'
      }
    },
    {
      id: '2',
      type: 'contact_verified',
      timestamp: '2024-08-15T15:45:00Z',
      description: 'Contact verification completed: Jane Doe',
      txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      blockNumber: 18456823,
      gasUsed: '18500',
      details: {
        contactName: 'Jane Doe',
        verificationMethod: 'SMS + Email'
      }
    },
    {
      id: '3',
      type: 'break_glass_activated',
      timestamp: '2024-08-14T09:15:00Z',
      description: 'Emergency Break Glass protocol activated',
      txHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      blockNumber: 18455234,
      gasUsed: '45000',
      details: {
        activatedBy: 'Patient',
        reason: 'Medical Emergency',
        duration: '2 hours'
      }
    },
    {
      id: '4',
      type: 'emergency_access',
      timestamp: '2024-08-14T09:30:00Z',
      description: 'Emergency access granted to Dr. Sarah Johnson',
      txHash: '0x4d5e6f7890abcdef1234567890abcdef12345678',
      blockNumber: 18455267,
      gasUsed: '32000',
      details: {
        accessedBy: 'Dr. Sarah Johnson',
        hospital: 'City General Hospital',
        accessLevel: 'full',
        recordsAccessed: ['Medical History', 'Current Medications', 'Lab Results']
      }
    },
    {
      id: '5',
      type: 'alert_configured',
      timestamp: '2024-08-13T16:20:00Z',
      description: 'Medical alert configured: Severe Allergic Reaction',
      txHash: '0x5e6f7890abcdef1234567890abcdef1234567890',
      blockNumber: 18454123,
      gasUsed: '28000',
      details: {
        condition: 'Severe Allergic Reaction',
        severity: 'critical',
        autoBreakGlass: true
      }
    }
  ];

  const filteredLogs = mockAuditLogs?.filter(log => filterType === 'all' || log?.type === filterType)?.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'contact_added': return 'UserPlus';
      case 'contact_verified': return 'CheckCircle';
      case 'break_glass_activated': return 'AlertTriangle';
      case 'break_glass_deactivated': return 'ShieldOff';
      case 'emergency_access': return 'Eye';
      case 'alert_configured': return 'Bell';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'contact_added': return 'text-clinical-green';
      case 'contact_verified': return 'text-primary';
      case 'break_glass_activated': return 'text-error';
      case 'break_glass_deactivated': return 'text-clinical-amber';
      case 'emergency_access': return 'text-clinical-amber';
      case 'alert_configured': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString(),
      time: date?.toLocaleTimeString()
    };
  };

  const handleViewTransaction = (txHash) => {
    // In a real app, this would open the blockchain explorer
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-medical-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Emergency Access Audit Log</h3>
            <p className="text-sm text-muted-foreground">
              Immutable blockchain record of all emergency access activities
            </p>
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select
          label="Filter by Activity"
          options={filterOptions}
          value={filterType}
          onChange={setFilterType}
          className="flex-1"
        />
        <Select
          label="Sort Order"
          options={sortOptions}
          value={sortOrder}
          onChange={setSortOrder}
          className="flex-1"
        />
      </div>
      {/* Audit Log Entries */}
      <div className="space-y-4">
        {filteredLogs?.length > 0 ? (
          filteredLogs?.map((log) => {
            const { date, time } = formatTimestamp(log?.timestamp);
            return (
              <div key={log?.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-background rounded-lg">
                      <Icon 
                        name={getActivityIcon(log?.type)} 
                        size={16} 
                        className={getActivityColor(log?.type)} 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground mb-1">
                        {log?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                        <span>{date}</span>
                        <span>{time}</span>
                        <span>Block #{log?.blockNumber?.toLocaleString()}</span>
                        <span>Gas: {log?.gasUsed}</span>
                      </div>
                      
                      {/* Transaction Hash */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-muted-foreground">Tx:</span>
                        <code className="text-xs font-mono text-card-foreground">
                          {log?.txHash?.substring(0, 10)}...{log?.txHash?.substring(log?.txHash?.length - 8)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTransaction(log?.txHash)}
                          iconName="ExternalLink"
                        />
                      </div>

                      {/* Additional Details */}
                      {log?.details && (
                        <div className="mt-3 p-3 rounded bg-background/50">
                          <h5 className="text-xs font-medium text-card-foreground mb-2">Details</h5>
                          <div className="space-y-1">
                            {Object.entries(log?.details)?.map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground capitalize">
                                  {key?.replace(/([A-Z])/g, ' $1')?.trim()}:
                                </span>
                                <span className="text-xs text-card-foreground">
                                  {Array.isArray(value) ? value?.join(', ') : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-full mx-auto mb-4">
              <Icon name="FileText" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">No Activities Found</h4>
            <p className="text-sm text-muted-foreground">
              No emergency access activities match your current filters.
            </p>
          </div>
        )}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground">
              {mockAuditLogs?.filter(log => log?.type === 'contact_added')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Contacts Added</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground">
              {mockAuditLogs?.filter(log => log?.type === 'break_glass_activated')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Break Glass Events</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground">
              {mockAuditLogs?.filter(log => log?.type === 'emergency_access')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Emergency Access</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-card-foreground">
              {mockAuditLogs?.length}
            </p>
            <p className="text-xs text-muted-foreground">Total Activities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccessAuditLog;