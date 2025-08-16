import React, { useEffect } from 'react';

const icons = {
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const colors = {
  success: 'bg-emerald-600 border-2 border-emerald-400',
  error: 'bg-red-600 border-2 border-red-400',
  info: 'bg-[var(--color-primary)] border-2 border-[var(--color-primary-hover)]',
  warning: 'bg-amber-600 border-2 border-amber-400',
};

const iconBackgrounds = {
  success: 'bg-[var(--color-surface)]/20 text-[var(--color-text-inverse)]',
  error: 'bg-[var(--color-surface)]/20 text-[var(--color-text-inverse)]',
  info: 'bg-[var(--color-surface)]/20 text-[var(--color-text-inverse)]',
  warning: 'bg-[var(--color-surface)]/20 text-[var(--color-text-inverse)]',
};

function Toast({ message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
  className={`fixed bottom-6 right-6 z-50 flex items-center space-x-4 px-5 py-4 rounded-xl shadow-2xl ${colors[type] || colors.info} backdrop-blur-sm animate-slide-in transform transition-all duration-300 hover:scale-105 hover:shadow-3xl w-80 min-h-[4rem]`}
      role="alert"
    >
      {/* Icon container with background */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${iconBackgrounds[type] || iconBackgrounds.info}`}
      >
        {icons[type] || icons.info}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 max-w-[200px]">
  <p className="text-sm font-medium leading-relaxed text-[var(--color-text-inverse)]/95 pr-2 break-words line-clamp-2">{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
  className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-surface)]/10 hover:bg-[var(--color-surface)]/20 text-[var(--color-text-inverse)]/80 hover:text-[var(--color-text-inverse)] focus:outline-none focus:ring-2 focus:ring-[var(--color-surface)]/30 transition-all duration-200 transform hover:scale-110 flex-shrink-0"
        aria-label="Close notification"
        title="Close"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Progress bar */}
      <div
  className="absolute bottom-0 left-0 h-1 bg-[var(--color-surface)]/30 rounded-b-xl animate-progress"
        style={{
          animation: `progress ${duration}ms linear forwards`,
        }}
      ></div>

      {/* Enhanced animations and styles */}
      <style>{`
        @keyframes slide-in {
          from { 
            transform: translateX(120%) scale(0.8); 
            opacity: 0; 
          }
          to   { 
            transform: translateX(0) scale(1);    
            opacity: 1; 
          }
        }
        
        @keyframes progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        
        .animate-slide-in { 
          animation: slide-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        
        .animate-progress {
          animation-fill-mode: forwards;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Toast;
