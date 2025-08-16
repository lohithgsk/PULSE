import React from 'react';
import Icon from '../../../components/AppIcon';
import { useI18n } from '../../../i18n/I18nProvider';

const SecurityFeatures = () => {
  const { t } = useI18n();

  const features = [
    {
      icon: 'Shield',
      title: t('auth.features.e2ee.title'),
      description: t('auth.features.e2ee.desc'),
      highlight: t('auth.features.e2ee.highlight')
    },
    {
      icon: 'Lock',
      title: t('auth.features.blockchain.title'),
      description: t('auth.features.blockchain.desc'),
      highlight: t('auth.features.blockchain.highlight')
    },
    {
      icon: 'Eye',
      title: t('auth.features.transparency.title'),
      description: t('auth.features.transparency.desc'),
      highlight: t('auth.features.transparency.highlight')
    },
    {
      icon: 'FileCheck',
      title: t('auth.features.hipaa.title'),
      description: t('auth.features.hipaa.desc'),
      highlight: t('auth.features.hipaa.highlight')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{t('auth.features.headerTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('auth.features.headerSubtitle')}
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
          <span className="text-sm font-medium text-clinical-green">{t('auth.features.healthcareCertified')}</span>
        </div>
        <p className="text-xs text-clinical-green/80">
          {t('auth.features.healthcareCertifiedBody')}
        </p>
      </div>
    </div>
  );
};

export default SecurityFeatures;