import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';
import { useI18n } from '../../../i18n/I18nProvider';

const fallbackToast = {
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
  show: () => {},
  hide: () => {},
};

const PersonalInfoPanel = () => {
  let toast;
  try {
    toast = useToast() || fallbackToast;
  } catch {
    toast = fallbackToast;
  }

  const [form, setForm] = useState({ firstName: '', lastName: '', dob: '' });
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.dob) return; 
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
  toast.success(t('profile.personal.saved'));
    }, 600);
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
  <h2 className="text-lg font-semibold text-foreground">{t('profile.personal.title')}</h2>
  <p className="text-sm text-muted-foreground mt-1">{t('profile.personal.description')}</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label={t('profile.personal.first')} placeholder="Jane" required value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
  <Input label={t('profile.personal.last')} placeholder="Doe" required value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
  <Input label={t('profile.personal.dob')} type="date" required className="md:col-span-2" value={form.dob} onChange={e => handleChange('dob', e.target.value)} />
        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => setForm({ firstName: '', lastName: '', dob: '' })}>{t('common.reset')}</Button>
          <Button type="submit" disabled={saving || !form.firstName || !form.lastName || !form.dob} iconName={saving ? 'Loader2' : undefined} className={saving ? 'opacity-90' : ''}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoPanel;
