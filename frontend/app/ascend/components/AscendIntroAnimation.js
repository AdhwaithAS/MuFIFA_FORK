"use client";

import React, { useState, useEffect } from "react";
import FloatingAstronaut from "./FloatingAstronaut";

// Cinematic scale & blur entrance animation for ASCEND
function AscendHeroTitle({ text }) {
  return (
    <div className="relative inline-flex items-center justify-center py-2 select-none">
      <style>{`
        @keyframes ascendReveal {
          0% {
            opacity: 0;
            transform: scale(0.82) translateY(20px);
            filter: blur(16px);
            letter-spacing: 0.35em;
          }
          60% {
            opacity: 0.9;
            filter: blur(2px);
            transform: scale(1.02) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
            letter-spacing: 0.16em;
          }
        }
        .animate-ascend-hero {
          animation: ascendReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <span className="animate-ascend-hero text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] font-black uppercase tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_15px_60px_rgba(255,255,255,0.5)]">
        {text}
      </span>
    </div>
  );
}

const SLIDES = [
  {
    title: "ASCEND",
    isWritten: false,
    isHeroBranding: true,
    subtext: "The 5-Day Recruitment & Company Bounty Sprint",
    visual: (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-1">
        <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>5-Day Sprint</span>
        </span>
        <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Real Company Bounties</span>
        </span>
        <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Top 5 Direct Internships</span>
        </span>
      </div>
    ),
  },
  {
    title: "SOLVE COMPANY TASKS",
    isWritten: false,
    isHeroBranding: false,
    subtext:
      "Pick a problem statement from your domain, build your solution within 5 days, and submit directly to hiring teams.",
    visual: (
      <div className="flex flex-col gap-2 p-3.5 sm:p-4 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-xl max-w-lg w-full text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-200 text-[10px] font-extrabold uppercase tracking-wider">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>5-Day Sprint Window</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Live Problem Statement</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Engineering & Design Bounties</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">Build and ship production-ready solutions before deadline.</p>
          </div>
          <span className="text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 shrink-0 ml-3">
            5 Days
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "DIRECT INTERNSHIPS",
    isWritten: false,
    isHeroBranding: false,
    subtext:
      "The top 5 candidates from each category win direct internship offers with participating partner companies.",
    visual: (
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-black to-slate-900/90 border border-white/20 backdrop-blur-xl max-w-md w-full">
        <div className="flex flex-col text-left gap-0.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
            Hiring Guarantee
          </span>
          <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
            Top 5 Per Category
          </h4>
          <span className="text-[10px] font-medium text-slate-400">
            Direct Internship Offers • Fast-Track Hiring
          </span>
        </div>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 ml-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    ),
  },
];

export default function AscendIntroAnimation({ onComplete, onRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="challenge-modal-fixed-wrapper bg-[#040406] text-slate-100 flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-y-auto overflow-x-hidden selection:bg-white selection:text-black">
      {/* Top Animated Countdown Timer Line in High-Contrast Lunar Palette */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
        <div
          key={`timer-${currentSlide}`}
          className="h-full bg-gradient-to-r from-slate-400 via-white to-slate-200 animate-timer-bar"
        />
      </div>

      {/* Lunar Deep Space Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/ascend/ascend_lunar_bg.png"
          alt="Lunar Moon Background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15 pointer-events-none mix-blend-screen select-none"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/5 rounded-full blur-[220px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-slate-300/5 rounded-full blur-[170px]" />
      </div>

      {/* Main Centered Showcase Content */}
      <div className="relative z-10 my-auto max-w-3xl lg:max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-6 sm:py-8">
        {/* Floating Astronaut positioned on the left side behind the text */}
        <FloatingAstronaut />

        {/* Centered Main Title */}
        <div key={`title-wrapper-${currentSlide}`}>
          {slide.isHeroBranding ? (
            <AscendHeroTitle text={slide.title} />
          ) : (
            <h1 className="relative z-10 font-black text-white uppercase leading-none select-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight drop-shadow-[0_4px_24px_rgba(255,255,255,0.4)] animate-title-reveal">
              {slide.title}
            </h1>
          )}
        </div>

        {/* Centered Sub Text below Title */}
        <p
          key={`subtext-${currentSlide}`}
          className={`relative z-10 text-slate-300 text-center leading-relaxed font-medium animate-subtext-reveal px-2 ${
            slide.isHeroBranding
              ? "text-sm sm:text-lg md:text-xl text-slate-200 font-extrabold uppercase tracking-widest max-w-xl"
              : "text-xs sm:text-base md:text-lg max-w-lg sm:max-w-xl"
          }`}
        >
          {slide.subtext}
        </p>

        {/* Centered Rich Visual Element */}
        <div key={`visual-${currentSlide}`} className="relative z-10 mt-2 animate-scale-up w-full flex justify-center">
          {slide.visual}
        </div>

        {/* Centered Primary CTA Button */}
        <button
          onClick={onRegister}
          className="relative z-10 mt-4 px-8 py-4 bg-white hover:bg-slate-200 text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.7)] transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>Register for Ascend</span>
          <span>↗</span>
        </button>
      </div>

      {/* Bottom Subtle Indicator Lines */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentSlide
                  ? "w-10 bg-white"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
