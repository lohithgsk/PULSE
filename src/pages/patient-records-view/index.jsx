import React, { useMemo, useState } from 'react';
import PatientSummaryCard from './components/PatientSummaryCard';
import PatientRecordCard from './components/PatientRecordCard';
import RecordViewerModal from './components/RecordViewerModal';
import PatientRecordsTable from './components/PatientRecordsTable';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// Mock patient + records (would be fetched server-side in real implementation)
const mockPatient = {
  id: 'patient_001',
  name: 'John Doe',
  dob: '1985-04-12',
  sex: 'M',
  allergies: ['Penicillin'],
  vitals: { heartRate: 72, temperature: 98.6 },
};

const mockRecords = [
  {
    id: 'rec_vision',
    title: 'Annual Physical Examination',
    provider: 'General Hospital',
    date: '2025-07-01T09:30:00Z',
    aiSummary: 'Vitals stable, labs within normal range.',
    isEncrypted: true,
    fullContent: 'ANNUAL PHYSICAL EXAMINATION\n\nFindings: ...',
  },
  {
    id: 'rec_lab',
    title: 'Comprehensive Metabolic Panel',
    provider: 'Diagnostic Laboratory',
    date: '2025-06-23T08:00:00Z',
    aiSummary: 'Electrolytes and liver enzymes normal.',
    isEncrypted: true,
    fullContent: 'CMP Result Values...'
  },
  {
    id: 'rec_rx',
    title: 'Medication - Lisinopril 10mg',
    provider: 'General Hospital',
    date: '2025-05-11T14:00:00Z',
    isEncrypted: false,
    fullContent: 'Medication record details...'
  },
  {
    id: 'rec_imaging',
    title: 'Chest X-Ray Report',
    provider: 'Imaging Center',
    date: '2025-04-03T11:15:00Z',
    aiSummary: 'Clear lung fields, no acute findings.',
    isEncrypted: true,
    fullContent: 'Radiology report content ...'
  }
];

const PatientRecordsView = () => {
  const [patientIdInput, setPatientIdInput] = useState('');
  const [currentPatient, setCurrentPatient] = useState(mockPatient); // default
  const [records, setRecords] = useState(mockRecords);
  const [search, setSearch] = useState('');
  const [activeRecord, setActiveRecord] = useState(null);
  const [filterEncrypted, setFilterEncrypted] = useState(false);

  const filteredRecords = useMemo(() => {
    let list = [...records];
    if (filterEncrypted) list = list.filter(r => r.isEncrypted);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r => r.title.toLowerCase().includes(s) || r.provider.toLowerCase().includes(s));
    }
    return list.sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [records, search, filterEncrypted]);

  const handleLoadPatient = () => {
    // Mock: check patient ID (non-empty) else show fallback patient
    if (patientIdInput.trim()) {
      // Simulate patient fetch; here we reuse mock
      setCurrentPatient({ ...mockPatient, id: patientIdInput.trim(), name: 'Patient ' + patientIdInput.trim().slice(-4) });
      setRecords(mockRecords.map(r => ({ ...r, id: r.id + '_' + patientIdInput.trim().slice(-3) })));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
      {/* Sidebar */}
      <aside className="lg:w-72 flex-shrink-0 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 md:p-5 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Patient ID</label>
            <div className="flex gap-2">
              <Input value={patientIdInput} onChange={(e) => setPatientIdInput(e.target.value)} placeholder="ID" className="flex-1" />
              <Button onClick={handleLoadPatient} disabled={!patientIdInput.trim()} size="xs" iconName="Search">Load</Button>
            </div>
          </div>
          <div className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground inline-block">Mock Data</div>
        </div>
        <PatientSummaryCard patient={currentPatient} />
      </aside>

      {/* Main content */}
      <div className="flex-1 space-y-5">
        {/* Toolbar */}
        <div className="bg-card border border-border rounded-xl p-3 md:p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Search records</label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or provider" />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterEncrypted ? 'default' : 'outline'}
              iconName={filterEncrypted ? 'ShieldCheck' : 'Shield'}
              onClick={() => setFilterEncrypted(v => !v)}
              aria-pressed={filterEncrypted}
            >
              {filterEncrypted ? 'Encrypted Only' : 'All Records'}
            </Button>
            {search && (
              <Button size="sm" variant="ghost" iconName="X" onClick={() => setSearch('')}>Clear</Button>
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wide">Records ({filteredRecords.length})</h2>
          <div className="hidden md:block text-[11px] text-muted-foreground">Showing newest first</div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <PatientRecordsTable records={filteredRecords} onView={setActiveRecord} />
        </div>

        {/* Mobile cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:hidden">
          {filteredRecords.map(r => (
            <PatientRecordCard key={r.id} record={r} onView={setActiveRecord} onDownload={() => {}} />
          ))}
          {filteredRecords.length === 0 && (
            <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No records found.</div>
          )}
        </div>
      </div>

      <RecordViewerModal record={activeRecord} onClose={() => setActiveRecord(null)} />
    </div>
  );
};

export default PatientRecordsView;
