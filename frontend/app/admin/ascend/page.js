"use client";

import React, { useState, useEffect } from "react";
import { THEME } from "../layout";

const DOMAINS = ["Coder", "Creative", "Management", "Maker"];

const DOMAIN_STYLES = {
  Coder: "bg-cyan-50 border-cyan-200 text-cyan-700",
  Creative: "bg-pink-50 border-pink-200 text-pink-700",
  Management: "bg-amber-50 border-amber-200 text-amber-700",
  Maker: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

export default function AdminAscendPage() {
  const [activeTab, setActiveTab] = useState("submissions"); // "submissions" or "create_task" or "tasks_list"

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  // Create Task form state
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [domain, setDomain] = useState("Coder");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [perks, setPerks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  // Grading Modal State
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [qualityScore, setQualityScore] = useState(5);
  const [innovationScore, setInnovationScore] = useState(5);
  const [gradingStatus, setGradingStatus] = useState("Graded");
  const [adminFeedback, setAdminFeedback] = useState("");
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

  // Filters
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const res = await fetch("/api/v1/admin/ascend/tasks");
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const res = await fetch("/api/v1/admin/ascend/verify");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSubmissions();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/v1/admin/ascend/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          company_logo: companyLogo,
          domain,
          title,
          description,
          requirements,
          perks,
          deadline: deadline || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormMsg({ type: "success", text: "Company task created successfully!" });
        setCompanyName("");
        setCompanyLogo("");
        setTitle("");
        setDescription("");
        setRequirements("");
        setPerks("");
        setDeadline("");
        fetchTasks();
      } else {
        setFormMsg({ type: "error", text: data.error || "Failed to create task" });
      }
    } catch (err) {
      setFormMsg({ type: "error", text: "Network request failed." });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setQualityScore(sub.quality_score || 5);
    setInnovationScore(sub.innovation_score || 5);
    setGradingStatus(sub.status || "Graded");
    setAdminFeedback(sub.admin_feedback || "");
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;
    setGradeSubmitting(true);

    try {
      const res = await fetch("/api/v1/admin/ascend/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: selectedSubmission.id,
          quality_score: qualityScore,
          innovation_score: innovationScore,
          status: gradingStatus,
          admin_feedback: adminFeedback,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedSubmission(null);
        fetchSubmissions();
      } else {
        alert(data.error || "Failed to submit grade");
      }
    } catch (err) {
      console.error("Grading failed:", err);
      alert("Error submitting grade");
    } finally {
      setGradeSubmitting(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const taskDomain = sub.ascend_tasks?.domain || "";
    if (filterDomain !== "All" && taskDomain !== filterDomain) return false;
    if (filterStatus !== "All" && sub.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-[0.18em] text-slate-900 uppercase">
            Ascend Competition Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage company bounties, evaluate student submissions, and award 10-star quality & innovativeness scores.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "submissions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("tasks_list")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "tasks_list"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("create_task")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "create_task"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            + New Company Task
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMISSIONS & GRADING */}
      {activeTab === "submissions" && (
        <div className={`${THEME.panel} rounded-2xl overflow-hidden p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Student Submissions
            </h2>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-semibold">Domain:</span>
                <select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none"
                >
                  <option value="All">All Domains</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-semibold">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Graded">Graded</option>
                  <option value="Shortlisted">Shortlisted</option>
                </select>
              </div>
            </div>
          </div>

          {submissionsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-semibold">Loading Submissions...</span>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No submissions found matching the criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Company & Task</th>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-4">Submission & Notes</th>
                    <th className="py-3 px-4 text-center">Score / 10</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((sub) => {
                    const studentName = sub.registrations?.name || sub.user_id;
                    const company = sub.ascend_tasks?.company_name || "Company";
                    const taskTitle = sub.ascend_tasks?.title || `Task #${sub.task_id}`;
                    const taskDomain = sub.ascend_tasks?.domain || "Coder";

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <div>{studentName}</div>
                          <span className="text-[10px] text-slate-400 font-normal">{sub.user_id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-violet-700">{company}</div>
                          <div className="text-slate-600 truncate max-w-xs">{taskTitle}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                              DOMAIN_STYLES[taskDomain] || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {taskDomain}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={sub.submission_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 underline font-semibold hover:text-sky-800 max-w-xs truncate block"
                          >
                            View Submission ↗
                          </a>
                          {sub.notes && (
                            <div className="mt-1 text-[11px] text-slate-600 bg-slate-100 p-1.5 rounded-lg max-w-xs line-clamp-2 font-normal">
                              📝 {sub.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {sub.status === "Pending" ? (
                            <span className="text-slate-400 italic">Unrated</span>
                          ) : (
                            <div className="inline-flex items-center gap-1 font-black text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                              <span>★ {sub.total_rating || 0}/10</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              sub.status === "Shortlisted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : sub.status === "Graded"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenGradeModal(sub)}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            Grade & Mark
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS LIST */}
      {activeTab === "tasks_list" && (
        <div className={`${THEME.panel} rounded-2xl p-6`}>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Active Company Bounties
          </h2>

          {tasksLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tasks created yet. Click "+ New Company Task" to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((t) => (
                <div key={t.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50 hover:border-slate-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 p-0.5 flex items-center justify-center shrink-0">
                          {t.company_logo ? (
                            <img
                              src={t.company_logo}
                              alt={t.company_name}
                              className="w-full h-full object-contain rounded"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-slate-600 font-black text-xs">
                              {(t.company_name || "C")[0]}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-violet-800 text-sm">{t.company_name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${DOMAIN_STYLES[t.domain] || ""}`}>
                        {t.domain}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">{t.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{t.description}</p>
                    {t.perks && (
                      <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded-lg font-semibold">
                        🎁 Perks: {t.perks}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between items-center">
                    <span>Task #{t.id}</span>
                    <span>Deadline: {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE TASK FORM */}
      {activeTab === "create_task" && (
        <div className={`${THEME.panel} rounded-2xl p-6 max-w-3xl mx-auto w-full`}>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
            Create Company Bounty / Internship Task
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Publish a task for students competing in Ascend.
          </p>

          {formMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs mb-6 font-bold ${
                formMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Logo URL</label>
                <input
                  type="url"
                  placeholder="https://logo.clearbit.com/google.com"
                  value={companyLogo}
                  onChange={(e) => setCompanyLogo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Domain *</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task / Bounty Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Build an AI-Powered Realtime Dashboard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Detailed explanation of the challenge..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requirements</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Tailwind, Deployed App link"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internship Perks / Offer</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000/mo Stipend + Fast-track Interview"
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={formSubmitting}
              className="mt-2 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {formSubmitting ? "Publishing Task..." : "Publish Ascend Task"}
            </button>
          </form>
        </div>
      )}

      {/* GRADING MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl relative animate-fadeIn">
            <h3 className="text-base font-extrabold text-slate-900">
              Grade & Mark Student Submission
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Score out of 10 stars based on Quality and Innovativeness.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col gap-2">
              <div className="font-bold text-slate-800">
                {selectedSubmission.registrations?.name || selectedSubmission.user_id}
              </div>
              <div className="text-violet-600 font-semibold">
                {selectedSubmission.ascend_tasks?.company_name} — {selectedSubmission.ascend_tasks?.title}
              </div>
              <a
                href={selectedSubmission.submission_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 underline text-[11px] font-semibold truncate block"
              >
                {selectedSubmission.submission_url} ↗
              </a>

              {selectedSubmission.notes && (
                <div className="mt-1 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    📝 Student Notes & Documentation:
                  </span>
                  <p className="whitespace-pre-wrap leading-relaxed text-[11px] text-slate-700 font-normal">
                    {selectedSubmission.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-4">
              {/* Quality Rating (1 to 5 Stars) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Quality Score (1 - 5 Stars): <span className="text-violet-600 font-black">{qualityScore} Stars</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setQualityScore(star)}
                      className={`flex-1 py-2 rounded-lg text-sm font-black border transition-all ${
                        qualityScore >= star
                          ? "bg-amber-400 text-slate-900 border-amber-500 shadow-sm"
                          : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Innovativeness Rating (1 to 5 Stars) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Innovativeness Score (1 - 5 Stars): <span className="text-violet-600 font-black">{innovationScore} Stars</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setInnovationScore(star)}
                      className={`flex-1 py-2 rounded-lg text-sm font-black border transition-all ${
                        innovationScore >= star
                          ? "bg-cyan-400 text-slate-900 border-cyan-500 shadow-sm"
                          : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Rating Banner */}
              <div className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl flex items-center justify-between shadow-md">
                <span className="text-xs font-bold uppercase tracking-wider">Total Rating</span>
                <span className="text-xl font-black text-amber-300">
                  ★ {qualityScore + innovationScore} / 10 Stars
                </span>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Status</label>
                <select
                  value={gradingStatus}
                  onChange={(e) => setGradingStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="Graded">Graded</option>
                  <option value="Shortlisted">★ Shortlisted for Internship Interview</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Admin Feedback Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Feedback / Review Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes for student or internal hiring team..."
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitGrade}
                disabled={gradeSubmitting}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
              >
                {gradeSubmitting ? "Saving..." : "Save Grade & Mark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
