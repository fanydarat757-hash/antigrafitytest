import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10',
      glow: 'group-hover:border-emerald-500/50'
    },
    blue: {
      bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/10',
      glow: 'group-hover:border-sky-500/50'
    },
    amber: {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10',
      glow: 'group-hover:border-amber-500/50'
    },
    rose: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10',
      glow: 'group-hover:border-rose-500/50'
    },
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className={`bg-slate-900/75 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-700/60 shadow-xl shadow-black/40 transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 transform-gpu ${style.glow}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-2xl border shadow-md ${style.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

