import React, { useState } from "react";
import { 
  Sparkles, 
  MessageSquare, 
  Plus, 
  Check, 
  Copy, 
  FileCheck, 
  PartyPopper, 
  ShieldCheck, 
  HelpCircle,
  FileCode,
  AlertCircle,
  Trash2
} from "lucide-react";
import { ResearchProject, RebuttalItem } from "../types";

interface RebuttalTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

export const RebuttalTab: React.FC<RebuttalTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New rebuttal form state
  const [reviewerNum, setReviewerNum] = useState<1 | 2 | 3>(1);
  const [newComment, setNewComment] = useState("");
  const [newStance, setNewStance] = useState<RebuttalItem["stance"]>("agree_and_modify");
  const [newNotes, setNewNotes] = useState("");
  const [newLocation, setNewLocation] = useState("Section 2.2, Paragraph 3");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAIRebuttal = async (item: RebuttalItem) => {
    setLoadingAI(item.id);
    try {
      const res = await fetch("/api/papr/rebuttal-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerComment: item.comment,
          stance: item.stance,
          authorNotes: item.authorNotes,
          sectionRef: item.targetLocation || "Methods / Discussion",
        }),
      });

      if (!res.ok) throw new Error("Rebuttal build failed");
      const data = await res.json();

      const updated = project.rebuttals.map((r) => {
        if (r.id !== item.id) return r;
        return {
          ...r,
          responseDraft: data.authorResponse || r.responseDraft,
          manuscriptModification: data.manuscriptModification || r.manuscriptModification,
          targetLocation: data.suggestedLocation || r.targetLocation,
          status: "drafted" as const,
        };
      });

      onUpdateProject({ rebuttals: updated });
    } catch (err) {
      console.error(err);
      alert("Failed to build rebuttal. Please try again.");
    } finally {
      setLoadingAI(null);
    }
  };

  const handleAddRebuttal = () => {
    if (!newComment.trim()) return;
    const newItem: RebuttalItem = {
      id: `reb_${Date.now()}`,
      reviewerNum,
      comment: newComment.trim(),
      stance: newStance,
      authorNotes: newNotes.trim() || "Address feedback directly.",
      responseDraft: `We sincerely thank Reviewer ${reviewerNum} for this perceptive comment. We have updated the manuscript accordingly.`,
      manuscriptModification: `"[Revised text inserted into manuscript based on reviewer feedback]"`,
      targetLocation: newLocation.trim() || "Methods / Results",
      status: "pending",
    };

    onUpdateProject({ rebuttals: [...project.rebuttals, newItem] });
    setNewComment("");
    setNewNotes("");
    setShowAddModal(false);
  };

  const handleDeleteRebuttal = (id: string) => {
    onUpdateProject({ rebuttals: project.rebuttals.filter((r) => r.id !== id) });
  };

  const handleUpdateRebuttalField = (id: string, field: keyof RebuttalItem, val: any) => {
    const updated = project.rebuttals.map((r) => {
      if (r.id !== id) return r;
      return { ...r, [field]: val };
    });
    onUpdateProject({ rebuttals: updated });
  };

  const generateFullRebuttalLetter = () => {
    const header = `Dear Editor and Reviewers,\n\nWe would like to express our sincere gratitude to the editor and reviewers for their constructive, thorough, and insightful evaluation of our manuscript titled "${project.title}". The comments have significantly enriched the clarity and empirical rigor of the paper.\n\nBelow, we provide a point-by-point response detailing the specific revisions incorporated into the revised manuscript.\n\n=======================================================\n`;
    
    const body = project.rebuttals.map((r, i) => {
      return `POINT ${i + 1} (Reviewer #${r.reviewerNum}):\n"${r.comment}"\n\nAUTHOR RESPONSE:\n${r.responseDraft}\n\nMANUSCRIPT REVISION (${r.targetLocation}):\n${r.manuscriptModification}\n\n-------------------------------------------------------\n`;
    }).join("\n");

    return header + body + `\nWe hope these comprehensive revisions satisfy the reviewers' requirements and look forward to your decision.\n\nSincerely,\nThe Authors`;
  };

  const handleCopyFullLetter = () => {
    navigator.clipboard.writeText(generateFullRebuttalLetter());
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Peer Review &amp; Revision Matrix
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {project.rebuttals.length} Tracked Reviewer Points
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Constructive Rebuttal &amp; Revision Strategy
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Directly resolves the anxiety, harsh feedback distress, and lack of revision guidance documented in graduate and early-career surveys: point-by-point diplomatic response generation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reviewer Critique</span>
            </button>
            <button
              onClick={handleCopyFullLetter}
              disabled={project.rebuttals.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 rounded-lg transition-colors shadow-2xs"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              <span>{copiedAll ? "Letter Copied!" : "Export Rebuttal Letter"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* "Celebrate Revise and Resubmit" Banner from PDF Quote */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 shadow-2xs flex items-start gap-3.5">
        <PartyPopper className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-emerald-950">
            Academic Resilience Note: "When you get Revise-and-Resubmit, Celebrate!"
          </div>
          <p className="text-emerald-900 leading-relaxed">
            As veteran researchers advise in the PDF review (ECHER initiative): Rejection is routine, but a Revise-and-Resubmit means the editor wants to publish your paper. Take 48 hours to digest the critique calmly, then address every point with gratitude, clarity, and explicit manuscript line references.
          </p>
        </div>
      </div>

      {/* Point-by-Point Matrix Cards */}
      <div className="space-y-4">
        {project.rebuttals.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500 space-y-2 shadow-2xs">
            <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-medium text-zinc-700">No reviewer comments logged yet</p>
            <p className="text-xs max-w-sm mx-auto text-zinc-500">
              When your reviews arrive, enter the comments here to construct diplomatic point-by-point responses and track manuscript changes.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
            >
              Add Reviewer Comment
            </button>
          </div>
        ) : (
          project.rebuttals.map((reb, idx) => (
            <div
              key={reb.id}
              className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4"
            >
              {/* Top Row: Reviewer Tag, Stance Selector & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">
                    R{reb.reviewerNum}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-zinc-900">
                      Point {idx + 1} (Reviewer #{reb.reviewerNum})
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono ml-2">
                      Target: {reb.targetLocation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={reb.stance}
                    onChange={(e) => handleUpdateRebuttalField(reb.id, "stance", e.target.value)}
                    className="text-xs border border-zinc-300 rounded-md px-2.5 py-1 bg-zinc-50 text-zinc-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="agree_and_modify">Concur &amp; Modify Manuscript</option>
                    <option value="clarify_without_change">Clarify Without Modifying</option>
                    <option value="respectfully_rebut">Respectfully Disagree with Evidence</option>
                  </select>

                  <button
                    onClick={() => handleRunAIRebuttal(reb)}
                    disabled={loadingAI === reb.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
                  >
                    <Sparkles className={`w-3 h-3 ${loadingAI === reb.id ? "animate-spin" : ""}`} />
                    <span>{loadingAI === reb.id ? "Drafting..." : "AI Diplomatic Draft"}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteRebuttal(reb.id)}
                    className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                    title="Remove point"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Reviewer Comment Box */}
              <div className="p-3 bg-zinc-50/80 border border-zinc-200 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-zinc-700 block">Reviewer Critique:</span>
                <p className="text-zinc-900 font-serif italic leading-relaxed">"{reb.comment}"</p>
              </div>

              {/* Two Column: Author Response Draft & Manuscript Modification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Response to Reviewer */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-800 block">
                    Author Response (Polite, scholarly explanation)
                  </label>
                  <textarea
                    rows={4}
                    value={reb.responseDraft}
                    onChange={(e) => handleUpdateRebuttalField(reb.id, "responseDraft", e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-md p-2.5 text-zinc-900 font-sans leading-relaxed focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Manuscript Excerpt Modification */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-zinc-800 block">
                      Manuscript Revision Excerpt &amp; Location
                    </label>
                    <input
                      type="text"
                      value={reb.targetLocation}
                      onChange={(e) => handleUpdateRebuttalField(reb.id, "targetLocation", e.target.value)}
                      placeholder="e.g. Methods 2.2"
                      className="border border-zinc-200 rounded px-1.5 py-0.5 text-[10px] text-zinc-600 max-w-[140px]"
                    />
                  </div>
                  <textarea
                    rows={4}
                    value={reb.manuscriptModification}
                    onChange={(e) => handleUpdateRebuttalField(reb.id, "manuscriptModification", e.target.value)}
                    className="w-full bg-indigo-50/40 border border-indigo-200 rounded-md p-2.5 text-indigo-950 font-serif leading-relaxed focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Critique Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="font-bold text-base text-zinc-900">Add Reviewer Critique</h3>
            <div className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Reviewer Number</label>
                  <select
                    value={reviewerNum}
                    onChange={(e) => setReviewerNum(parseInt(e.target.value) as any)}
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  >
                    <option value={1}>Reviewer #1</option>
                    <option value={2}>Reviewer #2</option>
                    <option value={3}>Reviewer #3</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Target Section</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Section 3.1, Line 140"
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Reviewer Comment</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Paste the critique verbatim from the decision letter..."
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Author's Stance</label>
                <select
                  value={newStance}
                  onChange={(e) => setNewStance(e.target.value as any)}
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                >
                  <option value="agree_and_modify">Concur &amp; Modify Manuscript</option>
                  <option value="clarify_without_change">Clarify Without Modifying</option>
                  <option value="respectfully_rebut">Respectfully Disagree with Evidence</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Internal Notes / Evidence</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Brief note on what data or explanation resolves this..."
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
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
                onClick={handleAddRebuttal}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Add to Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
