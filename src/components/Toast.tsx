import React, { useEffect } from 'react';
import { CheckCircle2, FileSpreadsheet, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'excel' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    excel: <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0" />,
  };

  const bgStyles = {
    excel: 'border-emerald-200 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10',
    success: 'border-blue-200 bg-blue-50/95 text-blue-950 shadow-blue-500/10',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-950 shadow-amber-500/10',
    info: 'border-slate-200 bg-white/95 text-slate-900 shadow-slate-500/10',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-xs transition-all animate-in slide-in-from-bottom-3 duration-200 ${bgStyles[toast.type]}`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-xs">
        <h4 className="font-bold text-slate-900">{toast.title}</h4>
        {toast.message && <p className="text-slate-600 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
