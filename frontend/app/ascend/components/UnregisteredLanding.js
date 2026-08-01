import React from "react";

export default function UnregisteredLanding({ onRegister, onShowAnimation }) {
  return (
    <div className="flex flex-col items-center md:items-start w-full gap-6 sm:gap-8 pt-4 sm:pt-8">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tighter">µFIFA</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Festival of Innovation, Fellowship & Achievement
        </span>
      </div>

      <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-9xl text-white tracking-[0.15em] text-lunar-glow select-none uppercase my-2 drop-shadow-[0_0_35px_rgba(255,255,255,0.7)]">
        ASCEND
      </h1>

      <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
        The ultimate recruitment & company bounty challenge. Complete real-world industry tasks, earn 10-star evaluations, and unlock exclusive internship offers.
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-2">
        <button
          onClick={onRegister}
          className="px-8 py-4 bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>Register for Ascend</span>
          <span>↗</span>
        </button>

        {onShowAnimation && (
          <button
            onClick={onShowAnimation}
            className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Play Intro Showcase</span>
            <span>▶</span>
          </button>
        )}
      </div>
    </div>
  );
}
