import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Table as TableIcon,
  Tag,
  Trash2
} from "lucide-react";
import { ResearchProject, LiteraturePaper, SynthesisTheme } from "../types";

interface LitMatrixTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

export const LitMatrixTab: React.FC<LitMatrixTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [citationFormat, setCitationFormat] = useState<"apa" | "ieee" | "bibtex">("apa");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New paper modal form state
  const [newTitle, setNewTitle] = useState("");
  const [newAuthors, setNewAuthors] = useState("");
  const [newYear, setNewYear] = useState(2024);
  const [newJournal, setNewJournal] = useState("");
  const [newMethodology, setNewMethodology] = useState("");
  const [newKeyFindings, setNewKeyFindings] = useState("");
  const [newLimitations, setNewLimitations] = useState("");
  const [newRelevance, setNewRelevance] = useState("");
  const [newTags, setNewTags] = useState("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAISynthesis = async () => {
    setLoadingSynthesis(true);
    try {
      const res = await fetch("/api/papr/lit-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researchTopic: project.title,
          papers: project.papers.map((p) => ({
            title: p.title,
            authors: p.authors,
            findings: p.keyFindings,
            limitations: p.limitations,
            methodology: p.methodology,
          })),
        }),
      });

      if (!res.ok) throw new Error("Synthesis failed");
      const data = await res.json();

      if (data.themes) {
        const mappedThemes: SynthesisTheme[] = data.themes.map((th: any, idx: number) => ({
          id: `theme_${idx}_${Date.now()}`,
          title: th.themeTitle,
          consensus: th.keyConsensus,
          divergence: th.contestedArea,
          criticalGap: th.gapIdentified,
          citingPapers: project.papers.slice(0, 2).map((p) => p.id),
        }));

        onUpdateProject({ themes: mappedThemes });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to synthesize literature. Please try again.");
    } finally {
      setLoadingSynthesis(false);
    }
  };

  const handleAddPaper = () => {
    if (!newTitle.trim() || !newAuthors.trim()) return;

    const paper: LiteraturePaper = {
      id: `paper_${Date.now()}`,
      title: newTitle.trim(),
      authors: newAuthors.trim(),
      year: newYear,
      journal: newJournal.trim() || "Peer-Reviewed Journal",
      methodology: newMethodology.trim() || "Empirical analysis",
      keyFindings: newKeyFindings.trim() || "Detailed empirical results and observations.",
      limitations: newLimitations.trim() || "Scope boundaries and potential confounds.",
      relevanceToProject: newRelevance.trim() || "Provides theoretical support for current study.",
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["Literature"],
      citationFormat: {
        apa: `${newAuthors.trim()} (${newYear}). ${newTitle.trim()}. ${newJournal.trim() || "Academic Journal"}.`,
        ieee: `${newAuthors.trim()}, "${newTitle.trim()}," ${newJournal.trim() || "Acad. J."}, ${newYear}.`,
        bibtex: `@article{ref_${Date.now()},\n  author = {${newAuthors.trim()}},\n  title = {${newTitle.trim()}},\n  year = {${newYear}},\n  journal = {${newJournal.trim() || "Journal"}}\n}`
      }
    };

    onUpdateProject({ papers: [...project.papers, paper] });
    setNewTitle("");
    setNewAuthors("");
    setNewJournal("");
    setNewMethodology("");
    setNewKeyFindings("");
    setNewLimitations("");
    setNewRelevance("");
    setNewTags("");
    setShowAddModal(false);
  };

  const handleDeletePaper = (id: string) => {
    onUpdateProject({ papers: project.papers.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Literature Review &amp; Synthesis
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {project.papers.length} Indexed Sources
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Thematic Synthesis &amp; Comparative Matrix
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Directly resolves the Graduate and Undergraduate pain point identified in the PDF: avoiding fragmented, list-like summaries by grouping literature into synthetic themes, consensus, and unaddressed gaps.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunAISynthesis}
              disabled={loadingSynthesis || project.papers.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingSynthesis ? "animate-spin" : ""}`} />
              <span>{loadingSynthesis ? "Synthesizing..." : "Synthesize Matrix with AI"}</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
              <span>Add Study</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thematic Synthesis Panels */}
      {project.themes && project.themes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Thematic Syntheses (Consensus vs. Gaps)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.themes.map((theme) => (
              <div
                key={theme.id}
                className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-zinc-900 leading-snug">
                    {theme.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                    Synthesized
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-950">
                    <span className="font-semibold block text-emerald-900 mb-0.5">Scholarly Consensus:</span>
                    <p className="leading-relaxed">{theme.consensus}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-100 text-amber-950">
                    <span className="font-semibold block text-amber-900 mb-0.5">Points of Divergence / Debate:</span>
                    <p className="leading-relaxed">{theme.divergence}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-950">
                    <span className="font-semibold block text-indigo-900 mb-0.5">Critical Research Lacuna / Gap:</span>
                    <p className="leading-relaxed font-serif italic">{theme.criticalGap}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparative Literature Matrix Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-zinc-900">Comparative Study Matrix</h3>
            <span className="text-xs text-zinc-500 font-mono">
              ({project.papers.length} Studies Analyzed)
            </span>
          </div>

          {/* Citation format selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Citation Style:</span>
            <div className="inline-flex rounded-lg border border-zinc-300 p-0.5 bg-zinc-50">
              <button
                onClick={() => setCitationFormat("apa")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  citationFormat === "apa" ? "bg-white text-indigo-700 shadow-2xs" : "text-zinc-600"
                }`}
              >
                APA 7th
              </button>
              <button
                onClick={() => setCitationFormat("ieee")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  citationFormat === "ieee" ? "bg-white text-indigo-700 shadow-2xs" : "text-zinc-600"
                }`}
              >
                IEEE
              </button>
              <button
                onClick={() => setCitationFormat("bibtex")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  citationFormat === "bibtex" ? "bg-white text-indigo-700 shadow-2xs" : "text-zinc-600"
                }`}
              >
                BibTeX
              </button>
            </div>
          </div>
        </div>

        {project.papers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <BookOpen className="w-8 h-8 text-zinc-300 mx-auto" />
            <p className="text-sm font-medium text-zinc-700">No literature sources indexed yet</p>
            <p className="text-xs max-w-sm mx-auto text-zinc-500">
              Add studies to build your literature review table and generate thematic synthesis.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
            >
              Add First Paper
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-4 w-1/4">Study &amp; Author</th>
                  <th className="p-4 w-1/5">Methodology &amp; Design</th>
                  <th className="p-4 w-1/4">Key Findings &amp; Evidence</th>
                  <th className="p-4 w-1/5">Limitations &amp; Gaps</th>
                  <th className="p-4 w-1/12 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {project.papers.map((paper) => {
                  const citationText = paper.citationFormat 
                    ? paper.citationFormat[citationFormat]
                    : `${paper.authors} (${paper.year}). ${paper.title}. ${paper.journal}.`;

                  return (
                    <tr key={paper.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-semibold text-zinc-900 text-xs">{paper.title}</div>
                        <div className="text-zinc-600 font-medium text-[11px] mt-0.5">
                          {paper.authors} ({paper.year})
                        </div>
                        <div className="text-zinc-500 italic text-[11px] mt-0.5">{paper.journal}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {paper.tags.map((t, idx) => (
                            <span key={idx} className="bg-zinc-100 text-zinc-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-top text-zinc-700 leading-relaxed">
                        <span className="font-mono text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">
                          {paper.methodology}
                        </span>
                      </td>
                      <td className="p-4 align-top text-zinc-700 leading-relaxed">
                        <p>{paper.keyFindings}</p>
                        {paper.relevanceToProject && (
                          <div className="mt-2 text-indigo-700 bg-indigo-50/60 p-2 rounded text-[11px] border border-indigo-100">
                            <span className="font-semibold">Project Role: </span>
                            {paper.relevanceToProject}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top text-zinc-600 leading-relaxed">
                        <p className="text-rose-900 bg-rose-50/60 p-2 rounded text-[11px] border border-rose-100">
                          {paper.limitations}
                        </p>
                      </td>
                      <td className="p-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(citationText, paper.id)}
                            className="p-1.5 text-zinc-400 hover:text-indigo-600 rounded hover:bg-zinc-100 transition-colors"
                            title={`Copy ${citationFormat.toUpperCase()} citation`}
                          >
                            {copiedId === paper.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeletePaper(paper.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 transition-colors"
                            title="Remove paper"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Study Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-zinc-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-zinc-900">Index Scholarly Paper</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Extract core findings and limitations for the synthesis matrix.</p>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Paper Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cognitive Architecture and Collaborative Reasoning"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Authors</label>
                  <input
                    type="text"
                    value={newAuthors}
                    onChange={(e) => setNewAuthors(e.target.value)}
                    placeholder="e.g. Chen, H., & Rodriguez, M."
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(parseInt(e.target.value) || 2024)}
                    className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Journal / Conference</label>
                <input
                  type="text"
                  value={newJournal}
                  onChange={(e) => setNewJournal(e.target.value)}
                  placeholder="e.g. ACM Transactions on Computer-Human Interaction"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Methodology / Design</label>
                <input
                  type="text"
                  value={newMethodology}
                  onChange={(e) => setNewMethodology(e.target.value)}
                  placeholder="e.g. Randomized controlled trial (N=60)"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Key Empirical Findings</label>
                <textarea
                  rows={2}
                  value={newKeyFindings}
                  onChange={(e) => setNewKeyFindings(e.target.value)}
                  placeholder="Summary of core findings..."
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Reported Limitations or Scope Boundaries</label>
                <textarea
                  rows={2}
                  value={newLimitations}
                  onChange={(e) => setNewLimitations(e.target.value)}
                  placeholder="Limitations noted by authors or methodological bounds..."
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Relevance to Your Manuscript</label>
                <input
                  type="text"
                  value={newRelevance}
                  onChange={(e) => setNewRelevance(e.target.value)}
                  placeholder="How this paper justifies your study or provides a baseline..."
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Cognitive Load, HCI, Quantitative"
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
                onClick={handleAddPaper}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Add Study to Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
