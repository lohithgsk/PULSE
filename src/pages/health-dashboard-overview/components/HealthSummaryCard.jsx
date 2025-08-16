import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const HealthSummaryCard = ({ healthSummary, onRefresh, isRefreshing = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const riskLevelConfig = {
    low: { color: 'text-clinical-green', bg: 'bg-clinical-green/10', icon: 'CheckCircle' },
    moderate: { color: 'text-clinical-amber', bg: 'bg-clinical-amber/10', icon: 'AlertTriangle' },
    high: { color: 'text-clinical-red', bg: 'bg-clinical-red/10', icon: 'AlertCircle' }
  };

  const config = riskLevelConfig?.[healthSummary?.riskLevel] || riskLevelConfig?.low;

  return (
    <div className="bg-card rounded-lg border border-border shadow-medical-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">AI Health Summary</h3>
            {isRefreshing ? (
              <Skeleton className="h-3 w-40 mt-2" />
            ) : (
              <p className="text-sm text-muted-foreground">Generated {healthSummary?.lastUpdated}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile: icon-only circular button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            loading={isRefreshing}
            iconName="RefreshCw"
            className="sm:hidden h-10 w-10 p-0 rounded-full"
            aria-label={isRefreshing ? 'Refreshing' : 'Refresh summary'}
          />

          {/* Desktop: compact labeled button */}
          <Button
            variant="ghost"
            size="xs"
            onClick={onRefresh}
            loading={isRefreshing}
            iconName="RefreshCw"
            iconPosition="left"
            className="hidden sm:inline-flex h-8 px-2 max-w-[96px]"
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Risk Level Indicator */}
        {isRefreshing ? (
          <Skeleton className="h-9 w-52 mb-4" />
        ) : (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${config?.bg} mb-4`}>
            <Icon name={config?.icon} size={16} className={config?.color} />
            <span className={`text-sm font-medium ${config?.color}`}>
              {healthSummary?.riskLevel?.charAt(0)?.toUpperCase() + healthSummary?.riskLevel?.slice(1)} Risk Level
            </span>
          </div>
        )}

        {/* Key Insights */}
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-card-foreground">Key Health Insights</h4>
          {isRefreshing ? (
            <>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-10/12" />
            </>
          ) : (
            healthSummary?.keyInsights?.slice(0, isExpanded ? undefined : 3)?.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                <p className="text-sm text-card-foreground">{insight}</p>
              </div>
            ))
          )}
        </div>

        {/* Expand/Collapse Button */}
        {healthSummary?.keyInsights?.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="mb-4"
          >
            {isExpanded ? 'Show Less' : `Show ${healthSummary?.keyInsights?.length - 3} More`}
          </Button>
        )}

        {/* Health Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {isRefreshing ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/50">
                <Skeleton className="h-4 w-24 sm:w-20 mb-2" />
                <Skeleton className="h-6 w-28 sm:w-24 mb-1" />
                <Skeleton className="h-3 w-20 sm:w-16" />
              </div>
            ))
          ) : (
            healthSummary?.metrics?.map((metric, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{metric?.label}</span>
                  <Icon name={metric?.icon} size={14} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-card-foreground">{metric?.value}</p>
                <p className="text-xs text-muted-foreground">{metric?.status}</p>
              </div>
            ))
          )}
        </div>

        {/* AI Transparency Notice */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-primary font-medium mb-1">AI Data Usage Transparency</p>
              <p className="text-xs text-primary/80">
                This summary was generated using encrypted health data. No personal information was shared with external AI services. 
                Analysis performed locally with privacy-preserving techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryCard;