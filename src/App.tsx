import React, { useState, useEffect } from "react";
import { 
  GitBranch, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Languages, 
  Users, 
  MessageSquare, 
  Clock, 
  Compass, 
  Layers,
  CheckCircle,
  Plus
} from "lucide-react";
import { ResearchProject, ResearcherPersona, IMRaDSectionData } from "./types";
import { SAMPLE_PROJECTS, PERSONA_DEFINITIONS } from "./data/initialData";
import { Header } from "./components/Header";
import { PipelineTab } from "./components/PipelineTab";
import { TopicFramingTab } from "./components/TopicFramingTab";
import { LitMatrixTab } from "./components/LitMatrixTab";
import { ManuscriptTab } from "./components/ManuscriptTab";
import { StyleNNESStudioTab } from "./components/StyleNNESStudioTab";
import { AuthorshipTab } from "./components/AuthorshipTab";
import { RebuttalTab } from "./components/RebuttalTab";
import { ExportModal } from "./components/ExportModal";

type ActiveTab = 
  | "pipeline" 
  | "topic" 
  | "lit_matrix" 
  | "manuscript" 
  | "style_nnes" 
  | "authorship" 
  | "rebuttal";

export default function App() {
  const [projects, setProjects] = useState<ResearchProject[]>(() => {
    const saved = localStorage.getItem("papr_projects");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_PROJECTS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(
    () => projects[0]?.id || "proj_multimodal_llm"
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>("pipeline");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewPaperModal, setShowNewPaperModal] = useState(false);

  // New paper modal form state
  const [newPaperTitle, setNewPaperTitle] = useState("");
  const [newPaperDiscipline, setNewPaperDiscipline] = useState("");
  const [newPaperPersona, setNewPaperPersona] = useState<ResearcherPersona>("graduate");

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  useEffect(() => {
    localStorage.setItem("papr_projects", JSON.stringify(projects));
  }, [projects]);

  const handleUpdateProject = (updated: Partial<ResearchProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProject.id ? { ...p, ...updated } : p))
    );
  };

  const handleSelectPersona = (persona: ResearcherPersona) => {
    handleUpdateProject({ persona });
  };

  const handleUpdateMilestone = (milestoneId: string, completed: boolean) => {
    const updatedMilestones = currentProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed } : m
    );
    handleUpdateProject({ milestones: updatedMilestones });
  };

  const handleAddMilestone = (newM: any) => {
    const fullM = { ...newM, id: `m_${Date.now()}` };
    handleUpdateProject({ milestones: [...currentProject.milestones, fullM] });
  };

  const handleCreateNewPaper = () => {
    if (!newPaperTitle.trim()) return;

    const newProject: ResearchProject = {
      id: `proj_${Date.now()}`,
      title: newPaperTitle.trim(),
      workingSubtitle: "",
      discipline: newPaperDiscipline.trim() || "General Scientific Inquiry",
      persona: newPaperPersona,
      lastModified: "Just now",
      pico: {
        population: "Target cohort or subjects under evaluation",
        intervention: newPaperTitle.trim(),
        comparison: "Standard baseline procedures or control condition",
        outcome: "Primary quantitative or qualitative performance indicators"
      },
      researchQuestions: [
        `How does ${newPaperTitle.trim()} affect primary outcome metrics?`,
        `What methodological factors moderate the observed relationship?`,
        `What are the practical boundary conditions for reproducibility?`
      ],
      hypothesis: `It is hypothesized that systematic implementation of ${newPaperTitle.trim()} yields measurable improvements over conventional methods.`,
      feasibilityScore: "Moderate",
      feasibilityNotes: "Preliminary project scope. Confirm data access and ethical approvals early.",
      keywords: [newPaperTitle.trim(), "Methodology", "Literature Review", "Empirical Evaluation"],
      papers: [],
      themes: [],
      manuscript: {
        Abstract: {
          title: "Abstract",
          content: "",
          targetWordCount: 250,
          status: "not_started"
        },
        Introduction: {
          title: "Introduction",
          content: "",
          targetWordCount: 900,
          status: "not_started"
        },
        Methods: {
          title: "Methods",
          content: "",
          targetWordCount: 850,
          status: "not_started"
        },
        Results: {
          title: "Results",
          content: "",
          targetWordCount: 750,
          status: "not_started"
        },
        Discussion: {
          title: "Discussion",
          content: "",
          targetWordCount: 950,
          status: "not_started"
        }
      },
      contributors: [
        {
          id: `c_${Date.now()}`,
          name: "Lead Researcher",
          email: "researcher@institution.edu",
          affiliation: "University Department",
          roles: ["Conceptualization", "Methodology", "Writing - Original Draft"],
          isCorrespondingAuthor: true,
          order: 1
        }
      ],
      rebuttals: [],
      milestones: [
        { id: "nm1", phase: "topic", title: "Finalize Topic & PICO Hypotheses", deadlineWeek: 2, completed: false, notes: "Define bounded variables." },
        { id: "nm2", phase: "lit_review", title: "Build Literature Synthesis Matrix", deadlineWeek: 6, completed: false, notes: "Search academic databases." },
        { id: "nm3", phase: "methodology", title: "Design Methodology & Protocol", deadlineWeek: 10, completed: false, notes: "Draft protocol and sample size." },
        { id: "nm4", phase: "writing", title: "Draft IMRaD Sections with Swales Moves", deadlineWeek: 18, completed: false, notes: "Draft Methods first, then Results." },
        { id: "nm5", phase: "submission", title: "Submit Manuscript to Target Journal", deadlineWeek: 22, completed: false, notes: "Include CRediT statement." }
      ],
      notes: "Project initiated."
    };

    setProjects([newProject, ...projects]);
    setCurrentProjectId(newProject.id);
    setNewPaperTitle("");
    setNewPaperDiscipline("");
    setShowNewPaperModal(false);
    setActiveTab("topic");
  };

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "pipeline", label: "Pipeline & Timeline", icon: Clock },
    { id: "topic", label: "Topic & Gap Framing", icon: Compass },
    { id: "lit_matrix", label: "Literature Matrix", icon: Layers },
    { id: "manuscript", label: "IMRaD Studio", icon: FileText },
    { id: "style_nnes", label: "Style & NNES", icon: Languages },
    { id: "authorship", label: "CRediT Authorship", icon: Users },
    { id: "rebuttal", label: "Peer Rebuttal", icon: MessageSquare },
  ];

  // Calculate live manuscript progress
  const manuscriptSections: IMRaDSectionData[] = currentProject.manuscript
    ? (Object.values(currentProject.manuscript) as IMRaDSectionData[])
    : [];
  const manuscriptTotalWords = manuscriptSections.reduce((acc: number, s: IMRaDSectionData) => {
    const words = s.content ? s.content.trim().split(/\s+/).filter(Boolean).length : 0;
    return acc + words;
  }, 0);
  const manuscriptTargetWords = manuscriptSections.reduce((acc: number, s: IMRaDSectionData) => acc + (s.targetWordCount || 800), 0);
  const manuscriptPercent = manuscriptTargetWords > 0 
    ? Math.min(100, Math.round((manuscriptTotalWords / manuscriptTargetWords) * 100)) 
    : 0;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans selection:bg-[#E8F0FE] selection:text-[#1967D2]">
      {/* Top Header with Brand & Persona */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={setCurrentProjectId}
        onSelectPersona={handleSelectPersona}
        onOpenExport={() => setShowExportModal(true)}
        onOpenNewProject={() => setShowNewPaperModal(true)}
      />

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E8EAED] p-1.5 shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#4285F4] text-white shadow-xs"
                      : "text-[#5F6368] hover:text-[#202124] hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#5F6368]"}`} />
                  <span>{tab.label}</span>
                  {tab.id === "manuscript" && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? "bg-white/20 text-white" : "bg-[#E8F0FE] text-[#1967D2]"
                    }`}>
                      {manuscriptPercent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Rendering */}
        <main>
          {activeTab === "pipeline" && (
            <PipelineTab
              project={currentProject}
              onUpdateMilestone={handleUpdateMilestone}
              onAddMilestone={handleAddMilestone}
            />
          )}

          {activeTab === "topic" && (
            <TopicFramingTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "lit_matrix" && (
            <LitMatrixTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "manuscript" && (
            <ManuscriptTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "style_nnes" && (
            <StyleNNESStudioTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "authorship" && (
            <AuthorshipTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === "rebuttal" && (
            <RebuttalTab
              project={currentProject}
              onUpdateProject={handleUpdateProject}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8EAED] bg-[#FFFFFF] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#202124]">Papr</span>
            <span>&bull;</span>
            <span className="text-[#4285F4] font-medium">Research, made clear.</span>
            <span>&bull;</span>
            <span>Empirical Academic Research Suite</span>
          </div>
          <div className="text-[11px] text-[#5F6368]">
            Compliant with IMRaD, Swales CARS, COPE &amp; CRediT standards
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          project={currentProject}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Create New Paper Modal */}
      {showNewPaperModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E8EAED]">
            <h3 className="font-bold text-base text-[#202124]">Start New Research Paper</h3>
            <p className="text-xs text-[#5F6368] mt-0.5">Initialize a blank manuscript with personalized scaffolds.</p>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-[#202124] block mb-1">Paper Title / Primary Topic</label>
                <input
                  type="text"
                  value={newPaperTitle}
                  onChange={(e) => setNewPaperTitle(e.target.value)}
                  placeholder="e.g. Algorithmic Bias in Medical Triage Systems"
                  className="w-full border border-[#E8EAED] rounded-lg p-2.5 text-[#202124] focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202124] block mb-1">Academic Discipline</label>
                <input
                  type="text"
                  value={newPaperDiscipline}
                  onChange={(e) => setNewPaperDiscipline(e.target.value)}
                  placeholder="e.g. Biomedical Informatics & Ethics"
                  className="w-full border border-[#E8EAED] rounded-lg p-2.5 text-[#202124] focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-[#202124] block mb-1">Target Researcher Profile</label>
                <select
                  value={newPaperPersona}
                  onChange={(e) => setNewPaperPersona(e.target.value as ResearcherPersona)}
                  className="w-full border border-[#E8EAED] rounded-lg p-2.5 text-[#202124] bg-white focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] focus:outline-hidden"
                >
                  {Object.values(PERSONA_DEFINITIONS).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.badge})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowNewPaperModal(false)}
                className="px-3.5 py-1.5 text-xs text-[#5F6368] hover:bg-[#F8F9FA] rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewPaper}
                disabled={!newPaperTitle.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4285F4] hover:bg-[#3367D6] disabled:opacity-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
