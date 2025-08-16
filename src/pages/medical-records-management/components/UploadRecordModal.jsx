import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UploadRecordModal = ({ isOpen, onClose, onUpload }) => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: '',
    category: '',
    provider: '',
    date: '',
    storage: 'ipfs',
    isEncrypted: true,
    description: '',
    files: []
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categoryOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'allergy', label: 'Allergy' },
    { value: 'medication', label: 'Medication' },
    { value: 'lab_result', label: 'Lab Result' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'surgery', label: 'Surgery' }
  ];

  const storageOptions = [
    { value: 'ipfs', label: 'IPFS (Decentralized)' },
    { value: 'onchain', label: 'On-Chain' }
  ];

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList || []);
    updateForm('files', [...form.files, ...filesArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
      onUpload(form);
      setIsSubmitting(false);
      setForm({ title: '', category: '', provider: '', date: '', storage: 'ipfs', isEncrypted: true, description: '', files: [] });
    }, 1200);
  };

  const removeFile = (index) => {
    updateForm('files', form.files.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl bg-card border border-border rounded-t-2xl sm:rounded-xl shadow-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="Upload" size={16} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Upload Record</h2>
              <p className="text-xs text-muted-foreground">Add a new medical record securely</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-clinical">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => updateForm('title', e.target.value)} required />
            <Select label="Category" options={categoryOptions} value={form.category} onChange={(v) => updateForm('category', v)} />
            <Input label="Provider" value={form.provider} onChange={(e) => updateForm('provider', e.target.value)} />
            <Input type="date" label="Date" value={form.date} onChange={(e) => updateForm('date', e.target.value)} />
            <Select label="Storage" options={storageOptions} value={form.storage} onChange={(v) => updateForm('storage', v)} />
            <div className="flex items-center space-x-2 pt-1">
              <button type="button" onClick={() => updateForm('isEncrypted', !form.isEncrypted)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-clinical ${form.isEncrypted ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary'}`}>{form.isEncrypted && <Icon name="Check" size={12} />}</button>
              <span className="text-sm text-muted-foreground">Encrypted</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={4} className="w-full resize-y rounded-md border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter record description or clinical notes..." />
          </div>

          {/* File Uploader */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Attachments</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-clinical ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60'}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="FilePlus2" size={24} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Drag & drop files here or <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline">browse</button>
                </div>
                <p className="text-xs text-muted-foreground/70">PDF, Images, Text (max 25MB each)</p>
              </div>
            </div>
            {form.files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {form.files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 text-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Icon name="FileText" size={14} className="text-primary flex-shrink-0" />
                      <span className="truncate text-foreground/90">{f.name}</span>
                      <span className="text-muted-foreground">({Math.round(f.size/1024)} KB)</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-background/60 text-muted-foreground hover:text-foreground">
                      <Icon name="X" size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} iconName={isSubmitting ? 'Loader2' : 'Upload'} iconPosition="left">
              {isSubmitting ? 'Uploading...' : 'Upload Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadRecordModal;
