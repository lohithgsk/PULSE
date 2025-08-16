import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

const useSafeToast = () => {
  try {
    return useToast?.() ?? {
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      show: () => {},
      hide: () => {},
    };
  } catch {
    return {
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      show: () => {},
      hide: () => {},
    };
  }
};

const ContactInfoPanel = () => {
  const toast = useSafeToast();

  const [form, setForm] = useState({ email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Contact saved'); }, 600);
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
      <p className="text-sm text-muted-foreground mt-1">Keep your email and phone number up to date.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" type="email" placeholder="jane.doe@example.com" required className="md:col-span-2" value={form.email} onChange={e => handleChange('email', e.target.value)} />
        <Input label="Phone" type="tel" placeholder="+1 555 123 4567" className="md:col-span-2" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => setForm({ email: '', phone: '' })}>Reset</Button>
          <Button type="submit" disabled={saving || !form.email} iconName={saving ? 'Loader2' : undefined} className={saving ? 'opacity-90' : ''}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ContactInfoPanel;
