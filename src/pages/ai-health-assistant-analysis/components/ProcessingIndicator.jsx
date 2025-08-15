import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessingIndicator = ({ 
  isVisible = false, 
  stage = 'analyzing', 
  progress = 0,
  estimatedTime = null,
  className = "" 
}) => {
  if (!isVisible) return null;

  const stages = {
    'analyzing': {
      title: 'Analyzing Health Data',
      description: 'Processing your medical records and extracting key insights',
      icon: 'Brain',
      color: 'text-primary'
    },
    'generating': {
      title: 'Generating Summary',
      description: 'Creating a comprehensive health overview for your review',
      icon: 'FileText',
      color: 'text-clinical-green'
    },
    'encrypting': {
      title: 'Securing Data',
      description: 'Encrypting your analysis and preparing for blockchain storage',
      icon: 'Shield',
      color: 'text-clinical-amber'
    },
    'logging': {
      title: 'Blockchain Logging',
      description: 'Recording analysis metadata on the blockchain for audit trail',
      icon: 'Link',
      color: 'text-primary'
    },
    'finalizing': {
      title: 'Finalizing',
      description: 'Completing the analysis and preparing results',
      icon: 'CheckCircle',
      color: 'text-clinical-green'
    }
  };

  const currentStage = stages?.[stage] || stages?.analyzing;

  return (
    <div className={`fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md bg-popover rounded-lg shadow-medical-modal">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin">
                <Icon name={currentStage?.icon} size={32} className={currentStage?.color} />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-popover-foreground mb-2">
              {currentStage?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentStage?.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Estimated Time */}
          {estimatedTime && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Estimated time: {estimatedTime}
              </span>
            </div>
          )}

          {/* Stage Indicators */}
          <div className="space-y-3">
            {Object.entries(stages)?.map(([key, stageInfo], index) => {
              const isActive = key === stage;
              const isCompleted = Object.keys(stages)?.indexOf(key) < Object.keys(stages)?.indexOf(stage);
              
              return (
                <div key={key} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-clinical-green text-white' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={14} />
                    ) : isActive ? (
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {stageInfo?.title}
                    </p>
                  </div>
                  {isActive && (
                    <div className="animate-spin">
                      <Icon name="Loader2" size={16} className="text-primary" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={14} className="text-clinical-green mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Your health data is processed securely with end-to-end encryption. 
                  All analysis is logged immutably on the blockchain for transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingIndicator;