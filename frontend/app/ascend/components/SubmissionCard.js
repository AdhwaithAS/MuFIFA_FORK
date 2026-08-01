import React from "react";

export default function SubmissionCard({ submission }) {
  const company = submission.ascend_tasks?.company_name || "Company";
  const title = submission.ascend_tasks?.title || `Task #${submission.task_id}`;
  const totalRating = submission.total_rating || 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#08080c]/90 hover:border-white/25 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-white text-sm tracking-wide">{company}</span>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 text-slate-300 border-white/10">
            {submission.status}
          </span>
        </div>

        <h3 className="font-bold text-white text-base leading-snug">{title}</h3>

        {submission.notes && (
          <div className="mt-2.5 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-slate-400 font-bold block mb-0.5 text-[10px] uppercase tracking-wider">
              Your Notes & Documentation:
            </span>
            <span className="leading-relaxed text-slate-300">{submission.notes}</span>
          </div>
        )}

        {submission.admin_feedback && (
          <div className="mt-2.5 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <span className="text-white font-bold block mb-0.5">
              Reviewer Feedback:
            </span>{" "}
            <span className="leading-relaxed">{submission.admin_feedback}</span>
          </div>
        )}
      </div>

      <div className="w-full md:w-auto flex flex-col items-center justify-center p-4 bg-black/80 border border-white/15 rounded-xl text-center shrink-0">
        {submission.status === "Pending" ? (
          <div className="flex flex-col items-center gap-1 py-1">
            <div className="text-xs text-white font-bold tracking-wider uppercase">
              Under Evaluation
            </div>
            <span className="text-[10px] text-slate-400">
              Reviewers inspecting submission
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-white/10 border border-white/15 text-white">
              {totalRating >= 8
                ? "Elite Candidate"
                : totalRating >= 6
                ? "Strong Candidate"
                : "Verified Solution"}
            </span>
            <div className="text-2xl font-black text-white my-0.5">
              ★ {totalRating}{" "}
              <span className="text-xs font-bold text-slate-400">/ 10</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium flex gap-2">
              <span>
                Quality: <strong className="text-white">{submission.quality_score}/5</strong>
              </span>
              <span>•</span>
              <span>
                Innovation:{" "}
                <strong className="text-white">{submission.innovation_score}/5</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
