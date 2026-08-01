import React, { useState, useRef, useEffect } from "react";
import { DOMAINS } from "../constants";

export default function RegistrationModal({ onClose, onSuccess }) {
  const [primaryDomain, setPrimaryDomain] = useState("Coder");
  const [domainOpen, setDomainOpen] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDomainOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegSubmitting(true);
    setRegError("");

    try {
      const res = await fetch("/api/v1/ascend/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_domain: primaryDomain,
          portfolio_url: portfolioUrl,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          skills,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.registration);
      } else {
        setRegError(data.error || "Registration failed.");
      }
    } catch (err) {
      setRegError("Network error during registration.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const selectedDomainObj = DOMAINS.find((d) => d.id === primaryDomain) || DOMAINS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-white selection:text-black">
      <div className="bg-[#08080c] rounded-3xl border border-white/20 p-6 sm:p-8 max-w-lg w-full shadow-[0_0_80px_rgba(255,255,255,0.15)] relative animate-fadeIn my-auto max-h-[85vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close Modal"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/15 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center gap-1.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            Ascend Candidate Profile
          </h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Register your engineering profile to access live bounties & recruitment passes.
          </p>
        </div>

        {regError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-4 text-center">
            {regError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Custom Pop-Down Primary Domain Field */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Domain *
            </label>
            <button
              type="button"
              onClick={() => setDomainOpen((prev) => !prev)}
              className="w-full bg-black/80 border border-white/20 hover:border-white/40 rounded-xl px-4 py-3 text-xs text-white flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-white/40 transition-all cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-extrabold text-white">{selectedDomainObj.title}</span>
                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                  {selectedDomainObj.id}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                  domainOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {domainOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-[#0c0d12] border border-white/25 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95)] overflow-hidden p-1.5 animate-fadeIn">
                {DOMAINS.map((d) => {
                  const isSelected = primaryDomain === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setPrimaryDomain(d.id);
                        setDomainOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-lg transition-all flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-white/15 text-white border border-white/25"
                          : "bg-[#0c0d12] text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-slate-500"}`} />
                          <span className="text-xs font-bold text-white">{d.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          {d.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal pl-3.5">
                        {d.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Portfolio / Resume Link
            </label>
            <input
              type="url"
              placeholder="https://myportfolio.com or Drive link"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                GitHub Profile
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                LinkedIn Profile
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Figma, AI Pipelines"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={regSubmitting}
            className="mt-3 w-full py-4 bg-white hover:bg-slate-100 text-black text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {regSubmitting ? "Submitting Candidate Profile..." : "Complete Ascend Registration ↗"}
          </button>
        </form>
      </div>
    </div>
  );
}
