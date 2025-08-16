import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoPanel from './components/PersonalInfoPanel';
import ContactInfoPanel from './components/ContactInfoPanel';
import SettingsPanel from './components/SettingsPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useI18n } from '../../i18n/I18nProvider';

// Note: AppLayout is already applied by the protected route wrapper in Routes.jsx
// so this page should only return the inner content.

const UserProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate successful fetch
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Icon name="AlertTriangle" size={28} className="text-destructive" />
        </div>
  <h1 className="text-xl font-semibold text-foreground mb-2">{t('profile.error.title') || 'Profile Unavailable'}</h1>
  <p className="text-sm text-muted-foreground mb-6 max-w-sm">{error || (t('profile.error.body') || 'We could not load your profile right now.')}</p>
  <Button onClick={() => { setIsLoading(true); setError(null); setTimeout(()=> setIsLoading(false), 600); }} iconName="RefreshCw" iconPosition="left">{t('common.retry') || 'Retry'}</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-xl bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-64 rounded-xl bg-muted" />
            <div className="h-64 rounded-xl bg-muted" />
          </div>
          <div className="h-96 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6 xl:col-span-2">
          <PersonalInfoPanel />
          <ContactInfoPanel />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
