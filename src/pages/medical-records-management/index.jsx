import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RecordCard from './components/RecordCard';
import RecordFilters from './components/RecordFilters';
import RecordDetailPanel from './components/RecordDetailPanel';
import BulkActions from './components/BulkActions';
import ShareModal from './components/ShareModal';

const MedicalRecordsManagement = () => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    provider: '',
    dateFrom: '',
    dateTo: '',
    storage: '',
    sortBy: 'date_desc',
    hasAISummary: null,
    isEncrypted: null
  });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recordToShare, setRecordToShare] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock medical records data
  const mockRecords = [
    {
      id: 'rec_001',
      title: 'Annual Physical Examination',
      category: 'consultation',
      provider: 'General Hospital',
      date: '2024-08-10T09:00:00Z',
      description: 'Comprehensive annual health checkup including vital signs, blood work, and general assessment.',
      isEncrypted: true,
      storage: 'ipfs',
      hasAISummary: true,
      aiSummary: 'Patient shows excellent overall health with normal vital signs. Blood pressure: 120/80, Heart rate: 72 bpm. Recommended to continue current exercise routine and maintain healthy diet.',
      aiSummaryDate: '2024-08-10T10:30:00Z',
      keyDetails: [
        { label: 'Blood Pressure', value: '120/80 mmHg' },
        { label: 'Heart Rate', value: '72 bpm' },
        { label: 'Weight', value: '165 lbs' },
        { label: 'BMI', value: '24.2' }
      ],
      fullContent: `ANNUAL PHYSICAL EXAMINATION REPORT\n\nPatient: John Doe\nDate: August 10, 2024\nProvider: Dr. Sarah Johnson, MD\n\nCHIEF COMPLAINT:\nRoutine annual physical examination\n\nVITAL SIGNS:\n- Blood Pressure: 120/80 mmHg\n- Heart Rate: 72 bpm\n- Temperature: 98.6°F\n- Respiratory Rate: 16/min\n- Weight: 165 lbs\n- Height: 5'10\"\n- BMI: 24.2\n\nPHYSICAL EXAMINATION:\nGeneral appearance: Well-developed, well-nourished adult male in no acute distress\nHEENT: Normal\nCardiovascular: Regular rate and rhythm, no murmurs\nPulmonary: Clear to auscultation bilaterally\nAbdomen: Soft, non-tender, no masses\nExtremities: No edema, normal range of motion\n\nASSESSMENT:\nHealthy adult male with no acute concerns\n\nPLAN:\n- Continue current exercise routine\n- Maintain healthy diet\n- Return in 1 year for next annual exam\n- Routine screening labs due next visit`,
      auditTrail: [
        {
          action: 'view',
          description: 'Record viewed by patient',
          timestamp: '2024-08-10T14:30:00Z',
          txHash: '0x1234...5678'
        },
        {
          action: 'created',
          description: 'Record created by Dr. Sarah Johnson',
          timestamp: '2024-08-10T10:00:00Z',
          txHash: '0x9876...5432'
        }
      ]
    },
    {
      id: 'rec_002',
      title: 'Penicillin Allergy Documentation',
      category: 'allergy',
      provider: 'City Medical Clinic',
      date: '2024-07-15T14:30:00Z',
      description: 'Documented severe allergic reaction to penicillin with hives and difficulty breathing.',
      isEncrypted: true,
      storage: 'onchain',
      hasAISummary: false,
      keyDetails: [
        { label: 'Allergen', value: 'Penicillin' },
        { label: 'Severity', value: 'Severe' },
        { label: 'Reaction', value: 'Hives, Dyspnea' },
        { label: 'Treatment', value: 'Epinephrine, Antihistamines' }
      ],
      fullContent: `ALLERGY DOCUMENTATION\n\nPatient: John Doe\nDate: July 15, 2024\nProvider: Dr. Michael Chen, MD\n\nALLERGEN: Penicillin\nSEVERITY: Severe\n\nREACTION DETAILS:\n- Onset: Within 30 minutes of oral administration\n- Symptoms: Generalized urticaria (hives), difficulty breathing, throat tightness\n- Duration: Symptoms persisted for 4 hours\n\nTREATMENT PROVIDED:\n- Epinephrine 0.3mg IM\n- Diphenhydramine 50mg IV\n- Methylprednisolone 125mg IV\n- Continuous monitoring for 6 hours\n\nRECOMMENDATIONS:\n- Strict avoidance of all penicillin-based antibiotics\n- Medical alert bracelet recommended\n- Carry epinephrine auto-injector\n- Alternative antibiotics: Cephalexin, Azithromycin (with caution)`,
      auditTrail: [
        {
          action: 'created',
          description: 'Allergy record created by Dr. Michael Chen',
          timestamp: '2024-07-15T15:00:00Z',
          txHash: '0xabcd...efgh'
        }
      ]
    },
    {
      id: 'rec_003',
      title: 'Blood Chemistry Panel',
      category: 'lab_result',
      provider: 'Diagnostic Laboratory',
      date: '2024-08-05T08:00:00Z',
      description: 'Comprehensive metabolic panel including glucose, lipids, liver function, and kidney markers.',
      isEncrypted: true,
      storage: 'ipfs',
      hasAISummary: true,
      aiSummary: 'Lab results show excellent metabolic health. All values within normal ranges. Cholesterol levels are optimal. Kidney and liver function normal.',
      aiSummaryDate: '2024-08-05T12:00:00Z',
      keyDetails: [
        { label: 'Glucose', value: '92 mg/dL' },
        { label: 'Total Cholesterol', value: '185 mg/dL' },
        { label: 'HDL', value: '58 mg/dL' },
        { label: 'LDL', value: '110 mg/dL' },
        { label: 'Creatinine', value: '1.0 mg/dL' }
      ],
      attachments: [
        { name: 'Lab_Report_Full.pdf', size: '2.3 MB' },
        { name: 'Reference_Ranges.pdf', size: '156 KB' }
      ]
    },
    {
      id: 'rec_004',
      title: 'Lisinopril 10mg Daily',
      category: 'medication',
      provider: 'General Hospital',
      date: '2024-06-20T11:00:00Z',
      description: 'ACE inhibitor prescribed for blood pressure management. Started at 10mg daily dose.',
      isEncrypted: false,
      storage: 'onchain',
      hasAISummary: false,
      keyDetails: [
        { label: 'Medication', value: 'Lisinopril' },
        { label: 'Dosage', value: '10mg' },
        { label: 'Frequency', value: 'Once daily' },
        { label: 'Duration', value: 'Ongoing' }
      ]
    },
    {
      id: 'rec_005',
      title: 'Chest X-Ray - Normal',
      category: 'imaging',
      provider: 'Specialist Medical Center',
      date: '2024-05-30T16:45:00Z',
      description: 'Routine chest X-ray showing clear lungs with no abnormalities detected.',
      isEncrypted: true,
      storage: 'ipfs',
      hasAISummary: true,
      aiSummary: 'Chest X-ray demonstrates clear lung fields bilaterally. No evidence of pneumonia, masses, or other abnormalities. Heart size normal.',
      aiSummaryDate: '2024-05-30T17:30:00Z',
      keyDetails: [
        { label: 'Study Type', value: 'Chest X-Ray PA/Lateral' },
        { label: 'Result', value: 'Normal' },
        { label: 'Radiologist', value: 'Dr. Lisa Park, MD' }
      ]
    },
    {
      id: 'rec_006',
      title: 'COVID-19 Vaccination - Booster',
      category: 'vaccination',
      provider: 'City Medical Clinic',
      date: '2024-04-12T10:15:00Z',
      description: 'COVID-19 booster vaccination (Pfizer-BioNTech) administered in left deltoid.',
      isEncrypted: false,
      storage: 'onchain',
      hasAISummary: false,
      keyDetails: [
        { label: 'Vaccine', value: 'Pfizer-BioNTech COVID-19' },
        { label: 'Dose', value: 'Booster (3rd dose)' },
        { label: 'Lot Number', value: 'FF2345' },
        { label: 'Site', value: 'Left deltoid' }
      ]
    }
  ];

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = [...mockRecords];

    // Search filter
    if (filters?.search) {
      const searchLower = filters?.search?.toLowerCase();
      filtered = filtered?.filter(record =>
        record?.title?.toLowerCase()?.includes(searchLower) ||
        record?.description?.toLowerCase()?.includes(searchLower) ||
        record?.provider?.toLowerCase()?.includes(searchLower)
      );
    }

    // Category filter
    if (filters?.category) {
      filtered = filtered?.filter(record => record?.category === filters?.category);
    }

    // Provider filter
    if (filters?.provider) {
      filtered = filtered?.filter(record => record?.provider?.toLowerCase()?.includes(filters?.provider?.toLowerCase()));
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(record => new Date(record.date) >= new Date(filters.dateFrom));
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(record => new Date(record.date) <= new Date(filters.dateTo));
    }

    // Storage filter
    if (filters?.storage) {
      filtered = filtered?.filter(record => record?.storage === filters?.storage);
    }

    // AI Summary filter
    if (filters?.hasAISummary !== null) {
      filtered = filtered?.filter(record => record?.hasAISummary === filters?.hasAISummary);
    }

    // Encryption filter
    if (filters?.isEncrypted !== null) {
      filtered = filtered?.filter(record => record?.isEncrypted === filters?.isEncrypted);
    }

    // Sort records
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date_desc':
          return new Date(b.date) - new Date(a.date);
        case 'date_asc':
          return new Date(a.date) - new Date(b.date);
        case 'title_asc':
          return a?.title?.localeCompare(b?.title);
        case 'title_desc':
          return b?.title?.localeCompare(a?.title);
        case 'provider_asc':
          return a?.provider?.localeCompare(b?.provider);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters]);

  // Record counts for filters
  const recordCounts = useMemo(() => ({
    total: mockRecords?.length,
    filtered: filteredRecords?.length,
    withAI: mockRecords?.filter(r => r?.hasAISummary)?.length
  }), [filteredRecords?.length]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleRecordSelect = (recordId) => {
    setSelectedRecords(prev =>
      prev?.includes(recordId)
        ? prev?.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRecords(filteredRecords?.map(r => r?.id));
  };

  const handleDeselectAll = () => {
    setSelectedRecords([]);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsDetailPanelOpen(true);
  };

  const handleDownloadRecord = async (record) => {
    // Mock download functionality
    console.log('Downloading record:', record?.id);
    // In real app, this would trigger file download
  };

  const handleShareRecord = (record) => {
    setRecordToShare(record);
    setIsShareModalOpen(true);
  };

  const handleBulkDownload = async (recordIds, format) => {
    console.log('Bulk downloading records:', recordIds, 'Format:', format);
    // Mock bulk download
  };

  const handleBulkShare = (recordIds) => {
    console.log('Bulk sharing records:', recordIds);
    // Mock bulk share
  };

  const handleGenerateAISummary = async (recordId) => {
    console.log('Generating AI summary for record:', recordId);
    // Mock AI summary generation
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleShare = async (shareData) => {
    console.log('Sharing record:', shareData);
    // Mock share functionality
    return new Promise(resolve => 
      setTimeout(() => resolve({ 
        link: 'https://PULSE.app/share/abc123def456' 
      }), 1500)
    );
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      provider: '',
      dateFrom: '',
      dateTo: '',
      storage: '',
      sortBy: 'date_desc',
      hasAISummary: null,
      isEncrypted: null
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin">
              <Icon name="Loader2" size={24} className="text-primary" />
            </div>
            <span className="text-foreground">Loading medical records...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filters */}
          <div className="lg:w-80 lg:flex-none lg:sticky lg:top-16 self-start">
            <RecordFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
              recordCounts={recordCounts}
              isCollapsed={isFiltersCollapsed}
              onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Medical Records</h1>
                  <p className="text-muted-foreground">
                    Manage and share your complete medical history securely
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={selectedRecords?.length === filteredRecords?.length ? handleDeselectAll : handleSelectAll}
                    iconName={selectedRecords?.length === filteredRecords?.length ? "Square" : "CheckSquare"}
                    iconPosition="left"
                  >
                    {selectedRecords?.length === filteredRecords?.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Upload Record
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="FileText" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Total Records</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground mt-1">{recordCounts?.total}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="Filter" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Filtered</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground mt-1">{recordCounts?.filtered}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="Brain" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">AI Summaries</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground mt-1">{recordCounts?.withAI}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckSquare" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Selected</span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground mt-1">{selectedRecords?.length}</p>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <BulkActions
              selectedRecords={selectedRecords}
              onBulkDownload={handleBulkDownload}
              onBulkShare={handleBulkShare}
              onDeselectAll={handleDeselectAll}
              totalRecords={filteredRecords?.length}
            />

            {/* Records List */}
            <div className="space-y-4">
              {filteredRecords?.length > 0 ? (
                filteredRecords?.map((record) => (
                  <RecordCard
                    key={record?.id}
                    record={record}
                    onView={handleViewRecord}
                    onDownload={handleDownloadRecord}
                    onShare={handleShareRecord}
                    onGenerateAISummary={handleGenerateAISummary}
                    isSelected={selectedRecords?.includes(record?.id)}
                    onSelect={handleRecordSelect}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms to find the records you're looking for.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Record Detail Panel */}
      <RecordDetailPanel
        record={selectedRecord}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onDownload={handleDownloadRecord}
        onShare={handleShareRecord}
        onGenerateAISummary={handleGenerateAISummary}
      />
      {/* Share Modal */}
      <ShareModal
        record={recordToShare}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShare}
      />
    </div>
  );
};

export default MedicalRecordsManagement;