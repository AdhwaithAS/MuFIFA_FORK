import React, { useState } from "react";

export default function TaskSubmissionModal({ selectedTask, onClose, onSuccess }) {
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submittingTask, setSubmittingTask] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setSubmittingTask(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const res = await fetch("/api/v1/ascend/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: selectedTask.id,
          submission_url: submissionUrl,
          notes: submissionNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess("Solution submitted successfully!");
        setSubmissionUrl("");
        setSubmissionNotes("");
        onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSubmitError(data.error || "Failed to submit solution.");
      }
    } catch (err) {
      setSubmitError("Network error submitting solution.");
    } finally {
      setSubmittingTask(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#08080d] rounded-3xl border border-white/20 p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(255,255,255,0.08)] relative animate-fadeIn">
        <button
          type="button"
          aria-label="Close Modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold text-white">Submit Task Solution</h2>
        <p className="text-xs text-slate-300 font-bold mt-1">
          {selectedTask.company_name} — {selectedTask.title}
        </p>

        {submitError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            {submitSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Solution / Deliverable Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/myrepo or Figma link or Deployed App"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Notes & Documentation
            </label>
            <textarea
              rows={3}
              placeholder="Describe your approach, key features, or instructions for the reviewer..."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/50"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTask}
              className="px-6 py-2.5 bg-white hover:bg-slate-200 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {submittingTask ? "Submitting..." : "Submit Solution"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
