import React from 'react';
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
  const name = session?.user?.name || 'Your Name';
  const summary = session?.user?.summary || 'Manage your personal information, contact details and application preferences.';

  return (
    <section className="bg-card text-card-foreground border border-border rounded-xl shadow-medical-card p-4 md:p-6 transition-clinical">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon name="User" size={28} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate">{name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Share2">Share</Button>
          <Button variant="default" size="sm" iconName="Edit3">Edit Profile</Button>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
