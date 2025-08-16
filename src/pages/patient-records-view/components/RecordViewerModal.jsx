import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecordViewerModal = ({ record, onClose }) => {
  if (!record) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-3xl bg-card border border-border rounded-t-2xl sm:rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Icon name={record.icon || 'FileText'} size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">{record.title}</h2>
              <p className="text-xs text-muted-foreground truncate">{record.provider} • {new Date(record.date).toLocaleString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 space-y-4 text-sm">
          {record.aiSummary && (
            <div className="p-3 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary/90">
              <strong className="font-medium">AI Summary:</strong> {record.aiSummary}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Details</h3>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground max-h-[40vh] overflow-y-auto border border-border rounded-md p-3 bg-muted/30">
{record.fullContent || 'Full record content not available in mock.'}
            </pre>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" iconName="Download">Download</Button>
          <Button size="sm" iconName="X" variant="destructive" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default RecordViewerModal;
