import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const NotificationToast = ({ toast, onClose }) => {
  if (!toast || !toast.message) return null;

  const { type = "success", message } = toast;

  const typeStyles = {
    success: {
      bg: "bg-emerald-950/90 border-emerald-500/40 text-emerald-200",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    error: {
      bg: "bg-rose-950/90 border-rose-500/40 text-rose-200",
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    info: {
      bg: "bg-blue-950/90 border-blue-500/40 text-blue-200",
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${style.bg}`}>
        {style.icon}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
