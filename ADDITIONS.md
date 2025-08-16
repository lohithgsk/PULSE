# New Feature Additions

This document outlines proposals for new features to be added to the Pulse Health application, along with detailed instructions for their implementation.

---

## 1. User Profile Page

A dedicated page for users to view and manage their personal information, contact details, and application settings.

### 1.1. Create New Files

1.  **Create the page component:**
    -   Create a new folder `src/pages/user-profile`.
    -   Inside this folder, create `index.jsx` and `README.md`.

2.  **Create components for the profile page:**
    -   Create a new folder `src/pages/user-profile/components`.
    -   Inside this folder, create the following components:
        -   `ProfileHeader.jsx`: To display user's name, avatar, and a summary.
        -   `PersonalInfoPanel.jsx`: A form to edit personal details like name, DOB, etc.
        -   `ContactInfoPanel.jsx`: A form to edit contact details.
        -   `SettingsPanel.jsx`: For application-specific settings (e.g., theme, notifications).

### 1.2. Implementation Steps

1.  **`src/pages/user-profile/index.jsx`:**

    ```jsx
    import React from 'react';
    import ProfileHeader from './components/ProfileHeader';
    import PersonalInfoPanel from './components/PersonalInfoPanel';
    import ContactInfoPanel from './components/ContactInfoPanel';
    import SettingsPanel from './components/SettingsPanel';
    import AppLayout from 'components/ui/AppLayout';

    const UserProfilePage = () => {
      return (
        <AppLayout>
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
        </AppLayout>
      );
    };

    export default UserProfilePage;
    ```

2.  **Component Skeletons:**
    -   Create basic functional components for `ProfileHeader`, `PersonalInfoPanel`, `ContactInfoPanel`, and `SettingsPanel`. These will contain placeholder UI initially.

3.  **Add the new route in `src/Routes.jsx`:**

    ```jsx
    // ... existing imports
    import UserProfilePage from "pages/user-profile";

    const ProjectRoutes = () => {
      let element = useRoutes([
        // ... existing routes
        { path: "/profile", element: <UserProfilePage /> },
      ]);

      return element;
    };
    ```

4.  **Add a link to the profile page in the `Header` component (`src/components/ui/Header.jsx`):**
    -   Add a new navigation link or a user avatar dropdown that links to `/profile`.

---

## 2. Notifications Center

A centralized place to display notifications, alerts, and messages for the user.

### 2.1. Create New Files

1.  **Create the page component:**
    -   Create a new folder `src/pages/notifications`.
    -   Inside this folder, create `index.jsx` and `README.md`.

2.  **Create components for the notifications page:**
    -   Create a new folder `src/pages/notifications/components`.
    -   Inside this folder, create:
        -   `NotificationList.jsx`: To display a list of notifications.
        -   `NotificationCard.jsx`: A component for a single notification item.
        -   `FilterControls.jsx`: To filter notifications (e.g., all, unread).

### 2.2. Implementation Steps

1.  **`src/pages/notifications/index.jsx`:**

    ```jsx
    import React from 'react';
    import NotificationList from './components/NotificationList';
    import FilterControls from './components/FilterControls';
    import AppLayout from 'components/ui/AppLayout';

    const NotificationsPage = () => {
      return (
        <AppLayout>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <FilterControls />
            <NotificationList />
          </div>
        </AppLayout>
      );
    };

    export default NotificationsPage;
    ```

2.  **Add the new route in `src/Routes.jsx`:**

    ```jsx
    // ... existing imports
    import NotificationsPage from "pages/notifications";

    const ProjectRoutes = () => {
      let element = useRoutes([
        // ... existing routes
        { path: "/notifications", element: <NotificationsPage /> },
      ]);

      return element;
    };
    ```

3.  **Update `Header` component:**
    -   Add a bell icon in `src/components/ui/Header.jsx` that links to `/notifications` and shows a badge for unread notifications.

---

## 3. Appointments Scheduler

A feature to allow users to schedule and manage their medical appointments.

### 3.1. Create New Files

1.  **Create the page component:**
    -   Create a new folder `src/pages/appointments`.
    -   Inside this folder, create `index.jsx` and `README.md`.

2.  **Create components for the appointments page:**
    -   Create a new folder `src/pages/appointments/components`.
    -   Inside this folder, create:
        -   `AppointmentCalendar.jsx`: A calendar view of appointments.
        -   `UpcomingAppointments.jsx`: A list of upcoming appointments.
        -   `BookAppointmentModal.jsx`: A modal form to book a new appointment.

### 3.2. Implementation Steps

1.  **`src/pages/appointments/index.jsx`:**

    ```jsx
    import React from 'react';
    import AppointmentCalendar from './components/AppointmentCalendar';
    import UpcomingAppointments from './components/UpcomingAppointments';
    import AppLayout from 'components/ui/AppLayout';
    import Button from 'components/ui/Button';

    const AppointmentsPage = () => {
      // State to manage modal visibility
      const [isModalOpen, setIsModalOpen] = React.useState(false);

      return (
        <AppLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Appointments</h1>
              <Button onClick={() => setIsModalOpen(true)}>Book Appointment</Button>
            </div>
            <UpcomingAppointments />
            <AppointmentCalendar />
            {/* <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
          </div>
        </AppLayout>
      );
    };

    export default AppointmentsPage;
    ```

2.  **Add the new route in `src/Routes.jsx`:**

    ```jsx
    // ... existing imports
    import AppointmentsPage from "pages/appointments";

    const ProjectRoutes = () => {
      let element = useRoutes([
        // ... existing routes
        { path: "/appointments", element: <AppointmentsPage /> },
      ]);

      return element;
    };
    ```

3.  **Add a link in `QuickActionCards.jsx` (`src/pages/health-dashboard-overview/components/QuickActionCards.jsx`):**
    -   Add a new card that links to the `/appointments` page.
