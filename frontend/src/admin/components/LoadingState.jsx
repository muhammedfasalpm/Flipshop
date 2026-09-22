import React from "react";

const LoadingState = ({ type = "cards", count = 4 }) => {
  if (type === "table") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-slate-900/80 rounded-2xl border border-purple-900/20" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-900/40 rounded-2xl border border-purple-900/20" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-32 bg-slate-900/60 rounded-3xl border border-purple-900/30 p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <div className="w-24 h-4 bg-slate-800 rounded-md" />
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl" />
          </div>
          <div className="w-32 h-8 bg-slate-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
