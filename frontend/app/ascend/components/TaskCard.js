import React from "react";

export default function TaskCard({ task, submitted, onSelectTask }) {
  const initials = (task.company_name || "Co")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col justify-between gap-5 transition-colors duration-200 backdrop-blur-md relative ${
        submitted
          ? "border border-emerald-500/40 bg-emerald-950/20"
          : "border border-white/10 bg-[#08080c]/90 hover:border-white/25"
      }`}
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
            {task.company_logo ? (
              <img
                src={task.company_logo}
                alt={task.company_name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full rounded-lg bg-white/10 text-white font-bold text-xs items-center justify-center ${
                task.company_logo ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm tracking-wide">
              {task.company_name}
            </h4>
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-white leading-snug">
          {task.title}
        </h3>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
          {task.description}
        </p>

        {task.requirements && (
          <div className="mt-4 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              Reqs:
            </span>
            {task.requirements.split(",").map((req, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px] font-medium"
              >
                {req.trim()}
              </span>
            ))}
          </div>
        )}

        {task.perks && (
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2.5">
            <span className="text-sm">🎁</span>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                Perks & Offer
              </span>
              <span className="text-white text-xs">{task.perks}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
          <svg
            className="w-3.5 h-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {task.deadline
              ? `Deadline: ${new Date(task.deadline).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "Rolling Submissions"}
          </span>
        </div>

        {submitted ? (
          <span className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <span>✓</span>
            <span>Submitted</span>
          </span>
        ) : (
          <button
            onClick={() => onSelectTask(task)}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Submit Solution</span>
            <span>↗</span>
          </button>
        )}
      </div>
    </div>
  );
}
