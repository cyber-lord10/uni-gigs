import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: <CheckCircle size={20} className="text-[var(--color-success)]" />,
  error: <AlertCircle size={20} className="text-[var(--color-error)]" />,
  info: <Info size={20} className="text-[var(--color-primary)]" />,
};

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center gap-md p-md bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-xl animate-fade-in min-w-[300px]">
      {icons[type]}
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-muted hover:text-[var(--color-text-main)]"
      >
        <X size={16} />
      </button>
    </div>
  );
}
