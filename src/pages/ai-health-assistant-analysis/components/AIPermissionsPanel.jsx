import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIPermissionsPanel = ({ 
  permissions = {}, 
  onTogglePermission, 
  onUpdatePermission,
  className = "" 
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const permissionCategories = [
    {
      id: 'medical_records',
      name: 'Medical Records',
      description: 'Lab results, diagnoses, treatment history',
      icon: 'FileText',
      enabled: permissions?.medical_records || false,
      subcategories: [
        { id: 'lab_results', name: 'Lab Results', enabled: permissions?.lab_results || false },
        { id: 'diagnoses', name: 'Diagnoses', enabled: permissions?.diagnoses || false },
        { id: 'treatments', name: 'Treatments', enabled: permissions?.treatments || false },
        { id: 'imaging', name: 'Medical Imaging', enabled: permissions?.imaging || false }
      ]
    },
    {
      id: 'medications',
      name: 'Medications',
      description: 'Current prescriptions, dosages, interactions',
      icon: 'Pill',
      enabled: permissions?.medications || false,
      subcategories: [
        { id: 'current_meds', name: 'Current Medications', enabled: permissions?.current_meds || false },
        { id: 'med_history', name: 'Medication History', enabled: permissions?.med_history || false },
        { id: 'allergies', name: 'Drug Allergies', enabled: permissions?.allergies || false }
      ]
    },
    {
      id: 'vitals',
      name: 'Vital Signs',
      description: 'Blood pressure, heart rate, temperature',
      icon: 'Activity',
      enabled: permissions?.vitals || false,
      subcategories: [
        { id: 'blood_pressure', name: 'Blood Pressure', enabled: permissions?.blood_pressure || false },
        { id: 'heart_rate', name: 'Heart Rate', enabled: permissions?.heart_rate || false },
        { id: 'weight', name: 'Weight & BMI', enabled: permissions?.weight || false }
      ]
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle Data',
      description: 'Exercise, diet, sleep patterns',
      icon: 'Heart',
      enabled: permissions?.lifestyle || false,
      subcategories: [
        { id: 'exercise', name: 'Exercise Data', enabled: permissions?.exercise || false },
        { id: 'diet', name: 'Dietary Information', enabled: permissions?.diet || false },
        { id: 'sleep', name: 'Sleep Patterns', enabled: permissions?.sleep || false }
      ]
    }
  ];

  const handleToggleCategory = (categoryId) => {
    if (onTogglePermission) {
      onTogglePermission(categoryId);
    }
  };

  const handleToggleSubcategory = (subcategoryId) => {
    if (onTogglePermission) {
      onTogglePermission(subcategoryId);
    }
  };

  const PermissionCard = ({ category }) => {
    const isExpanded = expandedSection === category?.id;
    const enabledSubcategories = category?.subcategories?.filter(sub => sub?.enabled)?.length;

    return (
      <div className="border border-border rounded-lg bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                category?.enabled ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={category?.icon} 
                  size={20} 
                  className={category?.enabled ? 'text-primary' : 'text-muted-foreground'} 
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">{category?.name}</h4>
                <p className="text-xs text-muted-foreground">{category?.description}</p>
                {category?.enabled && (
                  <p className="text-xs text-clinical-green mt-1">
                    {enabledSubcategories}/{category?.subcategories?.length} subcategories enabled
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : category?.id)}
                className="p-2 rounded-lg hover:bg-muted transition-clinical"
              >
                <Icon 
                  name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </button>
              <button
                onClick={() => handleToggleCategory(category?.id)}
                className={`w-12 h-6 rounded-full transition-clinical ${
                  category?.enabled 
                    ? 'bg-primary' :'bg-muted'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  category?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              {category?.subcategories?.map((subcategory) => (
                <div key={subcategory?.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <span className="text-sm text-foreground">{subcategory?.name}</span>
                  </div>
                  <button
                    onClick={() => handleToggleSubcategory(subcategory?.id)}
                    className={`w-10 h-5 rounded-full transition-clinical ${
                      subcategory?.enabled 
                        ? 'bg-primary' :'bg-muted'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      subcategory?.enabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getEnabledCount = () => {
    return Object.values(permissions)?.filter(Boolean)?.length;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Data Access</h3>
          <p className="text-sm text-muted-foreground">
            Control what health data the AI can access for analysis
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{getEnabledCount()} permissions</p>
          <p className="text-xs text-muted-foreground">currently enabled</p>
        </div>
      </div>
      {/* Global Controls */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
            <p className="text-xs text-muted-foreground">Manage all permissions at once</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              permissionCategories?.forEach(cat => {
                handleToggleCategory(cat?.id);
                cat?.subcategories?.forEach(sub => handleToggleSubcategory(sub?.id));
              });
            }}
            iconName="Check"
            iconPosition="left"
          >
            Enable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              permissionCategories?.forEach(cat => {
                if (cat?.enabled) handleToggleCategory(cat?.id);
                cat?.subcategories?.forEach(sub => {
                  if (sub?.enabled) handleToggleSubcategory(sub?.id);
                });
              });
            }}
            iconName="X"
            iconPosition="left"
          >
            Disable All
          </Button>
        </div>
      </div>
      {/* Permission Categories */}
      <div className="space-y-3">
        {permissionCategories?.map((category) => (
          <PermissionCard key={category?.id} category={category} />
        ))}
      </div>
      {/* Data Retention Notice */}
      <div className="p-4 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-clinical-amber mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-clinical-amber mb-1">Data Retention Policy</h4>
            <p className="text-xs text-clinical-amber/80">
              AI conversations are encrypted and stored on IPFS for 90 days. 
              You can delete your conversation history at any time from the settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPermissionsPanel;