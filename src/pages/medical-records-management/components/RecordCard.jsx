import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordCard = ({ 
  record, 
  onView, 
  onDownload, 
  onShare, 
  onGenerateAISummary,
  isSelected,
  onSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      'allergy': 'AlertTriangle',
      'medication': 'Pill',
      'treatment': 'Stethoscope',
      'lab_result': 'FlaskConical',
      'imaging': 'Scan',
      'vaccination': 'Shield',
      'consultation': 'UserCheck',
      'surgery': 'Scissors',
      'emergency': 'Zap'
    };
    return icons?.[category] || 'FileText';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'allergy': 'text-red-600 bg-red-50 border-red-200',
      'medication': 'text-blue-600 bg-blue-50 border-blue-200',
      'treatment': 'text-green-600 bg-green-50 border-green-200',
      'lab_result': 'text-purple-600 bg-purple-50 border-purple-200',
      'imaging': 'text-indigo-600 bg-indigo-50 border-indigo-200',
      'vaccination': 'text-emerald-600 bg-emerald-50 border-emerald-200',
      'consultation': 'text-orange-600 bg-orange-50 border-orange-200',
      'surgery': 'text-pink-600 bg-pink-50 border-pink-200',
      'emergency': 'text-yellow-600 bg-yellow-50 border-yellow-200'
    };
    return colors?.[category] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStorageIcon = (storage) => {
    return storage === 'ipfs' ? 'Cloud' : 'Link';
  };

  const handleGenerateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      await onGenerateAISummary(record?.id);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-clinical hover:shadow-medical-card ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          {/* Selection Checkbox */}
          <button
            onClick={() => onSelect(record?.id)}
            className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-clinical ${
              isSelected 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-border hover:border-primary'
            }`}
          >
            {isSelected && <Icon name="Check" size={12} />}
          </button>

          {/* Category Icon */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${getCategoryColor(record?.category)}`}>
            <Icon name={getCategoryIcon(record?.category)} size={20} />
          </div>

          {/* Record Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-foreground truncate">{record?.title}</h3>
              {record?.isEncrypted && (
                <div className="group relative">
                  <Icon name="Lock" size={14} className="text-clinical-green" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity [var(--color-surface-alt)]space-nowrap z-tooltip">
                    End-to-end encrypted
                  </div>
                </div>
              )}
              {record?.hasAISummary && (
                <div className="group relative">
                  <Icon name="Brain" size={14} className="text-primary" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity [var(--color-surface-alt)]space-nowrap z-tooltip">
                    AI summary available
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{formatDate(record?.date)}</span>
              <span>{record?.provider}</span>
              <div className="flex items-center space-x-1">
                <Icon name={getStorageIcon(record?.storage)} size={12} />
                <span className="capitalize">{record?.storage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
      </div>
      {/* Preview */}
      <div className="mb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{record?.description}</p>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-border">
          {/* Key Details */}
          {record?.keyDetails && record?.keyDetails?.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-foreground mb-2">Key Details</h4>
              <div className="space-y-1">
                {record?.keyDetails?.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{detail?.label}</span>
                    <span className="text-foreground font-medium">{detail?.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {record?.aiSummary && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Brain" size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">AI Summary</span>
              </div>
              <p className="text-xs text-foreground">{record?.aiSummary}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(record)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(record)}
                iconName="Download"
                iconPosition="left"
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(record)}
                iconName="Share"
                iconPosition="left"
              >
                Share
              </Button>
            </div>

            {!record?.hasAISummary && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateAISummary}
                loading={isGeneratingSummary}
                iconName="Brain"
                iconPosition="left"
              >
                Generate AI Summary
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordCard;