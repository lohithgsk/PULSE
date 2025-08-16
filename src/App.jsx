import React from "react";
import Routes from "./Routes";
import { SessionProvider } from './context/SessionContext';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <Routes />
      </ToastProvider>
    </SessionProvider>
  );
}

export default App;
