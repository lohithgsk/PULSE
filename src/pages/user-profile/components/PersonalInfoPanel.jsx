import React from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit
    toast.success('Personal information updated');
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
      <p className="text-sm text-muted-foreground mt-1">Update your name and date of birth.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="Jane" required />
        <Input label="Last Name" placeholder="Doe" required />
        <Input label="Date of Birth" type="date" required className="md:col-span-2" />

        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoPanel;
