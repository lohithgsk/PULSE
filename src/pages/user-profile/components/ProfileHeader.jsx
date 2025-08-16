import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useSession } from '../../../context/SessionContext';
import Button from '../../../components/ui/Button';

const ProfileHeader = () => {
  let session;
  try {
    session = useSession?.();
  } catch {
    session = null;
  }
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(session?.user?.name || 'Your Name');
  const [copied, setCopied] = useState(false);
  const name = tempName;
  const summary = session?.user?.summary || 'Profile & settings.';

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/profile');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
          <Icon name="User" size={32} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={48}
                className="flex-1 max-w-xs md:max-w-sm px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Edit name"
              />
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Save name"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                <Icon name="Check" size={16} />
              </button>
            </div>
          ) : (
            <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate">{name}</h1>
          )}
          <p className="text-xs md:text-sm text-muted-foreground leading-snug">{summary}</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" iconName={copied ? 'Check' : 'Share2'} onClick={handleShare}>
            {copied ? 'Copied' : 'Share'}
          </Button>
          <Button
            variant={isEditing ? 'destructive' : 'default'}
            size="sm"
            iconName={isEditing ? 'X' : 'Edit3'}
            onClick={() => setIsEditing(v => !v)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
