import React, { useState } from "react";
import { DOMAINS } from "@/utils/constants";

export default function RegistrationModal({ existingRegistration, onClose, onSuccess }) {
  const isEditing = Boolean(existingRegistration);

  const [primaryDomain, setPrimaryDomain] = useState(
    existingRegistration?.primary_domain || "Coder"
  );
  const [seekingInternship, setSeekingInternship] = useState(
    existingRegistration?.seeking_internship ?? true
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    existingRegistration?.portfolio_url || ""
  );
  const [githubUrl, setGithubUrl] = useState(existingRegistration?.github_url || "");
  const [linkedinUrl, setLinkedinUrl] = useState(
    existingRegistration?.linkedin_url || ""
  );
  const [skills, setSkills] = useState(existingRegistration?.skills || "");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegSubmitting(true);
    setRegError("");

    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch("/api/v1/ascend/register", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_domain: primaryDomain,
          seeking_internship: seekingInternship,
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
        setRegError(data.error || "Failed to save profile.");
      }
    } catch (err) {
      setRegError("Network error during profile update.");
    } finally {
      setRegSubmitting(false);
    }
  };

  const domainStyles = {
    Coder: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:border-cyan-400",
    Creative: "bg-pink-500/10 border-pink-500/30 text-pink-300 hover:border-pink-400",
    Management: "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:border-amber-400",
    Maker: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:border-indigo-400",
    Strategist: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-400",
  };

  const selectedDomainStyles = {
    Coder: "bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    Creative: "bg-pink-500/25 border-pink-400 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    Management: "bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    Maker: "bg-indigo-500/25 border-indigo-400 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    Strategist: "bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto selection:bg-white selection:text-black">
      <div className="bg-[#090815] rounded-3xl border border-white/20 p-6 sm:p-8 max-w-lg w-full shadow-[0_0_80px_rgba(124,58,237,0.2)] relative animate-fadeIn my-auto max-h-[88vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            {isEditing ? "Edit Candidate Profile" : "Ascend Candidate Registration"}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-normal">
            {isEditing
              ? "Update your portfolio links and technical skills."
              : "Register your engineering profile to access live bounties & recruitment passes."}
          </p>
        </div>

        {regError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-4 text-center">
            {regError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Primary Domain Section (Only during new registration) */}
          {!isEditing && (
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Primary Ascend Domain *
              </label>

              <div className="grid grid-cols-2 gap-2">
                {["Coder", "Creative", "Management", "Maker"].map((dom) => {
                  const isSelected = primaryDomain === dom;
                  return (
                    <button
                      key={dom}
                      type="button"
                      onClick={() => setPrimaryDomain(dom)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? selectedDomainStyles[dom] || "bg-violet-500/25 border-violet-400 text-violet-200 shadow-md"
                          : domainStyles[dom] || "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{dom}</span>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Portfolio / Resume Link
            </label>
            <input
              type="url"
              placeholder="https://myportfolio.com or Drive link"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
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
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
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
                className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Primary Technical Skills
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Figma, AI Pipelines"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={regSubmitting}
            className="mt-3 w-full py-3.5 bg-white hover:bg-slate-100 text-black text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>
              {regSubmitting
                ? "Saving Candidate Profile..."
                : isEditing
                ? "Update Candidate Profile"
                : "Complete Ascend Registration"}
            </span>
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
