"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AscendIntroAnimation from "./components/AscendIntroAnimation";
import RegistrationModal from "./components/RegistrationModal";
import FloatingAstronaut from "./components/FloatingAstronaut";
import PartnerMarquee from "./components/PartnerMarquee";

// Scroll reveal component for smooth on-scroll entrance animations
function ScrollReveal({ children, className = "", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function AscendPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);

  const overviewRef = useRef(null);

  // Verify authentication and registration state
  useEffect(() => {
    async function checkAuthAndRegistration() {
      try {
        setCheckingAuth(true);
        const res = await fetch("/api/v1/ascend/register");

        if (res.status === 401) {
          setIsAuthenticated(false);
          setRegistered(false);
          router.push("/login?redirect=/ascend");
          return;
        }

        const data = await res.json();

        if (res.ok && data.success) {
          setIsAuthenticated(true);
          if (data.registered) {
            setRegistered(true);
            setUserRegistration(data.registration);
          } else {
            setRegistered(false);
          }
        } else {
          setIsAuthenticated(false);
          setRegistered(false);
          router.push("/login?redirect=/ascend");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
        setRegistered(false);
        router.push("/login?redirect=/ascend");
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuthAndRegistration();
  }, [router]);

  const handleRegistrationSuccess = (regData) => {
    setRegistered(true);
    setUserRegistration(regData);
    setShowRegModal(false);
  };

  const scrollToOverview = () => {
    if (overviewRef.current) {
      overviewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Authenticating Candidate...
        </span>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#040406] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img src="/ascend/ascend_lunar_bg.png" alt="Lunar Moon" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-md w-full bg-black/80 border border-white/20 p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_80px_rgba(255,255,255,0.15)] flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-medium">
            You must be signed in with a valid account to access the Ascend portal.
          </p>
          <a
            href="/login?redirect=/ascend"
            className="mt-2 w-full py-3.5 bg-white hover:bg-slate-200 text-black text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Access Ascend</span>
            <span>↗</span>
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-slate-100 font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {!registered ? (
        <AscendIntroAnimation
          onComplete={() => setShowRegModal(true)}
          onRegister={() => setShowRegModal(true)}
        />
      ) : (
        <>
          <div className="fixed inset-0 z-0 bg-black pointer-events-none" />

          <img
            src="/ascend/ascend_lunar_bg.png"
            alt="Lunar Moon Background"
            className="fixed top-0 right-0 h-screen w-auto object-cover object-right opacity-90 pointer-events-none z-0 mix-blend-screen select-none"
          />

          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[160px]" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-slate-300/5 rounded-full blur-[160px]" />
          </div>

          {/* Section 1: 100vh Centered Welcome Card */}
          <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-16 z-10 max-w-4xl mx-auto">
            <FloatingAstronaut />

            {/* Centered Welcome Card */}
            <div className="rounded-3xl border border-white/15 bg-[#08080c]/90 p-8 sm:p-12 md:p-14 backdrop-blur-2xl relative overflow-hidden w-full flex flex-col items-center gap-6 text-center shadow-[0_0_60px_rgba(255,255,255,0.06)] my-auto animate-fadeIn">
              {/* Top ambient hairline accent */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

              {/* Embedded Floating Astronaut 2 Decorative Asset */}
              <img
                src="/ascend/astronaut2.png"
                alt="Floating Astronaut Decorative Accent"
                className="absolute -bottom-10 -right-10 w-44 sm:w-60 md:w-72 opacity-30 pointer-events-none select-none z-0 mix-blend-screen transform -rotate-12"
              />

              <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                {/* Header Title */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)]">
                    Welcome to Ascend
                  </h1>
                  {userRegistration?.name && (
                    <p className="text-base sm:text-lg font-semibold text-slate-300">
                      Hello, <span className="text-white font-extrabold">{userRegistration.name}</span>
                    </p>
                  )}
                </div>

                {/* Domain & Details Chip */}
                {userRegistration && (
                  <div className="flex flex-wrap items-center justify-center gap-2.5 my-1">
                    {userRegistration.domain && (
                      <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-xs font-medium">
                        Domain: <strong className="text-white font-bold">{userRegistration.domain}</strong>
                      </span>
                    )}
                    {userRegistration.team && (
                      <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/15 text-slate-200 text-xs font-medium">
                        Team: <strong className="text-white font-bold">{userRegistration.team}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Welcome Message */}
                <div className="max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-normal">
                  <p>
                    Thank you for registering for <strong className="text-white font-semibold">Ascend</strong>.
                    Your candidate profile has been verified and registered in our evaluation system.
                  </p>
                  <p className="text-slate-400">
                    Company bounties, problem statements, and solution submission portals will unlock here soon. Stay tuned!
                  </p>
                </div>

                {/* Countdown / Launch Info Box */}
                <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/15 w-full max-w-md flex items-center justify-center gap-3 text-xs text-slate-200 font-semibold shadow-inner">
                  <svg
                    className="w-4 h-4 text-white shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.84 2.58m-.12-8.54a6 6 0 00-7.38 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.58-5.84l4.24-4.24"
                    />
                  </svg>
                  <span>Tasks & Bounties Opening Shortly</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator Down Chevron */}
            <button
              type="button"
              onClick={scrollToOverview}
              aria-label="Scroll to Competition Overview"
              className="mt-6 flex flex-col items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors cursor-pointer group"
            >
              <span>Scroll to Explore</span>
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-white animate-bounce transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </section>

          {/* Section 2: On-Scroll Animated Competition Overview & Marquee */}
          <div ref={overviewRef} className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10 flex flex-col gap-16">
            {/* What is Ascend Section */}
            <ScrollReveal className="w-full flex flex-col gap-8 text-left" delay={100}>
              <div className="flex flex-col gap-1.5 items-center text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  COMPETITION OVERVIEW
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                  What is Ascend?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed font-normal">
                  Ascend is the flagship recruitment & company bounty challenge designed to connect top-tier student engineers, designers, and managers directly with industry tech leaders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <ScrollReveal delay={200}>
                  <div className="rounded-2xl border border-white/10 bg-[#08080c]/80 p-6 backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden group hover:border-white/25 transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">Real-World Bounties</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                        Solve actual product challenges, full-stack bounties, and hardware prototypes commissioned by tech partner companies.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Feature 2 */}
                <ScrollReveal delay={300}>
                  <div className="rounded-2xl border border-white/10 bg-[#08080c]/80 p-6 backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden group hover:border-white/25 transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">5-Day Sprint Window</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                        Candidates get a focused 5-day window to analyze company problem statements, build solutions, and submit their work.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Feature 3 */}
                <ScrollReveal delay={400}>
                  <div className="rounded-2xl border border-white/10 bg-[#08080c]/80 p-6 backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden group hover:border-white/25 transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">Top 5 Internship Offers</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                        The top 5 candidates in each domain category receive direct internship opportunities with partner companies.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>

            {/* Participating Companies Logo Slideshow */}
            {/* <ScrollReveal delay={20A0}>
              <PartnerMarquee />
            </ScrollReveal> */}
          </div>
        </>
      )}

      {showRegModal && (
        <RegistrationModal
          onClose={() => setShowRegModal(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </main>
  );
}
