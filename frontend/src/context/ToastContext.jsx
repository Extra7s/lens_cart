import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`
            flex items-center gap-3 px-5 py-4 min-w-[300px] max-w-sm pointer-events-auto
            border shadow-2xl toast-enter animate-slide-in
            ${t.type === 'success' ? 'bg-obsidian-800 border-gold-500/50 text-obsidian-100' : ''}
            ${t.type === 'error' ? 'bg-obsidian-800 border-ember-500/50 text-obsidian-100' : ''}
            ${t.type === 'info' ? 'bg-obsidian-800 border-obsidian-500 text-obsidian-100' : ''}
          `}>
            <span className={`text-lg ${t.type === 'success' ? 'text-gold-400' : t.type === 'error' ? 'text-ember-400' : 'text-obsidian-300'}`}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <p className="text-sm font-body">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="ml-auto text-obsidian-500 hover:text-obsidian-200 text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
