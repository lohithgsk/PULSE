import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const RecentActivityFeed = ({ activities, onViewAll, isLoading = false }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const activityTypeConfig = {
    consent_granted: { icon: 'Shield', color: 'text-clinical-green', bg: 'bg-clinical-green/10' },
    consent_revoked: { icon: 'ShieldOff', color: 'text-clinical-red', bg: 'bg-clinical-red/10' },
    record_accessed: { icon: 'Eye', color: 'text-primary', bg: 'bg-primary/10' },
    ai_summary: { icon: 'Brain', color: 'text-accent', bg: 'bg-accent/10' },
    emergency_access: { icon: 'AlertTriangle', color: 'text-clinical-amber', bg: 'bg-clinical-amber/10' },
    data_shared: { icon: 'Share', color: 'text-secondary', bg: 'bg-secondary/10' }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const ActivityItem = ({ activity }) => {
    const config = activityTypeConfig?.[activity?.type] || activityTypeConfig?.record_accessed;
    
    return (
      <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-clinical">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${config?.bg}`}>
          <Icon name={config?.icon} size={16} className={config?.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-card-foreground truncate">{activity?.title}</p>
            <span className="text-xs text-muted-foreground [var(--color-surface-alt)]space-nowrap ml-2">
              {formatTimeAgo(activity?.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>
          
          {/* Transaction Hash Link */}
          {activity?.transactionHash && (
            <div className="flex items-center space-x-2">
              <Icon name="ExternalLink" size={12} className="text-muted-foreground" />
              <button
                onClick={() => window.open(`https://sepolia.etherscan.io/tx/${activity?.transactionHash}`, '_blank')}
                className="text-xs text-primary hover:underline font-mono"
              >
                {activity?.transactionHash?.slice(0, 10)}...{activity?.transactionHash?.slice(-8)}
              </button>
            </div>
          )}
          
          {/* Data Storage Indicator */}
          {activity?.storageType && (
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${
                activity?.storageType === 'ipfs' ? 'bg-accent' : 'bg-primary'
              }`} />
              <span className="text-xs text-muted-foreground">
                Stored on {activity?.storageType === 'ipfs' ? 'IPFS' : 'Blockchain'}
              </span>
              <div className="group relative">
                <Icon name="Info" size={12} className="text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover/80 backdrop-blur-md text-xs text-popover-foreground rounded shadow-medical-modal opacity-0 group-hover:opacity-100 transition-opacity [var(--color-surface-alt)]space-nowrap z-tooltip">
                  {activity?.storageType === 'ipfs' ?'Encrypted data stored on IPFS network' :'Metadata stored on Ethereum blockchain'
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-medical-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
            <Icon name="Activity" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Latest health data interactions</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      {/* Activity List */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-lg mx-auto mb-4">
              <Icon name="Activity" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">No Recent Activity</h4>
            <p className="text-sm text-muted-foreground">
              Your health data interactions will appear here
            </p>
          </div>
        ) : (
          <>
            {activities?.slice(0, visibleCount)?.map((activity) => (
              <ActivityItem key={activity?.id} activity={activity} />
            ))}
            
            {activities?.length > visibleCount && (
              <div className="p-4 text-center border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  iconName="ChevronDown"
                  iconPosition="right"
                >
                  Show More ({activities?.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;