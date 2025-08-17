import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PatientRecordCard = ({ record, onView, onDownload }) => {
  return (
    <div className="border border-border rounded-lg bg-card p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Icon name={record.icon || 'FileText'} size={18} />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{record.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{record.provider} • {new Date(record.date).toLocaleDateString()}</p>
            {record.aiSummary && (
              <p className="text-xs text-primary/90 line-clamp-2">AI: {record.aiSummary}</p>
            )}
          </div>
        </div>
        {record.isEncrypted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
            <Icon name="Shield" size={12} /> Encrypted
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-auto">
        <Button size="xs" variant="outline" iconName="Eye" onClick={() => onView(record)}>View</Button>
        <Button size="xs" variant="outline" iconName="Download" onClick={() => onDownload(record)}>Download</Button>
        {record.hasAISummary === false && (
          <Button size="xs" variant="ghost" iconName="Sparkles">Gen AI</Button>
        )}
      </div>
    </div>
  );
};

export default PatientRecordCard;
