import React, { useState, useEffect } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { useI18n } from '../../../i18n/I18nProvider';

const SettingsPanel = () => {
  const toast = useToast?.() ?? { success(){}, error(){}, info(){}, warning(){}, show(){}, hide(){} };
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('pulse.profile.notifications');
      return raw ? JSON.parse(raw) : { email: true, sms: false, product: true };
    } catch { return { email: true, sms: false, product: true }; }
  });
  const { t, lang, setLang } = useI18n();
  const [language, setLanguage] = useState(() => localStorage.getItem('pulse.profile.lang') || 'en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('pulse.profile.notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);
  useEffect(() => {
    try { localStorage.setItem('pulse.profile.lang', language); } catch {}
    // Update global i18n as well
    if (language && language !== lang) {
      setLang(language);
    }
  }, [language, lang, setLang]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
  setTimeout(() => { setSaving(false); toast.success(t('settings.saved')); }, 600);
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
  <h2 className="text-lg font-semibold text-foreground">{t('settings.title')}</h2>
  <p className="text-sm text-muted-foreground mt-1">{t('settings.description')}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">{t('settings.notifications')}</h3>
          <div className="space-y-3">
            <Checkbox
              label={t('settings.emailUpdates')}
              checked={notifications.email}
              onChange={(e) => setNotifications(v => ({ ...v, email: e.target.checked }))}
            />
            <Checkbox
              label={t('settings.smsAlerts')}
              checked={notifications.sms}
              onChange={(e) => setNotifications(v => ({ ...v, sms: e.target.checked }))}
            />
            <Checkbox
              label={t('settings.productAnnouncements')}
              checked={notifications.product}
              onChange={(e) => setNotifications(v => ({ ...v, product: e.target.checked }))}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">{t('settings.language')}</h3>
          <Select
            options={[
              { label: t('settings.lang.english') || 'English', value: 'en' },
              { label: t('settings.lang.spanish') || 'Español', value: 'es' },
              { label: t('settings.lang.french') || 'Français', value: 'fr' },
              { label: t('settings.lang.tamil') || 'தமிழ்', value: 'ta' },
              { label: t('settings.lang.hindi') || 'हिन्दी', value: 'hi' },
              { label: t('settings.lang.german') || 'Deutsch', value: 'de' },
            ]}
            value={language}
            onChange={setLanguage}
            placeholder={t('common.selectLanguage')}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => { setNotifications({ email: true, sms: false, product: true }); setLanguage('en'); }}>{t('common.reset')}</Button>
          <Button type="submit" disabled={saving} iconName={saving ? 'Loader2' : undefined} className={saving ? 'opacity-90' : ''}>{saving ? t('common.saving') : t('common.save')}</Button>
        </div>
      </form>
    </section>
  );
};

export default SettingsPanel;
