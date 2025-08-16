import React from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit
    toast.success('Contact details updated');
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
      <p className="text-sm text-muted-foreground mt-1">Keep your email and phone number up to date.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Email" type="email" placeholder="jane.doe@example.com" required className="md:col-span-2" />
        <Input label="Phone" type="tel" placeholder="+1 555 123 4567" className="md:col-span-2" />

        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </section>
  );
};

export default ContactInfoPanel;
