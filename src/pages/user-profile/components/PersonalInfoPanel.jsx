import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/ToastProvider';

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
  const [saving, setSaving] = useState(false);
  const handleChange = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.dob) return; 
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Personal info saved');
    }, 600);
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
      <p className="text-sm text-muted-foreground mt-1">Update your name and date of birth.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First" placeholder="Jane" required value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
        <Input label="Last" placeholder="Doe" required value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
        <Input label="DOB" type="date" required className="md:col-span-2" value={form.dob} onChange={e => handleChange('dob', e.target.value)} />
        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => setForm({ firstName: '', lastName: '', dob: '' })}>Reset</Button>
          <Button type="submit" disabled={saving || !form.firstName || !form.lastName || !form.dob} iconName={saving ? 'Loader2' : undefined} className={saving ? 'opacity-90' : ''}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoPanel;
