import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedRecords, onBulkDownload, onBulkShare, onDeselectAll, totalRecords }) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'json', label: 'JSON Data' },
    { value: 'encrypted', label: 'Encrypted Archive' }
  ];

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      await onBulkDownload(selectedRecords, exportFormat);
    } finally {
      setIsExporting(false);
      setIsExportModalOpen(false);
    }
  };

  if (selectedRecords?.length === 0) return null;

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="sticky top-0 z-sticky bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/20 rounded-lg">
              <Icon name="CheckSquare" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedRecords?.length} of {totalRecords} records selected
              </p>
              <p className="text-xs text-muted-foreground">
                Choose an action to perform on selected records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkShare(selectedRecords)}
              iconName="Share"
              iconPosition="left"
            >
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              iconName="X"
              iconPosition="left"
            >
              Deselect All
            </Button>
          </div>
        </div>
      </div>
      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-popover rounded-lg shadow-medical-modal">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="Download" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">Export Records</h3>
                  <p className="text-sm text-muted-foreground">
                    Export {selectedRecords?.length} selected record{selectedRecords?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <Select
                label="Export Format"
                description="Choose the format for your exported records"
                options={formatOptions}
                value={exportFormat}
                onChange={setExportFormat}
              />

              {/* Format Information */}
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Info" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Format Details</span>
                </div>
                {exportFormat === 'pdf' && (
                  <p className="text-xs text-muted-foreground">
                    Creates a formatted PDF document with all record details, suitable for printing or sharing with healthcare providers.
                  </p>
                )}
                {exportFormat === 'json' && (
                  <p className="text-xs text-muted-foreground">
                    Exports raw data in JSON format, ideal for importing into other systems or for technical analysis.
                  </p>
                )}
                {exportFormat === 'encrypted' && (
                  <p className="text-xs text-muted-foreground">
                    Creates an encrypted archive that can only be opened with your private key, ensuring maximum security.
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className="p-4 rounded-lg bg-clinical-amber/10 border border-clinical-amber/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-clinical-amber" />
                  <span className="text-sm font-medium text-clinical-amber">Security Notice</span>
                </div>
                <p className="text-xs text-clinical-amber/80">
                  This export will be logged on the blockchain for audit purposes. Ensure you store the exported file securely.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsExportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkExport}
                loading={isExporting}
                iconName="Download"
                iconPosition="left"
              >
                Export Records
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;