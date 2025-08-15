import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisHistory = ({ 
  analysisHistory = [], 
  onViewAnalysis, 
  onDeleteAnalysis,
  className = "" 
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const analysisTypes = {
    'summary': { name: 'Health Summary', icon: 'FileText', color: 'text-primary' },
    'chat': { name: 'AI Conversation', icon: 'MessageCircle', color: 'text-clinical-green' },
    'insight': { name: 'Health Insight', icon: 'Lightbulb', color: 'text-clinical-amber' },
    'recommendation': { name: 'Recommendation', icon: 'Target', color: 'text-clinical-red' }
  };

  const filteredHistory = analysisHistory?.filter(item => filter === 'all' || item?.type === filter)?.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (sortBy === 'type') {
        return a?.type?.localeCompare(b?.type);
      }
      return 0;
    });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return past?.toLocaleDateString();
  };

  const HistoryItem = ({ item }) => {
    const typeInfo = analysisTypes?.[item?.type] || analysisTypes?.summary;
    
    return (
      <div className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-clinical">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name={typeInfo?.icon} size={20} className={typeInfo?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {item?.title}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  typeInfo?.color === 'text-primary' ? 'bg-primary/10 text-primary' :
                  typeInfo?.color === 'text-clinical-green' ? 'bg-clinical-green/10 text-clinical-green' :
                  typeInfo?.color === 'text-clinical-amber'? 'bg-clinical-amber/10 text-clinical-amber' : 'bg-clinical-red/10 text-clinical-red'
                }`}>
                  {typeInfo?.name}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {item?.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{formatTimeAgo(item?.timestamp)}</span>
                </div>
                {item?.dataSourcesCount && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Database" size={12} />
                    <span>{item?.dataSourcesCount} sources</span>
                  </div>
                )}
                {item?.confidence && (
                  <div className="flex items-center space-x-1">
                    <Icon name="TrendingUp" size={12} />
                    <span>{Math.round(item?.confidence * 100)}% confidence</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-3">
            <button
              onClick={() => onViewAnalysis && onViewAnalysis(item?.id)}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
              title="View Analysis"
            >
              <Icon name="Eye" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={() => onDeleteAnalysis && onDeleteAnalysis(item?.id)}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
              title="Delete Analysis"
            >
              <Icon name="Trash2" size={16} className="text-muted-foreground hover:text-error" />
            </button>
          </div>
        </div>
        {/* Security Indicators */}
        <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} className="text-clinical-green" />
            <span className="text-xs text-clinical-green">Encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Link" size={12} className="text-primary" />
            <span className="text-xs text-primary">Blockchain Logged</span>
          </div>
          {item?.ipfsHash && (
            <div className="flex items-center space-x-1">
              <Icon name="Hash" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {item?.ipfsHash?.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Analysis History</h3>
          <p className="text-sm text-muted-foreground">
            Your AI-generated health insights and conversations
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{filteredHistory?.length} items</p>
          <p className="text-xs text-muted-foreground">in current view</p>
        </div>
      </div>
      {/* Filters and Sort */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="summary">Health Summaries</option>
              <option value="chat">AI Conversations</option>
              <option value="insight">Health Insights</option>
              <option value="recommendation">Recommendations</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
        >
          Export All
        </Button>
      </div>
      {/* History List */}
      <div className="space-y-3">
        {filteredHistory?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="History" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis History</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {filter === 'all' 
                ? "Start a conversation with the AI assistant to see your analysis history here."
                : `No ${analysisTypes?.[filter]?.name?.toLowerCase() || 'items'} found. Try changing the filter.`
              }
            </p>
          </div>
        ) : (
          filteredHistory?.map((item) => (
            <HistoryItem key={item?.id} item={item} />
          ))
        )}
      </div>
      {/* Data Retention Notice */}
      {filteredHistory?.length > 0 && (
        <div className="p-4 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-clinical-amber mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-clinical-amber mb-1">Data Retention</h4>
              <p className="text-xs text-clinical-amber/80">
                Analysis history is automatically deleted after 90 days. 
                Export important summaries to keep them permanently.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;