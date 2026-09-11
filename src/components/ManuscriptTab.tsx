import React, { useState } from "react";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Clock,
  PenLine,
  Eye,
  Target,
  ChevronDown,
  Zap,
  Sliders,
  Check
} from "lucide-react";
import { ResearchProject, IMRaDSectionData } from "../types";

interface ManuscriptTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

const SECTIONS: Array<IMRaDSectionData["title"]> = [
  "Abstract",
  "Introduction",
  "Methods",
  "Results",
  "Discussion"
];

const DEFAULT_TARGETS: Record<IMRaDSectionData["title"], number> = {
  Abstract: 250,
  Introduction: 950,
  Methods: 850,
  Results: 750,
  Discussion: 900
};

const STATUS_CONFIG: Record<IMRaDSectionData["status"], {
  label: string;
  badgeClass: string;
  dotClass: string;
  barColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = {
  not_started: {
    label: "Not Started",
    badgeClass: "bg-[#F8F9FA] text-[#5F6368] border-[#E8EAED]",
    dotClass: "bg-[#80868B]",
    barColor: "bg-[#E8EAED]",
    icon: Circle,
    description: "No draft content yet"
  },
  drafting: {
    label: "Drafting",
    badgeClass: "bg-[#E8F0FE] text-[#1967D2] border-[#D2E3FC]",
    dotClass: "bg-[#4285F4]",
    barColor: "bg-[#4285F4]",
    icon: PenLine,
    description: "In active drafting"
  },
  in_review: {
    label: "In Review",
    badgeClass: "bg-[#F1F3F4] text-[#202124] border-[#DADCE0]",
    dotClass: "bg-[#5F6368]",
    barColor: "bg-[#4285F4]",
    icon: Eye,
    description: "Under peer/advisor review"
  },
  complete: {
    label: "Complete",
    badgeClass: "bg-[#4285F4] text-white border-[#4285F4]",
    dotClass: "bg-white",
    barColor: "bg-[#4285F4]",
    icon: CheckCircle2,
    description: "Target word count met"
  }
};

const SWALES_MOVES_BY_SECTION: Record<string, Array<{
  id: string;
  title: string;
  objective: string;
  starters: string[];
  tip: string;
}>> = {
  Abstract: [
    {
      id: "MA1",
      title: "Structured Academic Abstract",
      objective: "Synthesize Background, Methods, Principal Results, and Conclusions in 200-250 words.",
      starters: [
        "Background: Research in [domain] has recently faced critical challenges regarding...",
        "Methods: Utilizing a randomized controlled trial with N=[sample], we tested...",
        "Results: Findings indicate a statistically significant [X]% improvement in...",
        "Conclusion: These results provide empirical validation for next-generation..."
      ],
      tip: "Write the Abstract last, once all other IMRaD sections are finalized."
    }
  ],
  Introduction: [
    {
      id: "M1",
      title: "Move 1: Establishing a Research Territory",
      objective: "Assert topic importance, establish real-world centrality, and summarize relevant previous scholarship.",
      starters: [
        "In recent years, considerable scholarly attention has centered upon...",
        "The capacity to effectively evaluate and optimize [phenomenon] is widely regarded as pivotal for...",
        "A growing body of empirical literature has demonstrated that..."
      ],
      tip: "Avoid high-school textbook definitions. Ground your first 2 sentences directly in recent citations."
    },
    {
      id: "M2",
      title: "Move 2: Establishing a Niche (The Academic Gap)",
      objective: "Point out a contradiction, boundary limitation, or unanswered inquiry in existing scholarship.",
      starters: [
        "However, previous investigations have predominantly focused on [...], leaving [...] largely unexplored.",
        "Despite these foundational advances, empirical evidence remains inconclusive regarding...",
        "Much of the existing scholarship suffers from two notable limitations: first, [...]; second, [...]"
      ],
      tip: "This is the linchpin of your paper. If Move 2 is weak, peer reviewers will ask 'What is new here?'"
    },
    {
      id: "M3",
      title: "Move 3: Occupying the Niche (Announcing Work)",
      objective: "State the primary aims, research questions or hypotheses, and outline manuscript organization.",
      starters: [
        "To address this critical gap, the present study investigates...",
        "Specifically, we formulate two interrelated objectives: first, [...]; second, [...]",
        "The remainder of this article is organized as follows: Section 2 outlines the methodology..."
      ],
      tip: "State your central thesis directly upfront. Do not hide your core contribution at the very end."
    }
  ],
  Methods: [
    {
      id: "MM1",
      title: "Design & Participant Selection",
      objective: "Define the experimental paradigm, sampling logic, and institutional ethics approval.",
      starters: [
        "A within-subject randomized controlled experiment was conducted with N=[sample size]...",
        "Participants were recruited via purposive stratified sampling and provided written informed consent...",
        "All experimental procedures complied strictly with ethical protocols approved by [IRB Board]..."
      ],
      tip: "Write Methods first! It is factual, avoids writer's block, and anchors the rest of the manuscript."
    },
    {
      id: "MM2",
      title: "Instrumentation & Data Collection",
      objective: "Describe materials, apparatus, measurement scales, and procedural safeguards.",
      starters: [
        "Outcome variables were recorded using standardized [Metric Scale], exhibiting high internal consistency...",
        "To mitigate order and learning effects, treatment sequences were counterbalanced using...",
        "Data collection occurred across [X] discrete phases over a [Y]-week monitoring period..."
      ],
      tip: "Provide sufficient procedural detail that an external lab could replicate your exact pipeline."
    },
    {
      id: "MM3",
      title: "Statistical Analysis & Safeguards",
      objective: "Specify software, tests (ANOVA, regression), significance levels, and outlier handling.",
      starters: [
        "Statistical analyses were performed in R (v4.3) using the [package] library...",
        "Assumptions of normality and homoscedasticity were verified prior to parametric testing...",
        "Effect sizes are reported as partial eta squared (η²p) alongside 95% confidence intervals..."
      ],
      tip: "Pre-registering analysis plans mitigates p-hacking concerns raised in peer review."
    }
  ],
  Results: [
    {
      id: "MR1",
      title: "Primary Hypothesis Testing",
      objective: "Present central findings clearly with descriptive and inferential statistics.",
      starters: [
        "Quantitative evaluation revealed a statistically significant main effect for [Variable] (F(df) = ..., p < 0.001)...",
        "In support of Hypothesis 1, participants in the experimental condition exhibited a [X]% increase in...",
        "Table 1 summarizes the descriptive statistics across experimental waves..."
      ],
      tip: "Report findings objectively in past tense without subjective interpretation (save interpretation for Discussion)."
    },
    {
      id: "MR2",
      title: "Secondary & Interaction Effects",
      objective: "Detail moderating factors, subgroup analyses, and unexpected trends.",
      starters: [
        "Further exploratory analysis revealed a significant interaction between [Factor A] and [Factor B]...",
        "Post-hoc pairwise comparisons with Bonferroni corrections confirmed that...",
        "No statistically significant divergence was observed with respect to [Demographic Variable]..."
      ],
      tip: "Reference all figures and tables explicitly in the text (e.g., 'As illustrated in Figure 2')."
    }
  ],
  Discussion: [
    {
      id: "MD1",
      title: "Synthesis of Principal Findings",
      objective: "Answer the initial research questions and place outcomes in theoretical context.",
      starters: [
        "The empirical findings of this investigation lend robust support to our central thesis...",
        "Our primary observation—that [X] directly attenuates [Y]—corroborates earlier work by [Author, Year]...",
        "Contrary to initial expectations, the data did not demonstrate significant variation in..."
      ],
      tip: "Begin by summarizing the main answer to your question, not by repeating the detailed statistics."
    },
    {
      id: "MD2",
      title: "Limitations & Epistemic Boundaries",
      objective: "Honestly evaluate threats to internal and ecological validity.",
      starters: [
        "Several methodological constraints warrant explicit acknowledgment. First, ...",
        "Caution is advised when generalizing these conclusions beyond [studied population]...",
        "A potential confound arises from the cross-sectional nature of the data gathering..."
      ],
      tip: "Reviewers respect frank limitations. Stating them yourself preempts reviewer criticism!"
    },
    {
      id: "MD3",
      title: "Theoretical & Practical Implications",
      objective: "Explain what these results mean for researchers, policymakers, or practitioners.",
      starters: [
        "From a practical perspective, these outcomes suggest actionable guidelines for...",
        "Theoretically, this model bridges the long-standing divide between [Paradigm A] and [Paradigm B]...",
        "Future research should deploy longitudinal cohorts to track temporal durability..."
      ],
      tip: "End with an inspiring closing sentence on future scientific possibilities."
    }
  ]
};

export const ManuscriptTab: React.FC<ManuscriptTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [activeSectionKey, setActiveSectionKey] = useState<IMRaDSectionData["title"]>("Introduction");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const activeSection = project.manuscript[activeSectionKey] || {
    title: activeSectionKey,
    content: "",
    targetWordCount: DEFAULT_TARGETS[activeSectionKey] || 800,
    status: "not_started"
  };

  const wordCount = activeSection.content.trim() ? activeSection.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const targetWordCount = activeSection.targetWordCount || DEFAULT_TARGETS[activeSectionKey] || 800;
  const wordPercent = Math.min(100, Math.round((wordCount / targetWordCount) * 100));

  // Determine auto-status for any content and target
  const computeAutoStatus = (
    content: string,
    target: number,
    currentStatus: IMRaDSectionData["status"]
  ): IMRaDSectionData["status"] => {
    const words = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    if (words === 0) return "not_started";
    if (words >= target) return "complete";
    if (currentStatus === "in_review") return "in_review";
    return "drafting";
  };

  const handleUpdateContent = (newContent: string) => {
    const autoStatus = computeAutoStatus(newContent, targetWordCount, activeSection.status);
    onUpdateProject({
      manuscript: {
        ...project.manuscript,
        [activeSectionKey]: {
          ...activeSection,
          content: newContent,
          status: autoStatus,
        }
      }
    });
  };

  const handleUpdateStatus = (newStatus: IMRaDSectionData["status"]) => {
    setShowStatusMenu(false);
    onUpdateProject({
      manuscript: {
        ...project.manuscript,
        [activeSectionKey]: {
          ...activeSection,
          status: newStatus,
        }
      }
    });
  };

  const handleUpdateTarget = (newTarget: number) => {
    if (newTarget <= 0) return;
    setIsEditingTarget(false);
    const autoStatus = computeAutoStatus(activeSection.content, newTarget, activeSection.status);
    onUpdateProject({
      manuscript: {
        ...project.manuscript,
        [activeSectionKey]: {
          ...activeSection,
          targetWordCount: newTarget,
          status: autoStatus,
        }
      }
    });
  };

  const handleInsertPhrase = (phrase: string) => {
    const space = activeSection.content && !activeSection.content.endsWith("\n\n") ? "\n\n" : "";
    const updated = activeSection.content + space + phrase + " ";
    handleUpdateContent(updated);
  };

  const handleRunAIScaffold = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/papr/imrad-scaffold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: activeSectionKey,
          paperTitle: project.title,
          contextNotes: activeSection.content || project.hypothesis,
        }),
      });

      if (!res.ok) throw new Error("Scaffold failed");
      const data = await res.json();

      if (data.moves && data.moves.length > 0) {
        const generatedDraft = data.moves
          .map((m: any) => `### ${m.moveTitle}\n${m.sampleDraftParagraph}`)
          .join("\n\n");
        
        handleUpdateContent((activeSection.content ? activeSection.content + "\n\n" : "") + generatedDraft);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to scaffold section. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  const moves = SWALES_MOVES_BY_SECTION[activeSectionKey] || [];

  // Helper to compute statistics and auto-status for all sections
  const sectionStats = SECTIONS.map((sec) => {
    const secData = project.manuscript[sec] || {
      title: sec,
      content: "",
      targetWordCount: DEFAULT_TARGETS[sec] || 800,
      status: "not_started"
    };
    const words = secData.content.trim() ? secData.content.trim().split(/\s+/).filter(Boolean).length : 0;
    const target = secData.targetWordCount || DEFAULT_TARGETS[sec] || 800;
    const percent = Math.min(100, Math.round((words / target) * 100));

    // Determine current visual status
    let status = secData.status;
    if (words === 0) {
      status = "not_started";
    } else if (words >= target && status !== "in_review") {
      status = "complete";
    } else if (status === "not_started") {
      status = "drafting";
    }

    return {
      title: sec,
      data: secData,
      words,
      target,
      percent,
      status,
      config: STATUS_CONFIG[status]
    };
  });

  // Overall manuscript metrics
  const totalWords = sectionStats.reduce((acc, s) => acc + s.words, 0);
  const totalTarget = sectionStats.reduce((acc, s) => acc + s.target, 0);
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalWords / totalTarget) * 100)) : 0;
  const completedSectionsCount = sectionStats.filter((s) => s.status === "complete" || s.percent >= 100).length;

  const currentStatusConfig = STATUS_CONFIG[activeSection.status] || STATUS_CONFIG.drafting;
  const CurrentStatusIcon = currentStatusConfig.icon;

  return (
    <div className="space-y-8">
      {/* Top Banner & Overall Progress */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                IMRaD Manuscript Studio
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Swales' CARS Scaffolding
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Structured Academic Manuscript Builder
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Empirical studies show novice and non-native writers struggle with disorganized paragraph flow and omitting vital sections. Track section-by-section completion and structure prose using proven rhetorical moves.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunAIScaffold}
              disabled={loadingAI}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingAI ? "animate-spin" : ""}`} />
              <span>{loadingAI ? "Generating Scaffold..." : `AI ${activeSectionKey} Scaffold`}</span>
            </button>
          </div>
        </div>

        {/* Overall Manuscript Word Count & Status Bar */}
        <div className="bg-zinc-50/80 rounded-xl p-4 border border-zinc-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900">Overall Manuscript Progress:</span>
              <span className="font-mono text-zinc-700 font-bold">{totalWords.toLocaleString()}</span>
              <span className="text-zinc-500 font-mono">/ {totalTarget.toLocaleString()} words</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                {overallPercent}% Complete
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <CheckCircle2 className="w-4 h-4 text-[#4285F4]" />
              <span>
                <strong className="text-zinc-900">{completedSectionsCount}</strong> of <strong>{SECTIONS.length}</strong> sections completed
              </span>
            </div>
          </div>

          {/* Unified Overall Progress Bar */}
          <div className="w-full bg-[#E8EAED] rounded-full h-2.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 bg-[#4285F4]"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* Section Cards Grid: Individual Progress Bar & Status Indicator for each section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Manuscript Sections &amp; Real-Time Status
            </span>
            <span className="text-[11px] text-zinc-400">
              Click any section to switch drafting view • Updates automatically as you type
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {sectionStats.map((sec) => {
              const isSelected = activeSectionKey === sec.title;
              const StatusIcon = sec.config.icon;

              return (
                <button
                  key={sec.title}
                  onClick={() => setActiveSectionKey(sec.title)}
                  className={`relative p-3.5 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-white border-[#4285F4] ring-2 ring-[#4285F4]/20 shadow-xs"
                      : "bg-white hover:bg-zinc-50 border-[#E8EAED]"
                  }`}
                >
                  {/* Top: Title & Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-xs font-bold ${isSelected ? "text-[#4285F4]" : "text-zinc-900"}`}>
                        {sec.title}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sec.config.badgeClass}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        <span>{sec.config.label}</span>
                      </span>
                    </div>

                    {/* Word Count Indicator */}
                    <div className="flex items-baseline justify-between text-[11px] text-zinc-500">
                      <span className="font-mono text-zinc-800 font-semibold">{sec.words}</span>
                      <span className="font-mono text-zinc-400">/ {sec.target} w</span>
                    </div>
                  </div>

                  {/* Individual Section Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-[#E8EAED] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          sec.words > 0 ? "bg-[#4285F4]" : "bg-transparent"
                        }`}
                        style={{ width: `${sec.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{sec.percent}% reached</span>
                      {sec.percent >= 100 ? (
                        <span className="text-[#4285F4] font-medium font-sans">Done</span>
                      ) : (
                        <span>{Math.max(0, sec.target - sec.words)} left</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Editor + Swales Moves Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Section Draft Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
            {/* Editor Top Bar with Status & Progress */}
            <div className="pb-4 border-b border-zinc-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                      <span>{activeSectionKey}</span>
                      <span className="text-xs font-normal text-zinc-400">Manuscript Draft</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <span>Status:</span>
                      
                      {/* Interactive Status Selector Dropdown */}
                      <div className="relative inline-block">
                        <button
                          onClick={() => setShowStatusMenu(!showStatusMenu)}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${currentStatusConfig.badgeClass}`}
                          title="Click to manually adjust section status"
                        >
                          <CurrentStatusIcon className="w-3 h-3" />
                          <span>{currentStatusConfig.label}</span>
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>

                        {showStatusMenu && (
                          <div className="absolute left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-20 text-xs">
                            <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100">
                              Section Status
                            </div>
                            {(["not_started", "drafting", "in_review", "complete"] as const).map((st) => {
                              const cfg = STATUS_CONFIG[st];
                              const Icon = cfg.icon;
                              const isCur = activeSection.status === st;
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(st)}
                                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer ${
                                    isCur ? "font-bold text-indigo-600 bg-indigo-50/50" : "text-zinc-700"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{cfg.label}</span>
                                  </div>
                                  {isCur && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                            <div className="px-3 py-1 mt-1 text-[10px] text-zinc-400 border-t border-zinc-100">
                              ⚡ Updates automatically as you type
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target & Word Count Controls */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-mono text-sm font-bold text-zinc-900">{wordCount}</span>
                      <span className="text-xs text-zinc-400 font-mono">/</span>
                      
                      {isEditingTarget ? (
                        <input
                          type="number"
                          autoFocus
                          defaultValue={targetWordCount}
                          onBlur={(e) => handleUpdateTarget(Number(e.target.value) || targetWordCount)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateTarget(Number((e.target as HTMLInputElement).value) || targetWordCount);
                            }
                          }}
                          className="w-16 px-1.5 py-0.5 text-xs font-mono font-bold bg-white border border-indigo-400 rounded focus:outline-hidden"
                        />
                      ) : (
                        <button
                          onClick={() => setIsEditingTarget(true)}
                          className="text-xs text-zinc-600 font-mono hover:text-indigo-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                          title="Click to edit target word count"
                        >
                          <span>{targetWordCount} words</span>
                          <Sliders className="w-2.5 h-2.5 text-zinc-400" />
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-indigo-700">
                      {wordPercent}% of target reached
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Section Dedicated Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-[#E8EAED] rounded-full h-2.5 overflow-hidden relative">
                  {/* Visual Milestone markers */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
                    <div className="border-r border-white/60 h-full w-1/4" />
                    <div className="border-r border-white/60 h-full w-1/4" />
                    <div className="border-r border-white/60 h-full w-1/4" />
                  </div>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      wordCount > 0 ? "bg-[#4285F4]" : "bg-transparent"
                    }`}
                    style={{ width: `${wordPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  {wordCount === 0 ? (
                    <span className="text-zinc-400">⚡ Section not started yet. Type or click a sentence starter to begin.</span>
                  ) : wordPercent >= 100 ? (
                    <span className="text-[#4285F4] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4]" />
                      Target word count achieved! Ready for review and polishing.
                    </span>
                  ) : (
                    <span>
                      ✍️ <strong>{Math.max(0, targetWordCount - wordCount)} words</strong> remaining to reach section target.
                    </span>
                  )}
                  <span className="font-mono text-zinc-400">{wordCount} words</span>
                </div>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={18}
              value={activeSection.content}
              onChange={(e) => handleUpdateContent(e.target.value)}
              placeholder={`Draft your ${activeSectionKey} section here...\n\nTip: Use the Swales rhetorical move buttons on the right to insert established academic sentence starters and structure your prose coherently.`}
              className="w-full font-serif text-sm leading-relaxed text-zinc-900 bg-zinc-50/50 border border-zinc-200 rounded-lg p-4 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-y"
            />

            {/* Advice Callout for novice writers from PDF */}
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-start gap-2.5 text-xs text-zinc-600">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-zinc-800">Writing Order Strategy: </span>
                <span>
                  According to thesis studies, writing <strong>Methods</strong> and <strong>Results</strong> before Introduction and Discussion drastically lowers writer's block.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Swales CARS Moves & Sentence Starters */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                Swales' CARS Rhetorical Moves
              </h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Standardized rhetorical moves expected by journal reviewers in this section. Click any sentence starter to append it to your draft:
            </p>

            <div className="space-y-4">
              {moves.map((move) => (
                <div
                  key={move.id}
                  className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs text-zinc-900">
                      {move.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                      {move.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-600 leading-snug">
                    {move.objective}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Sentence Starters:
                    </span>
                    {move.starters.map((starter, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleInsertPhrase(starter)}
                        className="w-full text-left text-[11px] text-zinc-700 bg-white hover:bg-indigo-50/70 hover:text-indigo-900 border border-zinc-200 hover:border-indigo-200 rounded p-2 transition-colors cursor-pointer group"
                      >
                        <span className="font-serif italic">"{starter}"</span>
                        <span className="text-[10px] text-indigo-600 font-sans font-semibold block mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          + Insert into Draft
                        </span>
                      </button>
                    ))}
                  </div>

                  {move.tip && (
                    <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-100 italic">
                      💡 {move.tip}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
