import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoPanel from './components/PersonalInfoPanel';
import ContactInfoPanel from './components/ContactInfoPanel';
import SettingsPanel from './components/SettingsPanel';

// Note: AppLayout is already applied by the protected route wrapper in Routes.jsx
// so this page should only return the inner content.

const UserProfilePage = () => {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PersonalInfoPanel />
          <ContactInfoPanel />
        </div>
        <SettingsPanel />
      </div>
    </div>
  );
};

export default UserProfilePage;
