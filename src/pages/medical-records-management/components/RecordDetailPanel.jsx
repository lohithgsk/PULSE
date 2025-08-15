import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordDetailPanel = ({ record, isOpen, onClose, onDownload, onShare, onGenerateAISummary }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  if (!isOpen || !record) return null;

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'summary', label: 'AI Summary', icon: 'Brain' },
    { id: 'sharing', label: 'Sharing', icon: 'Share' },
    { id: 'audit', label: 'Audit Trail', icon: 'History' }
  ];

  return (
    <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-end">
      <div className="w-full max-w-2xl h-full bg-background shadow-medical-modal overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg border ${getCategoryColor(record?.category)}`}>
              <Icon name={getCategoryIcon(record?.category)} size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{record?.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{formatDate(record?.date)}</span>
                <span>{record?.provider}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 px-6 py-3 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-clinical ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                {record?.isEncrypted && (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-clinical-green/10 border border-clinical-green/20">
                    <Icon name="Lock" size={14} className="text-clinical-green" />
                    <span className="text-xs font-medium text-clinical-green">Encrypted</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-muted border border-border">
                  <Icon name={record?.storage === 'ipfs' ? 'Cloud' : 'Link'} size={14} className="text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground capitalize">{record?.storage}</span>
                </div>
                {record?.hasAISummary && (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Icon name="Brain" size={14} className="text-primary" />
                    <span className="text-xs font-medium text-primary">AI Summary</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{record?.description}</p>
              </div>

              {/* Key Details */}
              {record?.keyDetails && record?.keyDetails?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Key Details</h3>
                  <div className="space-y-3">
                    {record?.keyDetails?.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">{detail?.label}</span>
                        <span className="text-sm font-medium text-foreground">{detail?.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Content */}
              {record?.fullContent && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Full Report</h3>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{record?.fullContent}</pre>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {record?.attachments && record?.attachments?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {record?.attachments?.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center space-x-3">
                          <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{attachment?.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment?.size}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6">
              {record?.aiSummary ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Brain" size={20} className="text-primary" />
                    <h3 className="text-lg font-medium text-foreground">AI-Generated Summary</h3>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-foreground leading-relaxed">{record?.aiSummary}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Generated on {formatDate(record?.aiSummaryDate)} • Model: GPT-4 Medical
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
                    <Icon name="Brain" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No AI Summary Available</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Generate an AI-powered summary to get key insights and doctor-ready overview of this record.
                  </p>
                  <Button
                    onClick={handleGenerateAISummary}
                    loading={isGeneratingSummary}
                    iconName="Brain"
                    iconPosition="left"
                  >
                    Generate AI Summary
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sharing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Share This Record</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={() => onShare(record)}
                    iconName="Link"
                    iconPosition="left"
                    fullWidth
                  >
                    Generate Secure Access Link
                  </Button>
                  <Button
                    variant="outline"
                    iconName="Coins"
                    iconPosition="left"
                    fullWidth
                  >
                    Create NFT Consent Token
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Sharing Information</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  All sharing activities are logged immutably on the blockchain. Recipients will only have access for the specified duration.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Access History</h3>
                <div className="space-y-3">
                  {record?.auditTrail?.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <Icon name={entry?.action === 'view' ? 'Eye' : entry?.action === 'download' ? 'Download' : 'Share'} size={14} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{entry?.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{formatDate(entry?.timestamp)}</span>
                          <span>Tx: {entry?.txHash}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Icon name="History" size={32} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No access history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onDownload(record)}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => onShare(record)}
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordDetailPanel;