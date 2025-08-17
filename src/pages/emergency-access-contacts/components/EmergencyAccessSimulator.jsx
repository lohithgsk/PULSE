import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const EmergencyAccessSimulator = ({ contacts = [], onSimulate }) => {
  const [selectedContact, setSelectedContact] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const contactOptions = contacts?.map(contact => ({
    value: contact?.id,
    label: `${contact?.name} (${contact?.relationship})`,
    description: `Access Level: ${contact?.accessLevel}`
  }));

  const handleSimulate = async () => {
    if (!selectedContact) return;
    
    setIsSimulating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const contact = contacts?.find(c => c?.id === selectedContact);
      const mockData = generateMockAccessData(contact);
      setSimulationResult(mockData);
      
      if (onSimulate) {
        onSimulate(contact, mockData);
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const generateMockAccessData = (contact) => {
    const baseData = {
      patientName: "John Doe",
      dateOfBirth: "1985-03-15",
      emergencyContacts: ["Jane Doe (Spouse)", "Dr. Smith (Primary Care)"]
    };

    const medicalData = {
      ...baseData,
      conditions: ["Hypertension", "Type 2 Diabetes"],
      medications: ["Metformin 500mg", "Lisinopril 10mg"],
      allergies: ["Penicillin", "Shellfish"],
      bloodType: "O+",
      lastVisit: "2024-08-10"
    };

    const fullData = {
      ...medicalData,
      fullMedicalHistory: [
        {
          date: "2024-08-10",
          provider: "City General Hospital",
          diagnosis: "Routine Checkup",
          notes: "Blood pressure stable, diabetes well controlled"
        },
        {
          date: "2024-06-15",
          provider: "Dr. Sarah Johnson",
          diagnosis: "Annual Physical",
          notes: "All vitals normal, continue current medications"
        }
      ],
      labResults: [
        { test: "HbA1c", value: "6.8%", date: "2024-08-10", normal: "< 7.0%" },
        { test: "Blood Pressure", value: "128/82", date: "2024-08-10", normal: "< 130/80" }
      ],
      insuranceInfo: {
        provider: "HealthCare Plus",
        policyNumber: "HP-123456789",
        groupNumber: "GRP-001"
      }
    };

    switch (contact?.accessLevel) {
      case 'basic':
        return { accessLevel: 'basic', data: baseData };
      case 'medical':
        return { accessLevel: 'medical', data: medicalData };
      case 'full':
        return { accessLevel: 'full', data: fullData };
      default:
        return { accessLevel: 'basic', data: baseData };
    }
  };

  const renderDataPreview = (data, accessLevel) => {
    const { data: accessData } = data;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-card-foreground">Data Preview</h4>
          <span className={`px-2 py-1 text-xs rounded-full ${
            accessLevel === 'full' ? 'bg-error/10 text-error' :
            accessLevel === 'medical'? 'bg-clinical-amber/10 text-clinical-amber' : 'bg-clinical-green/10 text-clinical-green'
          }`}>
            {accessLevel?.toUpperCase()} ACCESS
          </span>
        </div>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Patient Name</p>
            <p className="text-sm text-card-foreground">{accessData?.patientName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
            <p className="text-sm text-card-foreground">{accessData?.dateOfBirth}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Emergency Contacts</p>
          <div className="space-y-1">
            {accessData?.emergencyContacts?.map((contact, index) => (
              <p key={index} className="text-sm text-card-foreground">{contact}</p>
            ))}
          </div>
        </div>
        {/* Medical Information */}
        {(accessLevel === 'medical' || accessLevel === 'full') && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blood Type</p>
                <p className="text-sm text-card-foreground">{accessData?.bloodType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                <p className="text-sm text-card-foreground">{accessData?.lastVisit}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Medical Conditions</p>
              <div className="flex flex-wrap gap-2">
                {accessData?.conditions?.map((condition, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-clinical-amber/10 text-clinical-amber rounded-full">
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Current Medications</p>
              <div className="space-y-1">
                {accessData?.medications?.map((medication, index) => (
                  <p key={index} className="text-sm text-card-foreground">{medication}</p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {accessData?.allergies?.map((allergy, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-error/10 text-error rounded-full">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Full Access Information */}
        {accessLevel === 'full' && (
          <>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Recent Medical History</p>
              <div className="space-y-2">
                {accessData?.fullMedicalHistory?.map((record, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-card-foreground">{record?.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">{record?.date}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{record?.provider}</p>
                    <p className="text-sm text-card-foreground">{record?.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Recent Lab Results</p>
              <div className="space-y-2">
                {accessData?.labResults?.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{result?.test}</p>
                      <p className="text-xs text-muted-foreground">Normal: {result?.normal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-card-foreground">{result?.value}</p>
                      <p className="text-xs text-muted-foreground">{result?.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-medical-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Eye" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Emergency Access Simulator</h3>
          <p className="text-sm text-muted-foreground">
            Preview what information contacts can access during emergencies
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Select
          label="Select Emergency Contact"
          description="Choose a contact to simulate their emergency access view"
          options={contactOptions}
          value={selectedContact}
          onChange={setSelectedContact}
          placeholder="Choose a contact..."
        />

        <Button
          variant="default"
          onClick={handleSimulate}
          disabled={!selectedContact}
          loading={isSimulating}
          iconName="Play"
          iconPosition="left"
          fullWidth
        >
          {isSimulating ? 'Simulating Access...' : 'Simulate Emergency Access'}
        </Button>

        {simulationResult && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            {renderDataPreview(simulationResult, simulationResult?.accessLevel)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyAccessSimulator;