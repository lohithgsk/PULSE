import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PatientRecordsTable = ({ records, onView }) => {
  if (!records?.length) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="text-left">
            <th className="py-2.5 px-3 font-medium">Title</th>
            <th className="py-2.5 px-3 font-medium min-w-[140px]">Provider</th>
            <th className="py-2.5 px-3 font-medium w-36">Date</th>
            <th className="py-2.5 px-3 font-medium w-24 text-center">Encrypted</th>
            <th className="py-2.5 px-3 font-medium w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => {
            const date = new Date(r.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            return (
              <tr key={r.id} className="border-t border-border/70 hover:bg-muted/40 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="font-medium text-foreground/90 leading-tight">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[260px]">
                    {r.aiSummary || '—'}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">{r.provider}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{date}</td>
                <td className="py-2.5 px-3 text-center">
                  {r.isEncrypted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">
                      <Icon name="Lock" size={12} /> Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[11px] font-medium">
                      <Icon name="Unlock" size={12} /> No
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <Button size="xs" variant="outline" iconName="Eye" aria-label="View" onClick={() => onView(r)}>
                      View
                    </Button>
                    <Button size="xs" variant="ghost" iconName="Download" aria-label="Download" onClick={() => {}} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PatientRecordsTable;
