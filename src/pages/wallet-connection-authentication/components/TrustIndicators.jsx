import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const certifications = [
    {
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act',
      icon: 'Shield',
      verified: true,
      color: 'clinical-green'
    },
    {
      name: 'SOC 2',
      description: 'Service Organization Control 2 Type II',
      icon: 'Lock',
      verified: true,
      color: 'primary'
    },
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      icon: 'FileCheck',
      verified: true,
      color: 'clinical-green'
    },
    {
      name: 'ISO 27001',
      description: 'Information Security Management',
      icon: 'Award',
      verified: true,
      color: 'primary'
    }
  ];

  const blockchainFeatures = [
    {
      title: 'Immutable Records',
      description: 'All access logs are permanently recorded on Ethereum blockchain',
      icon: 'Database'
    },
    {
      title: 'Zero-Knowledge Proofs',
      description: 'Verify data integrity without exposing sensitive information',
      icon: 'Eye'
    },
    {
      title: 'Multi-Signature Security',
      description: 'Critical operations require multiple confirmations',
      icon: 'Users'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Healthcare Compliance */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Healthcare Compliance</h3>
        <div className="grid grid-cols-2 gap-3">
          {certifications?.map((cert, index) => (
            <div key={index} className="p-3 rounded-lg bg-card border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`flex items-center justify-center w-6 h-6 bg-${cert?.color}/10 rounded`}>
                  <Icon name={cert?.icon} size={12} className={`text-${cert?.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{cert?.name}</span>
                {cert?.verified && (
                  <Icon name="CheckCircle" size={12} className="text-clinical-green" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cert?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Blockchain Security */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Blockchain Security</h3>
        <div className="space-y-3">
          {blockchainFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon name={feature?.icon} size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">{feature?.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Stats */}
      <div className="p-4 rounded-lg bg-clinical-green/5 border border-clinical-green/20">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="TrendingUp" size={16} className="text-clinical-green" />
          <span className="text-sm font-medium text-clinical-green">Security Statistics</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">256-bit</div>
            <div className="text-xs text-muted-foreground">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">0</div>
            <div className="text-xs text-muted-foreground">Data Breaches</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">24/7</div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
      {/* Trust Score */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Trust Score</span>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-clinical-amber fill-current" />
            <span className="text-sm font-semibold text-foreground">4.9/5</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div className="bg-clinical-green h-2 rounded-full" style={{ width: '98%' }}></div>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on security audits, compliance certifications, and user feedback
        </p>
      </div>
    </div>
  );
};

export default TrustIndicators;