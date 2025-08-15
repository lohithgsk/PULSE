import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const EmergencyContactCard = ({ contact, onUpdate, onDelete, onVerify, isEditing, onEditToggle }) => {
  const [editData, setEditData] = useState(contact);

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse/Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Close Friend' },
    { value: 'doctor', label: 'Primary Doctor' },
    { value: 'caregiver', label: 'Caregiver' },
    { value: 'other', label: 'Other' }
  ];

  const accessLevelOptions = [
    { value: 'basic', label: 'Basic Info Only', description: 'Name, age, emergency contacts' },
    { value: 'medical', label: 'Medical Summary', description: 'Conditions, medications, allergies' },
    { value: 'full', label: 'Full Access', description: 'Complete medical records and history' }
  ];

  const handleSave = () => {
    onUpdate(editData);
    onEditToggle();
  };

  const handleCancel = () => {
    setEditData(contact);
    onEditToggle();
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-clinical-green';
      case 'pending': return 'text-clinical-amber';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getVerificationStatusIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'AlertCircle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-medical-card">
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Edit Emergency Contact</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={editData?.name}
              onChange={(e) => setEditData({ ...editData, name: e?.target?.value })}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={editData?.phone}
              onChange={(e) => setEditData({ ...editData, phone: e?.target?.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editData?.email}
              onChange={(e) => setEditData({ ...editData, email: e?.target?.value })}
            />
            <Select
              label="Relationship"
              options={relationshipOptions}
              value={editData?.relationship}
              onChange={(value) => setEditData({ ...editData, relationship: value })}
              required
            />
          </div>

          <Select
            label="Access Level"
            description="What information can this contact access during emergencies?"
            options={accessLevelOptions}
            value={editData?.accessLevel}
            onChange={(value) => setEditData({ ...editData, accessLevel: value })}
            required
          />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-card-foreground">Emergency Permissions</h4>
            <div className="space-y-2">
              <Checkbox
                label="Can authorize medical procedures"
                checked={editData?.permissions?.canAuthorize || false}
                onChange={(e) => setEditData({
                  ...editData,
                  permissions: { ...editData?.permissions, canAuthorize: e?.target?.checked }
                })}
              />
              <Checkbox
                label="Can access financial information"
                checked={editData?.permissions?.canAccessFinancial || false}
                onChange={(e) => setEditData({
                  ...editData,
                  permissions: { ...editData?.permissions, canAccessFinancial: e?.target?.checked }
                })}
              />
              <Checkbox
                label="Can make healthcare decisions"
                checked={editData?.permissions?.canMakeDecisions || false}
                onChange={(e) => setEditData({
                  ...editData,
                  permissions: { ...editData?.permissions, canMakeDecisions: e?.target?.checked }
                })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{contact?.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{contact?.relationship}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Icon 
                    name={getVerificationStatusIcon(contact?.verificationStatus)} 
                    size={14} 
                    className={getVerificationStatusColor(contact?.verificationStatus)} 
                  />
                  <span className={`text-xs font-medium ${getVerificationStatusColor(contact?.verificationStatus)}`}>
                    {contact?.verificationStatus === 'verified' ? 'Verified' : 
                     contact?.verificationStatus === 'pending' ? 'Verification Pending' : 
                     contact?.verificationStatus === 'failed' ? 'Verification Failed' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onEditToggle} iconName="Edit" />
              <Button variant="ghost" size="sm" onClick={() => onDelete(contact?.id)} iconName="Trash2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              <p className="text-sm text-card-foreground">{contact?.phone}</p>
            </div>
            {contact?.email && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-card-foreground">{contact?.email}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Access Level</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                contact?.accessLevel === 'full' ? 'bg-error' :
                contact?.accessLevel === 'medical' ? 'bg-clinical-amber' : 'bg-clinical-green'
              }`} />
              <span className="text-sm text-card-foreground capitalize">
                {accessLevelOptions?.find(opt => opt?.value === contact?.accessLevel)?.label}
              </span>
            </div>
          </div>

          {contact?.permissions && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Emergency Permissions</p>
              <div className="flex flex-wrap gap-2">
                {contact?.permissions?.canAuthorize && (
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    Can Authorize Procedures
                  </span>
                )}
                {contact?.permissions?.canAccessFinancial && (
                  <span className="px-2 py-1 text-xs bg-clinical-amber/10 text-clinical-amber rounded-full">
                    Financial Access
                  </span>
                )}
                {contact?.permissions?.canMakeDecisions && (
                  <span className="px-2 py-1 text-xs bg-error/10 text-error rounded-full">
                    Healthcare Decisions
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Added {new Date(contact.dateAdded)?.toLocaleDateString()}
            </div>
            {contact?.verificationStatus !== 'verified' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onVerify(contact?.id)}
                iconName="Shield"
                iconPosition="left"
              >
                Verify Contact
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactCard;