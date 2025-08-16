import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const NFTConsentGenerator = ({ onGenerate, isGenerating = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    providerName: '',
    providerType: 'doctor',
    dataCategories: [],
    duration: '30',
    customDuration: '',
    accessLevel: 'read',
    requiresMultiSig: false,
    emergencyOverride: false,
    description: ''
  });

  const providerTypeOptions = [
    { value: 'doctor', label: 'Doctor/Physician' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'specialist', label: 'Specialist' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'insurance', label: 'Insurance Provider' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'lab', label: 'Laboratory' }
  ];

  const durationOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' },
    { value: 'custom', label: 'Custom duration' }
  ];

  const accessLevelOptions = [
    { value: 'read', label: 'Read Only' },
    { value: 'read_write', label: 'Read & Write' },
    { value: 'full', label: 'Full Access' }
  ];

  const dataCategoryOptions = [
    'Medical History',
    'Prescriptions',
    'Lab Results',
    'Imaging Reports',
    'Allergies',
    'Immunizations',
    'Vital Signs',
    'Mental Health',
    'Surgical History',
    'Emergency Contacts'
  ];

  const handleDataCategoryChange = (category, checked) => {
    setFormData(prev => ({
      ...prev,
      dataCategories: checked
        ? [...prev?.dataCategories, category]
        : prev?.dataCategories?.filter(c => c !== category)
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const consentData = {
      ...formData,
      duration: formData?.duration === 'custom' ? formData?.customDuration : formData?.duration,
      expiryDate: new Date(Date.now() + (parseInt(formData.duration === 'custom' ? formData.customDuration : formData.duration) * 24 * 60 * 60 * 1000))
    };

    if (onGenerate) {
      await onGenerate(consentData);
    }
    
    setIsModalOpen(false);
    setFormData({
      providerName: '',
      providerType: 'doctor',
      dataCategories: [],
      duration: '30',
      customDuration: '',
      accessLevel: 'read',
      requiresMultiSig: false,
      emergencyOverride: false,
      description: ''
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Coins" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">NFT Consent Generator</h3>
            <p className="text-sm text-muted-foreground">Create tokenized consent with custom permissions</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">NFT-Based Consent</span>
            </div>
            <p className="text-xs text-primary/80">
              Generate a unique NFT token that represents specific healthcare access permissions. 
              This token can be transferred, revoked, or modified with full blockchain transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Shield" size={14} className="text-clinical-green" />
                <span className="text-xs font-medium text-clinical-green">Secure</span>
              </div>
              <p className="text-xs text-muted-foreground">Cryptographically secured permissions</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Clock" size={14} className="text-clinical-amber" />
                <span className="text-xs font-medium text-clinical-amber">Time-Limited</span>
              </div>
              <p className="text-xs text-muted-foreground">Automatic expiry and revocation</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Eye" size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Transparent</span>
              </div>
              <p className="text-xs text-muted-foreground">Full audit trail on blockchain</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="Zap" size={14} className="text-clinical-green" />
                <span className="text-xs font-medium text-clinical-green">Instant</span>
              </div>
              <p className="text-xs text-muted-foreground">Immediate access control</p>
            </div>
          </div>

          <Button
            variant="default"
            onClick={() => setIsModalOpen(true)}
            iconName="Plus"
            iconPosition="left"
            fullWidth
          >
            Generate New NFT Consent
          </Button>
        </div>
      </div>
      {/* Generation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-modal bg-black/60 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="w-full max-w-md bg-popover bg-opacity-90 backdrop-blur rounded-lg shadow-medical-modal border border-white/20 overflow-y-auto"
               style={{ maxHeight: '90vh' }}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-popover-foreground">Generate NFT Consent</h3>
                <p className="text-sm text-muted-foreground">Create a tokenized healthcare access permission</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Provider Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-popover-foreground">Provider Information</h4>
                
                <Input
                  label="Provider Name"
                  type="text"
                  placeholder="Enter healthcare provider name"
                  value={formData?.providerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, providerName: e?.target?.value }))}
                  required
                />

                <Select
                  label="Provider Type"
                  options={providerTypeOptions}
                  value={formData?.providerType}
                  onChange={(value) => setFormData(prev => ({ ...prev, providerType: value }))}
                  required
                />
              </div>

              {/* Data Categories */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-popover-foreground">Data Access Permissions</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {dataCategoryOptions?.map((category) => (
                    <Checkbox
                      key={category}
                      label={category}
                      checked={formData?.dataCategories?.includes(category)}
                      onChange={(e) => handleDataCategoryChange(category, e?.target?.checked)}
                    />
                  ))}
                </div>
              </div>

              {/* Access Configuration */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-popover-foreground">Access Configuration</h4>
                
                <Select
                  label="Access Level"
                  options={accessLevelOptions}
                  value={formData?.accessLevel}
                  onChange={(value) => setFormData(prev => ({ ...prev, accessLevel: value }))}
                  required
                />

                <Select
                  label="Duration"
                  options={durationOptions}
                  value={formData?.duration}
                  onChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                  required
                />

                {formData?.duration === 'custom' && (
                  <Input
                    label="Custom Duration (days)"
                    type="number"
                    placeholder="Enter number of days"
                    value={formData?.customDuration}
                    onChange={(e) => setFormData(prev => ({ ...prev, customDuration: e?.target?.value }))}
                    min="1"
                    max="3650"
                    required
                  />
                )}
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-popover-foreground">Advanced Options</h4>
                
                <Checkbox
                  label="Require Multi-Signature Approval"
                  description="Additional confirmation required for sensitive operations"
                  checked={formData?.requiresMultiSig}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresMultiSig: e?.target?.checked }))}
                />

                <Checkbox
                  label="Allow Emergency Override"
                  description="Can be accessed during emergency break glass scenarios"
                  checked={formData?.emergencyOverride}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyOverride: e?.target?.checked }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-popover-foreground">
                  Description (Optional)
                </label>
                <textarea
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Add any additional notes or context for this consent..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Gas Estimation */}
              <div className="p-4 bg-muted/50 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Estimated Gas Cost</span>
                  <span className="text-sm text-foreground">~0.0045 ETH</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This includes NFT minting, metadata storage, and smart contract execution
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={isGenerating}
                  disabled={formData?.dataCategories?.length === 0 || !formData?.providerName}
                  iconName="Coins"
                  iconPosition="left"
                >
                  Generate NFT Consent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTConsentGenerator;