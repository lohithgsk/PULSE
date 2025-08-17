import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from './Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null); // { message, type, duration }

  const hide = useCallback(() => setToast(null), []);

  const show = useCallback((message, options = {}) => {
    const { type = 'info', duration = 4000 } = options;
    setToast({ message, type, duration });
  }, []);

  const api = useMemo(() => ({
    show,
    hide,
    success: (msg, opts) => show(msg, { ...(opts || {}), type: 'success' }),
    error: (msg, opts) => show(msg, { ...(opts || {}), type: 'error' }),
    info: (msg, opts) => show(msg, { ...(opts || {}), type: 'info' }),
    warning: (msg, opts) => show(msg, { ...(opts || {}), type: 'warning' }),
  }), [show, hide]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hide}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
