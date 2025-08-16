import React from 'react';
import Icon from '../../../components/AppIcon';
import { useI18n } from '../../../i18n/I18nProvider';

const TrustIndicators = () => {
  const { t } = useI18n();
  const certifications = [
    {
      name: 'HIPAA',
      description: t('auth.trust.hipaa.desc'),
      icon: 'Shield',
      verified: true,
      color: 'clinical-green'
    },
    {
      name: 'SOC 2',
      description: t('auth.trust.soc2.desc'),
      icon: 'Lock',
      verified: true,
      color: 'primary'
    },
    {
      name: 'GDPR',
      description: t('auth.trust.gdpr.desc'),
      icon: 'FileCheck',
      verified: true,
      color: 'clinical-green'
    },
    {
      name: 'ISO 27001',
      description: t('auth.trust.iso.desc'),
      icon: 'Award',
      verified: true,
      color: 'primary'
    }
  ];

  const blockchainFeatures = [
    {
      title: t('auth.trust.immutable.title'),
      description: t('auth.trust.immutable.desc'),
      icon: 'Database'
    },
    {
      title: t('auth.trust.zkp.title'),
      description: t('auth.trust.zkp.desc'),
      icon: 'Eye'
    },
    {
      title: t('auth.trust.multisig.title'),
      description: t('auth.trust.multisig.desc'),
      icon: 'Users'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Healthcare Compliance */}
      <div>
  <h3 className="text-sm font-medium text-foreground mb-4">{t('auth.trust.healthcareCompliance')}</h3>
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
  <h3 className="text-sm font-medium text-foreground mb-4">{t('auth.trust.blockchainSecurity')}</h3>
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
          <span className="text-sm font-medium text-clinical-green">{t('auth.trust.securityStats')}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground">{t('auth.trust.uptime')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">256-bit</div>
            <div className="text-xs text-muted-foreground">{t('auth.trust.encryption')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">0</div>
            <div className="text-xs text-muted-foreground">{t('auth.trust.breaches')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">24/7</div>
            <div className="text-xs text-muted-foreground">{t('auth.trust.monitoring')}</div>
          </div>
        </div>
      </div>
      {/* Trust Score */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">{t('auth.trust.trustScore')}</span>
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={14} className="text-clinical-amber fill-current" />
            <span className="text-sm font-semibold text-foreground">4.9/5</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div className="bg-clinical-green h-2 rounded-full" style={{ width: '98%' }}></div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t('auth.trust.trustScoreDesc')}
        </p>
      </div>
    </div>
  );
};

export default TrustIndicators;