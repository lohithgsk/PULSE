import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'End-to-End Encryption',
      description: 'Your medical data is encrypted and only accessible with your private keys',
      highlight: 'AES-256 encryption'
    },
    {
      icon: 'Lock',
      title: 'Blockchain Security',
      description: 'Immutable audit trails ensure your data integrity and access history',
      highlight: 'Ethereum-secured'
    },
    {
      icon: 'Eye',
      title: 'Full Transparency',
      description: 'You control who can access your data and can revoke permissions anytime',
      highlight: 'Complete control'
    },
    {
      icon: 'FileCheck',
      title: 'HIPAA Compliant',
      description: 'Built with healthcare privacy regulations and compliance standards',
      highlight: 'Healthcare grade'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your data is protected</h3>
        <p className="text-sm text-muted-foreground">
          MedLedger uses cutting-edge security to protect your health information
        </p>
      </div>
      <div className="space-y-3">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg flex-shrink-0">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium text-foreground">{feature?.title}</h4>
                <span className="px-2 py-0.5 text-xs bg-clinical-green/10 text-clinical-green rounded-full">
                  {feature?.highlight}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-lg bg-clinical-green/5 border border-clinical-green/20">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="CheckCircle" size={16} className="text-clinical-green" />
          <span className="text-sm font-medium text-clinical-green">Healthcare Certified</span>
        </div>
        <p className="text-xs text-clinical-green/80">
          MedLedger meets all major healthcare compliance standards including HIPAA, GDPR, and SOC 2 Type II.
        </p>
      </div>
    </div>
  );
};

export default SecurityFeatures;