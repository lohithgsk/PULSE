import React from "react";
import Routes from "./Routes";
import ErrorBoundary from './components/ErrorBoundary';
import { SessionProvider } from './context/SessionContext';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </ToastProvider>
    </SessionProvider>
  );
}

export default App;
