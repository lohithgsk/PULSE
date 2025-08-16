import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmergencyContactCard from './components/EmergencyContactCard';
import BreakGlassPanel from './components/BreakGlassPanel';
import EmergencyAccessSimulator from './components/EmergencyAccessSimulator';
import MedicalAlertsConfig from './components/MedicalAlertsConfig';
import EmergencyAccessAuditLog from './components/EmergencyAccessAuditLog';

const EmergencyAccessContacts = () => {
  const [walletConnected, setWalletConnected] = useState(true);
  const [currentNetwork, setCurrentNetwork] = useState('Sepolia');
  const [isBreakGlassActive, setIsBreakGlassActive] = useState(false);
  const [activeTab, setActiveTab] = useState('contacts');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);

  // Mock data for emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: '1',
      name: 'Jane Doe',
      relationship: 'spouse',
      phone: '+1 (555) 123-4567',
      email: 'jane.doe@email.com',
      accessLevel: 'full',
      verificationStatus: 'verified',
      dateAdded: '2024-08-10T10:00:00Z',
      permissions: {
        canAuthorize: true,
        canAccessFinancial: true,
        canMakeDecisions: true
      }
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      relationship: 'doctor',
      phone: '+1 (555) 987-6543',
      email: 'sarah.johnson@cityhospital.com',
      accessLevel: 'medical',
      verificationStatus: 'verified',
      dateAdded: '2024-08-12T14:30:00Z',
      permissions: {
        canAuthorize: true,
        canAccessFinancial: false,
        canMakeDecisions: true
      }
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      relationship: 'friend',
      phone: '+1 (555) 456-7890',
      email: 'michael.r@email.com',
      accessLevel: 'basic',
      verificationStatus: 'pending',
      dateAdded: '2024-08-14T16:15:00Z',
      permissions: {
        canAuthorize: false,
        canAccessFinancial: false,
        canMakeDecisions: false
      }
    }
  ]);

  // Mock data for medical alerts
  const [medicalAlerts, setMedicalAlerts] = useState([
    {
      id: '1',
      condition: 'Severe Allergic Reaction',
      severity: 'critical',
      description: 'Anaphylaxis to penicillin and shellfish',
      immediateAccess: true,
      notifyContacts: true,
      autoActivateBreakGlass: true,
      dateAdded: '2024-08-13T16:20:00Z'
    },
    {
      id: '2',
      condition: 'Diabetic Emergency',
      severity: 'high',
      description: 'Type 2 diabetes with history of hypoglycemic episodes',
      immediateAccess: true,
      notifyContacts: true,
      autoActivateBreakGlass: false,
      dateAdded: '2024-08-14T09:45:00Z'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    accessLevel: 'basic',
    permissions: {
      canAuthorize: false,
      canAccessFinancial: false,
      canMakeDecisions: false
    }
  });

  const tabs = [
    { id: 'contacts', label: 'Emergency Contacts', icon: 'Users' },
    { id: 'break-glass', label: 'Break Glass', icon: 'AlertTriangle' },
    { id: 'simulator', label: 'Access Simulator', icon: 'Eye' },
    { id: 'alerts', label: 'Medical Alerts', icon: 'Bell' },
    { id: 'audit', label: 'Audit Log', icon: 'FileText' }
  ];

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

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleNetworkSwitch = () => {
    setCurrentNetwork(currentNetwork === 'Sepolia' ? 'Mainnet' : 'Sepolia');
  };

  const handleBreakGlassActivate = () => {
    setIsBreakGlassActive(true);
  };

  const handleBreakGlassDeactivate = () => {
    setIsBreakGlassActive(false);
  };

  const handleAddContact = () => {
    if (!newContact?.name || !newContact?.relationship || !newContact?.phone) return;

    const contactToAdd = {
      ...newContact,
      id: Date.now()?.toString(),
      verificationStatus: 'pending',
      dateAdded: new Date()?.toISOString()
    };

    setEmergencyContacts([...emergencyContacts, contactToAdd]);
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      accessLevel: 'basic',
      permissions: {
        canAuthorize: false,
        canAccessFinancial: false,
        canMakeDecisions: false
      }
    });
    setIsAddingContact(false);
  };

  const handleUpdateContact = (updatedContact) => {
    setEmergencyContacts(contacts =>
      contacts?.map(contact =>
        contact?.id === updatedContact?.id ? updatedContact : contact
      )
    );
  };

  const handleDeleteContact = (contactId) => {
    setEmergencyContacts(contacts =>
      contacts?.filter(contact => contact?.id !== contactId)
    );
  };

  const handleVerifyContact = (contactId) => {
    setEmergencyContacts(contacts =>
      contacts?.map(contact =>
        contact?.id === contactId
          ? { ...contact, verificationStatus: 'verified' }
          : contact
      )
    );
  };

  const handleEditToggle = (contactId) => {
    setEditingContactId(editingContactId === contactId ? null : contactId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return (
          <div className="space-y-6">
            {/* Add Contact Form */}
            {isAddingContact && (
              <div className="bg-card border border-border rounded-lg p-6 shadow-medical-card">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Add Emergency Contact</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={newContact?.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e?.target?.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={newContact?.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e?.target?.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={newContact?.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e?.target?.value })}
                    />
                    <Select
                      label="Relationship"
                      options={relationshipOptions}
                      value={newContact?.relationship}
                      onChange={(value) => setNewContact({ ...newContact, relationship: value })}
                      required
                    />
                  </div>

                  <Select
                    label="Access Level"
                    description="What information can this contact access during emergencies?"
                    options={accessLevelOptions}
                    value={newContact?.accessLevel}
                    onChange={(value) => setNewContact({ ...newContact, accessLevel: value })}
                    required
                  />

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingContact(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleAddContact}
                      disabled={!newContact?.name || !newContact?.relationship || !newContact?.phone}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add Contact
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Emergency Contacts List */}
            <div className="space-y-4">
              {emergencyContacts?.map((contact) => (
                <EmergencyContactCard
                  key={contact?.id}
                  contact={contact}
                  onUpdate={handleUpdateContact}
                  onDelete={handleDeleteContact}
                  onVerify={handleVerifyContact}
                  isEditing={editingContactId === contact?.id}
                  onEditToggle={() => handleEditToggle(contact?.id)}
                />
              ))}
            </div>
            {emergencyContacts?.length === 0 && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center w-16 h-16 bg-muted/50 rounded-full mx-auto mb-4">
                  <Icon name="Users" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No Emergency Contacts</h3>
                <p className="text-muted-foreground mb-4">
                  Add trusted contacts who can access your medical records during emergencies.
                </p>
                <Button
                  variant="default"
                  onClick={() => setIsAddingContact(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Your First Contact
                </Button>
              </div>
            )}
          </div>
        );

      case 'break-glass':
        return (
          <BreakGlassPanel
            isActive={isBreakGlassActive}
            onActivate={handleBreakGlassActivate}
            onDeactivate={handleBreakGlassDeactivate}
            activationHistory={[
              {
                type: 'activated',
                timestamp: '2024-08-14T09:15:00Z',
                txHash: '0x3c4d5e6f7890abcdef1234567890abcdef123456'
              }
            ]}
          />
        );

      case 'simulator':
        return (
          <EmergencyAccessSimulator
            contacts={emergencyContacts}
            onSimulate={(contact, data) => {
              console.log('Simulated access for:', contact?.name, data);
            }}
          />
        );

      case 'alerts':
        return (
          <MedicalAlertsConfig
            alerts={medicalAlerts}
            onUpdateAlerts={setMedicalAlerts}
          />
        );

      case 'audit':
        return <EmergencyAccessAuditLog />;

      default:
        return null;
    }
  };

  return (
<div className="min-h-screen bg-[var(--color-bg)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Link to="/health-dashboard-overview" className="hover:text-foreground transition-clinical">
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Emergency Access & Contacts</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">
                  Emergency Access & Contacts
                </h1>
                <p className="text-muted-foreground">
                  Manage emergency healthcare access scenarios and designated emergency contacts with appropriate data sharing permissions.
                </p>
              </div>
              {activeTab === 'contacts' && !isAddingContact && (
                <Button
                  variant="default"
                  onClick={() => setIsAddingContact(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Contact
                </Button>
              )}
            </div>
          </div>

          {/* Emergency Status Banner */}
          {isBreakGlassActive && (
            <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20">
              <div className="flex items-center space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-error" />
                <div>
                  <h3 className="text-sm font-medium text-error">Emergency Access Active</h3>
                  <p className="text-[var(--color-text-muted)]">
                    Break glass protocol is currently active. All access is being logged on the blockchain.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('break-glass')}
                >
                  Manage
                </Button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm [var(--color-surface-alt)]space-nowrap transition-clinical ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAccessContacts;