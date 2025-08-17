import React from "react";
import Routes from "./Routes";
import ErrorBoundary from './components/ErrorBoundary';
import { SessionProvider } from './context/SessionContext';
import { ToastProvider } from './components/ui/ToastProvider';
import { I18nProvider } from './i18n/I18nProvider';

function App() {
  return (
    <SessionProvider>
      <I18nProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes />
          </ErrorBoundary>
        </ToastProvider>
      </I18nProvider>
    </SessionProvider>
  );
}

export default App;
