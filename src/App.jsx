import React from "react";
import Routes from "./Routes";
import { SessionProvider } from './context/SessionContext';

function App() {
  return (
    <SessionProvider>
      <Routes />
    </SessionProvider>
  );
}

export default App;
