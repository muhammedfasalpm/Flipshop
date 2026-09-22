import React, { useRef } from "react";
import gsap from "gsap";

const StatCard = ({ title, value, icon: Icon, color = "purple", trend }) => {
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const colorVariants = {
    purple: {
      bgIcon: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      accent: "from-purple-600/20 to-indigo-600/10",
      glow: "shadow-purple-500/10",
    },
    blue: {
      bgIcon: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      accent: "from-blue-600/20 to-cyan-600/10",
      glow: "shadow-blue-500/10",
    },
    emerald: {
      bgIcon: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      accent: "from-emerald-600/20 to-teal-600/10",
      glow: "shadow-emerald-500/10",
    },
    amber: {
      bgIcon: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      accent: "from-amber-600/20 to-orange-600/10",
      glow: "shadow-amber-500/10",
    },
  };

  const currentVariant = colorVariants[color] || colorVariants.purple;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`stat-card relative overflow-hidden bg-[#0f172a] border border-purple-900/40 rounded-3xl p-6 shadow-xl ${currentVariant.glow} backdrop-blur-xl flex flex-col justify-between`}
    >
      <div className={`absolute -right-10 -bottom-10 w-36 h-36 bg-gradient-to-br ${currentVariant.accent} rounded-full blur-2xl pointer-events-none`} />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-inner ${currentVariant.bgIcon}`}>
          <Icon className="w-5.5 h-5.5" />
        </div>
      </div>

      <div className="relative z-10 flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
