import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientSummaryCard = ({ patient }) => {
  if (!patient) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-medical-card">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="User" size={28} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{patient.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">DOB: {patient.dob} • Sex: {patient.sex}</p>
          <p className="text-xs text-muted-foreground">Allergies: {patient.allergies?.join(', ') || 'None reported'}</p>
        </div>
        <div className="hidden sm:flex flex-col gap-2">
          <div className="flex items-center text-xs text-muted-foreground gap-1"><Icon name="Activity" size={14} />{patient.vitals?.heartRate || '--'} bpm</div>
          <div className="flex items-center text-xs text-muted-foreground gap-1"><Icon name="Thermometer" size={14} />{patient.vitals?.temperature || '--'} °F</div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCard;
