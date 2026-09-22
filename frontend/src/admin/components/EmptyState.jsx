import React from "react";
import { FolderOpen, Plus } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No Items Found",
  description = "There is currently no data to display here.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0f172a]/60 border border-purple-900/30 rounded-3xl">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
