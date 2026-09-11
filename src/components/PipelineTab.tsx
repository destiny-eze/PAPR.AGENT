import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  Plus, 
  Sparkles,
  ShieldCheck,
  Flame
} from "lucide-react";
import { ResearchProject, ResearchMilestone } from "../types";

interface PipelineTabProps {
  project: ResearchProject;
  onUpdateMilestone: (id: string, completed: boolean) => void;
  onAddMilestone: (milestone: Omit<ResearchMilestone, "id">) => void;
}

const PHASES = [
  { id: "topic", label: "Topic & Question", weeks: "W1-W3" },
  { id: "lit_review", label: "Literature Review", weeks: "W4-W7" },
  { id: "methodology", label: "Research Design", weeks: "W8-W11" },
  { id: "data_collection", label: "Data Collection", weeks: "W12-W15" },
  { id: "analysis", label: "Data Analysis", weeks: "W16-W18" },
  { id: "writing", label: "Manuscript Draft", weeks: "W19-W22" },
  { id: "submission", label: "Peer Submission", weeks: "W23-W25" },
  { id: "revision", label: "Revisions & Rebuttal", weeks: "W26-W28" },
];

export const PipelineTab: React.FC<PipelineTabProps> = ({
  project,
  onUpdateMilestone,
  onAddMilestone,
}) => {
  // Timer state for Pomodoro Sprint
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sprintType, setSprintType] = useState<"drafting" | "reading" | "revising">("drafting");
  const [newTitle, setNewTitle] = useState("");
  const [newWeek, setNewWeek] = useState(4);
  const [newPhase, setNewPhase] = useState<ResearchMilestone["phase"]>("writing");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const setSprint = (minutes: number, type: "drafting" | "reading" | "revising") => {
    setTimerRunning(false);
    setTimerSeconds(minutes * 60);
    setSprintType(type);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = project.milestones.filter((m) => m.completed).length;
  const progressPercent = project.milestones.length > 0 
    ? Math.round((completedCount / project.milestones.length) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Research Pipeline &amp; Timeline
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {completedCount} of {project.milestones.length} Milestones Achieved
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Iterative Manuscript Roadmap
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Based on empirical research timelines (Jordan &amp; Somali survey findings), breaking complex papers into structured phases eliminates procrastination and last-minute quality deficits.
            </p>
          </div>

          {/* Progress gauge */}
          <div className="flex items-center gap-4 bg-zinc-50 p-3.5 rounded-lg border border-zinc-200 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold text-zinc-900">{progressPercent}%</div>
              <div className="text-xs text-zinc-500 font-medium">Pipeline Progress</div>
            </div>
            <div className="w-24 bg-zinc-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

          {/* Visual Pipeline Flowchart matching PDF */}
        <div className="mt-8 pt-6 border-t border-[#E8EAED]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-4 flex items-center gap-2">
            <span>Canonical Research Stages</span>
            <span className="text-[10px] font-normal text-zinc-500">(Click a phase to filter milestones)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {PHASES.map((phase, idx) => {
              const phaseMilestones = project.milestones.filter((m) => m.phase === phase.id);
              const isDone = phaseMilestones.length > 0 && phaseMilestones.every((m) => m.completed);
              const isInProgress = phaseMilestones.some((m) => !m.completed) && phaseMilestones.some((m) => m.completed);

              return (
                <div
                  key={phase.id}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isDone
                      ? "bg-[#E8F0FE] border-[#D2E3FC] text-[#1967D2]"
                      : isInProgress
                      ? "bg-[#FFFFFF] border-[#4285F4] text-[#202124]"
                      : "bg-[#F8F9FA] border-[#E8EAED] text-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                    <span>{idx + 1}. {phase.weeks}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-300" />
                    )}
                  </div>
                  <div className="font-semibold text-xs leading-snug line-clamp-2">
                    {phase.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Milestones Checklist & Academic Focus Sprint */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Milestone Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">Weekly Milestones &amp; Deliverables</h3>
              <p className="text-xs text-zinc-500">Track deadlines to manage advisor review cycles and prevent scope creep.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 divide-y divide-zinc-100 shadow-2xs overflow-hidden">
            {project.milestones.map((m) => (
              <div
                key={m.id}
                className={`p-4 flex items-start gap-3.5 transition-colors hover:bg-zinc-50/60 ${
                  m.completed ? "bg-zinc-50/40" : ""
                }`}
              >
                <button
                  onClick={() => onUpdateMilestone(m.id, !m.completed)}
                  className="mt-0.5 text-zinc-400 hover:text-indigo-600 transition-colors shrink-0"
                >
                  {m.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 hover:text-zinc-500" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-semibold ${
                        m.completed ? "line-through text-zinc-400" : "text-zinc-900"
                      }`}
                    >
                      {m.title}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                      Week {m.deadlineWeek}
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {m.phase}
                    </span>
                  </div>
                  {m.notes && (
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {m.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reassurance banner from PDF */}
          <div className="bg-[#F8F9FA] border border-[#E8EAED] rounded-xl p-4 text-xs text-[#202124] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#4285F4] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#202124]">
                Supervisor &amp; Writing Group Alignment
              </div>
              <p className="mt-0.5 text-zinc-600 leading-relaxed">
                As cited in the 2024 graduate thesis studies, 64% of writing stalls originate from unclear guidance or mismatched expectations. Schedule a short 15-minute milestone check-in with your supervisor after completing each phase.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Academic Writing Sprint (Pomodoro Timer) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-zinc-900">Academic Focus Sprint</h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Daily Writing Hours
              </span>
            </div>

            {/* Sprint selection */}
            <div className="grid grid-cols-3 gap-1.5 mt-4">
              <button
                onClick={() => setSprint(25, "drafting")}
                className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                  sprintType === "drafting"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Draft (25m)
              </button>
              <button
                onClick={() => setSprint(45, "reading")}
                className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                  sprintType === "reading"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Read (45m)
              </button>
              <button
                onClick={() => setSprint(15, "revising")}
                className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                  sprintType === "revising"
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                Polish (15m)
              </button>
            </div>

            {/* Timer display */}
            <div className="text-center my-6">
              <div className="text-5xl font-mono font-bold tracking-tight text-zinc-900">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium capitalize">
                Focus Mode: {sprintType} (No distractions)
              </p>
            </div>

            {/* Timer controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-colors shadow-xs ${
                  timerRunning
                    ? "bg-[#3367D6] hover:bg-[#1A73E8]"
                    : "bg-[#4285F4] hover:bg-[#3367D6]"
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Start Sprint
                  </>
                )}
              </button>
              <button
                onClick={() => setSprint(25, sprintType)}
                className="p-2 text-zinc-500 hover:text-zinc-700 border border-[#E8EAED] rounded-lg hover:bg-zinc-50"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center mt-4 italic">
              "Treat research as regular work with dedicated daily writing hours rather than binge sessions." (ECHER Initiative)
            </p>
          </div>

          {/* Research Motivation & Resilience card */}
          <div className="bg-white text-[#202124] rounded-xl p-5 border border-[#E8EAED] shadow-2xs">
            <div className="flex items-center gap-2 text-[#4285F4] text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#4285F4]" />
              Researcher Mental Fortitude
            </div>
            <h4 className="text-sm font-semibold text-[#202124] mt-2">
              Overcoming Writer's Block &amp; Impostor Doubts
            </h4>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              Every veteran scholar gets rejected. Academic prose is an iterative craft, not innate genius. When stuck, write the Method section first—it is the easiest to report and builds draft momentum.
            </p>
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="font-bold text-base text-zinc-900">Add Project Milestone</h3>
            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Milestone Description</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Conduct pilot interview series"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Target Week</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={newWeek}
                    onChange={(e) => setNewWeek(parseInt(e.target.value) || 1)}
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Phase</label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as any)}
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  >
                    {PHASES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTitle.trim()) {
                    onAddMilestone({
                      title: newTitle.trim(),
                      deadlineWeek: newWeek,
                      phase: newPhase,
                      completed: false,
                      notes: "Custom milestone added by researcher."
                    });
                    setNewTitle("");
                    setShowAddModal(false);
                  }
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
