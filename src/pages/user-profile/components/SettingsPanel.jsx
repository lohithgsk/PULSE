import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

const SettingsPanel = () => {
  const toast = useToast?.() ?? { success(){}, error(){}, info(){}, warning(){}, show(){}, hide(){} };
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    product: true,
  });
  const [language, setLanguage] = useState('en');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Settings updated');
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <h2 className="text-lg font-semibold text-foreground">Application Settings</h2>
      <p className="text-sm text-muted-foreground mt-1">Control notifications, language, and preferences.</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Notifications</h3>
          <div className="space-y-3">
            <Checkbox
              label="Email updates"
              checked={notifications.email}
              onChange={(e) => setNotifications(v => ({ ...v, email: e.target.checked }))}
            />
            <Checkbox
              label="SMS alerts"
              checked={notifications.sms}
              onChange={(e) => setNotifications(v => ({ ...v, sms: e.target.checked }))}
            />
            <Checkbox
              label="Product announcements"
              checked={notifications.product}
              onChange={(e) => setNotifications(v => ({ ...v, product: e.target.checked }))}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Language</h3>
          <Select
            options={[
              { label: 'English', value: 'en' },
              { label: 'Español', value: 'es' },
              { label: 'Français', value: 'fr' },
            ]}
            value={language}
            onChange={setLanguage}
            placeholder="Select language"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </section>
  );
};

export default SettingsPanel;
