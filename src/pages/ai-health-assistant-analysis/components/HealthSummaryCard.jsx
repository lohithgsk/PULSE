import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HealthSummaryCard = ({ 
  summary, 
  onExport, 
  onRegenerateRequest,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  if (!summary) return null;

  const formatConfidenceLevel = (confidence) => {
    if (confidence >= 0.9) return { text: 'Very High', color: 'text-clinical-green' };
    if (confidence >= 0.8) return { text: 'High', color: 'text-clinical-green' };
    if (confidence >= 0.7) return { text: 'Good', color: 'text-clinical-amber' };
    if (confidence >= 0.6) return { text: 'Moderate', color: 'text-clinical-amber' };
    return { text: 'Low', color: 'text-clinical-red' };
  };

  const confidenceInfo = formatConfidenceLevel(summary?.confidence);

  const handleExport = () => {
    if (onExport) {
      onExport(summary?.id, exportFormat);
    }
  };

  const SummarySection = ({ title, content, icon }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Icon name={icon} size={16} className="text-primary" />
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
      </div>
      <div className="pl-6">
        <p className="text-sm text-muted-foreground [var(--color-surface-alt)]space-pre-line">{content}</p>
      </div>
    </div>
  );

  return (
    <div className={`border border-border rounded-lg bg-card ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{summary?.title}</h3>
              <p className="text-sm text-muted-foreground">{summary?.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.generatedAt)?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(summary.generatedAt)?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              confidenceInfo?.color === 'text-clinical-green' ? 'bg-clinical-green/10 text-clinical-green' :
              confidenceInfo?.color === 'text-clinical-amber'? 'bg-clinical-amber/10 text-clinical-amber' : 'bg-clinical-red/10 text-clinical-red'
            }`}>
              {confidenceInfo?.text} Confidence
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-muted-foreground" 
              />
            </button>
          </div>
        </div>
      </div>
      {/* Summary Content */}
      <div className="p-4">
        {/* Key Insights */}
        <div className="space-y-4">
          <SummarySection
            title="Key Health Insights"
            content={summary?.keyInsights}
            icon="Lightbulb"
          />
          
          {isExpanded && (
            <>
              <SummarySection
                title="Recent Changes"
                content={summary?.recentChanges}
                icon="TrendingUp"
              />
              
              <SummarySection
                title="Recommendations"
                content={summary?.recommendations}
                icon="Target"
              />
              
              <SummarySection
                title="Follow-up Actions"
                content={summary?.followUpActions}
                icon="CheckCircle"
              />
            </>
          )}
        </div>

        {/* Data Sources */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Database" size={16} className="text-muted-foreground" />
            <h4 className="text-sm font-medium text-foreground">Data Sources</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary?.dataSources?.map((source, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground"
              >
                {source}
              </span>
            ))}
          </div>
        </div>

        {/* Blockchain & Security Info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={14} className="text-clinical-green" />
              <span className="text-muted-foreground">Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Link" size={14} className="text-primary" />
              <span className="text-muted-foreground">Blockchain Logged</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground font-mono">
                {summary?.transactionHash?.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word Document</option>
              <option value="txt">Plain Text</option>
              <option value="json">JSON Data</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRegenerateRequest && onRegenerateRequest(summary?.id)}
              iconName="RefreshCw"
              iconPosition="left"
            >
              Regenerate
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Share"
              iconPosition="left"
            >
              Share with Doctor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryCard;