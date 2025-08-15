import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MedicalAlertsConfig = ({ alerts = [], onUpdateAlerts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [newAlert, setNewAlert] = useState({
    condition: '',
    severity: 'medium',
    description: '',
    immediateAccess: false,
    notifyContacts: true,
    autoActivateBreakGlass: false
  });

  const severityOptions = [
    { value: 'low', label: 'Low Priority', description: 'Standard medical attention' },
    { value: 'medium', label: 'Medium Priority', description: 'Urgent medical attention' },
    { value: 'high', label: 'High Priority', description: 'Emergency medical attention' },
    { value: 'critical', label: 'Critical', description: 'Life-threatening emergency' }
  ];

  const commonConditions = [
    'Severe Allergic Reaction',
    'Heart Attack',
    'Stroke',
    'Diabetic Emergency',
    'Seizure',
    'Respiratory Distress',
    'Severe Bleeding',
    'Loss of Consciousness',
    'Chest Pain',
    'Severe Injury'
  ];

  const handleAddAlert = () => {
    const alertToAdd = {
      ...newAlert,
      id: Date.now()?.toString(),
      dateAdded: new Date()?.toISOString()
    };
    
    onUpdateAlerts([...alerts, alertToAdd]);
    setNewAlert({
      condition: '',
      severity: 'medium',
      description: '',
      immediateAccess: false,
      notifyContacts: true,
      autoActivateBreakGlass: false
    });
    setIsEditing(false);
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setNewAlert(alert);
    setIsEditing(true);
  };

  const handleUpdateAlert = () => {
    const updatedAlerts = alerts?.map(alert => 
      alert?.id === editingAlert?.id ? { ...newAlert, id: editingAlert?.id } : alert
    );
    onUpdateAlerts(updatedAlerts);
    setEditingAlert(null);
    setIsEditing(false);
    setNewAlert({
      condition: '',
      severity: 'medium',
      description: '',
      immediateAccess: false,
      notifyContacts: true,
      autoActivateBreakGlass: false
    });
  };

  const handleDeleteAlert = (alertId) => {
    const updatedAlerts = alerts?.filter(alert => alert?.id !== alertId);
    onUpdateAlerts(updatedAlerts);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-clinical-green';
      case 'medium': return 'text-clinical-amber';
      case 'high': return 'text-error';
      case 'critical': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-clinical-green/10';
      case 'medium': return 'bg-clinical-amber/10';
      case 'high': return 'bg-error/10';
      case 'critical': return 'bg-error/20';
      default: return 'bg-muted/50';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-medical-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-error/10 rounded-lg">
            <Icon name="AlertTriangle" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Medical Alert Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Configure critical conditions that require immediate provider access
            </p>
          </div>
        </div>
        <Button
          variant="default"
          onClick={() => setIsEditing(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Alert
        </Button>
      </div>
      {/* Existing Alerts */}
      {alerts?.length > 0 && (
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-card-foreground">Configured Alerts</h4>
          {alerts?.map((alert) => (
            <div key={alert?.id} className={`p-4 rounded-lg border ${getSeverityBgColor(alert?.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className="text-sm font-medium text-card-foreground">{alert?.condition}</h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityBgColor(alert?.severity)} ${getSeverityColor(alert?.severity)}`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                  </div>
                  {alert?.description && (
                    <p className="text-sm text-muted-foreground mb-3">{alert?.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {alert?.immediateAccess && (
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                        Immediate Access
                      </span>
                    )}
                    {alert?.notifyContacts && (
                      <span className="px-2 py-1 text-xs bg-clinical-amber/10 text-clinical-amber rounded-full">
                        Notify Contacts
                      </span>
                    )}
                    {alert?.autoActivateBreakGlass && (
                      <span className="px-2 py-1 text-xs bg-error/10 text-error rounded-full">
                        Auto Break Glass
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAlert(alert)}
                    iconName="Edit"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert?.id)}
                    iconName="Trash2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add/Edit Alert Form */}
      {isEditing && (
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <h4 className="text-sm font-medium text-card-foreground mb-4">
            {editingAlert ? 'Edit Medical Alert' : 'Add New Medical Alert'}
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Medical Condition"
                options={commonConditions?.map(condition => ({ value: condition, label: condition }))}
                value={newAlert?.condition}
                onChange={(value) => setNewAlert({ ...newAlert, condition: value })}
                searchable
                placeholder="Select or type condition..."
              />
              <Select
                label="Severity Level"
                options={severityOptions}
                value={newAlert?.severity}
                onChange={(value) => setNewAlert({ ...newAlert, severity: value })}
              />
            </div>

            <Input
              label="Description (Optional)"
              type="text"
              placeholder="Additional details about this condition..."
              value={newAlert?.description}
              onChange={(e) => setNewAlert({ ...newAlert, description: e?.target?.value })}
            />

            <div className="space-y-3">
              <h5 className="text-sm font-medium text-card-foreground">Emergency Response Options</h5>
              <div className="space-y-2">
                <Checkbox
                  label="Grant immediate provider access"
                  description="Automatically grant healthcare providers access to relevant records"
                  checked={newAlert?.immediateAccess}
                  onChange={(e) => setNewAlert({ ...newAlert, immediateAccess: e?.target?.checked })}
                />
                <Checkbox
                  label="Notify emergency contacts"
                  description="Send notifications to all designated emergency contacts"
                  checked={newAlert?.notifyContacts}
                  onChange={(e) => setNewAlert({ ...newAlert, notifyContacts: e?.target?.checked })}
                />
                <Checkbox
                  label="Auto-activate Break Glass protocol"
                  description="Automatically activate emergency access for critical situations"
                  checked={newAlert?.autoActivateBreakGlass}
                  onChange={(e) => setNewAlert({ ...newAlert, autoActivateBreakGlass: e?.target?.checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingAlert(null);
                  setNewAlert({
                    condition: '',
                    severity: 'medium',
                    description: '',
                    immediateAccess: false,
                    notifyContacts: true,
                    autoActivateBreakGlass: false
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={editingAlert ? handleUpdateAlert : handleAddAlert}
                disabled={!newAlert?.condition}
                iconName={editingAlert ? "Save" : "Plus"}
                iconPosition="left"
              >
                {editingAlert ? 'Update Alert' : 'Add Alert'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Information Panel */}
      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-primary mb-1">How Medical Alerts Work</h5>
            <ul className="text-sm text-primary/80 space-y-1">
              <li>• Alerts are triggered when specific conditions are detected or reported</li>
              <li>• Immediate access bypasses normal consent requirements for emergency care</li>
              <li>• All alert activations are logged immutably on the blockchain</li>
              <li>• Break Glass auto-activation provides instant access to all medical records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAlertsConfig;