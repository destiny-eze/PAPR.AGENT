import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  Compass,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { ResearchProject, PICOData } from "../types";

interface TopicFramingTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

export const TopicFramingTab: React.FC<TopicFramingTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [topicInput, setTopicInput] = useState(project.title);
  const [disciplineInput, setDisciplineInput] = useState(project.discipline);
  const [pico, setPico] = useState<PICOData>(project.pico);
  const [loadingAI, setLoadingAI] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunAIFraming = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/papr/topic-framing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawTopic: topicInput,
          discipline: disciplineInput,
          researcherType: project.persona,
          targetGoal: "Peer-reviewed academic research paper"
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      if (data.picoFramework) {
        setPico(data.picoFramework);
      }

      onUpdateProject({
        title: data.refinedTitle || topicInput,
        discipline: disciplineInput,
        pico: data.picoFramework || pico,
        researchQuestions: data.researchQuestions || project.researchQuestions,
        hypothesis: data.primaryHypothesis || project.hypothesis,
        feasibilityScore: data.feasibilityAssessment?.score || project.feasibilityScore,
        feasibilityNotes: data.feasibilityAssessment?.notes || project.feasibilityNotes,
        keywords: data.searchKeywords || project.keywords
      });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze topic. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  const savePicoChanges = () => {
    onUpdateProject({ pico, title: topicInput, discipline: disciplineInput });
  };

  return (
    <div className="space-y-8">
      {/* Context banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Topic Selection &amp; Problem Framing
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                PICO Framework &amp; Gap Scaffolding
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Scientific Hypothesis &amp; Feasibility Formulator
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Overcome the #1 barrier identified in student and graduate surveys: framing a feasible topic, avoiding scope creep, and defining an unambiguous research gap before data collection begins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAIFraming}
              disabled={loadingAI}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${loadingAI ? "animate-spin" : ""}`} />
              <span>{loadingAI ? "Refining with AI..." : "AI Topic & Gap Refinement"}</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-100">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Working Research Title / Raw Inquiry
            </label>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onBlur={() => onUpdateProject({ title: topicInput })}
              placeholder="e.g. Cognitive Load in Multimodal LLM Workflows"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2 text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Academic Discipline / Domain
            </label>
            <input
              type="text"
              value={disciplineInput}
              onChange={(e) => setDisciplineInput(e.target.value)}
              onBlur={() => onUpdateProject({ discipline: disciplineInput })}
              placeholder="e.g. Computer Science / HCI"
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3.5 py-2 text-sm text-zinc-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* PICO Framework Grid */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              PICO
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900">PICO Framing Protocol (Sciences &amp; Quantitative Inquiry)</h3>
              <p className="text-xs text-zinc-500">Deconstructs open-ended queries into testable, bounded operational variables.</p>
            </div>
          </div>
          <button
            onClick={savePicoChanges}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Save PICO
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* P - Population */}
          <div className="p-4 rounded-lg bg-zinc-50/80 border border-zinc-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                P - Population / Subject Context
              </span>
              <span className="text-[11px] text-zinc-400">Who or what is studied?</span>
            </div>
            <textarea
              rows={3}
              value={pico.population}
              onChange={(e) => setPico({ ...pico, population: e.target.value })}
              placeholder="e.g. Knowledge workers performing multi-source analytical synthesis tasks..."
              className="w-full bg-white border border-zinc-300 rounded-md p-2.5 text-xs text-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* I - Intervention */}
          <div className="p-4 rounded-lg bg-zinc-50/80 border border-zinc-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                I - Intervention / Novel Method
              </span>
              <span className="text-[11px] text-zinc-400">What is the active treatment?</span>
            </div>
            <textarea
              rows={3}
              value={pico.intervention}
              onChange={(e) => setPico({ ...pico, intervention: e.target.value })}
              placeholder="e.g. Structured multimodal LLM scaffolding with progressive disclosure..."
              className="w-full bg-white border border-zinc-300 rounded-md p-2.5 text-xs text-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* C - Comparison */}
          <div className="p-4 rounded-lg bg-zinc-50/80 border border-zinc-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                C - Comparison / Baseline Standard
              </span>
              <span className="text-[11px] text-zinc-400">What is the control group?</span>
            </div>
            <textarea
              rows={3}
              value={pico.comparison}
              onChange={(e) => setPico({ ...pico, comparison: e.target.value })}
              placeholder="e.g. Standard unstructured chat-based LLM conversational interfaces..."
              className="w-full bg-white border border-zinc-300 rounded-md p-2.5 text-xs text-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* O - Outcome */}
          <div className="p-4 rounded-lg bg-zinc-50/80 border border-zinc-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                O - Outcome / Dependent Metrics
              </span>
              <span className="text-[11px] text-zinc-400">How is effect measured?</span>
            </div>
            <textarea
              rows={3}
              value={pico.outcome}
              onChange={(e) => setPico({ ...pico, outcome: e.target.value })}
              placeholder="e.g. NASA-TLX cognitive load index, task completion latency, and citation accuracy..."
              className="w-full bg-white border border-zinc-300 rounded-md p-2.5 text-xs text-zinc-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Two Column Section: Research Questions & Feasibility Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Research Questions & Hypotheses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-zinc-900">Formulated Research Questions (RQs)</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">3 Testable Inquiries</span>
            </div>

            <div className="mt-4 space-y-3">
              {project.researchQuestions.map((rq, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-zinc-50 border border-zinc-200">
                  <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    RQ{idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-900 font-medium leading-relaxed">{rq}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(rq, `rq_${idx}`)}
                    className="text-zinc-400 hover:text-zinc-600 p-1 rounded"
                    title="Copy question"
                  >
                    {copiedKey === `rq_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Primary Hypothesis */}
            <div className="mt-6 pt-5 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  Primary Working Hypothesis (H₁)
                </h4>
                <button
                  onClick={() => handleCopy(project.hypothesis, "hypo")}
                  className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
                >
                  {copiedKey === "hypo" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs text-indigo-950 font-serif italic leading-relaxed">
                "{project.hypothesis}"
              </div>
            </div>

            {/* Recommended Search Keywords */}
            <div className="mt-6 pt-5 border-t border-zinc-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                Literature Database Keywords (Google Scholar, PubMed, IEEE)
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200 hover:bg-zinc-200/70 transition-colors"
                  >
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Feasibility & Scope Check */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
            <h3 className="font-bold text-sm text-zinc-900 pb-3 border-b border-zinc-100 flex items-center justify-between">
              <span>Feasibility &amp; Scope Audit</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                project.feasibilityScore === "High"
                  ? "bg-emerald-100 text-emerald-800"
                  : project.feasibilityScore === "Moderate"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}>
                {project.feasibilityScore} Feasibility
              </span>
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-zinc-600 leading-relaxed">
                {project.feasibilityNotes || "Project scope matches standard timeline parameters."}
              </p>

              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-2">
                <div className="font-semibold text-zinc-800">Scope Creep Checklist:</div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bounded to 1-2 independent variables</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Primary data source secured early</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ethics / IRB clearance requirements identified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 text-zinc-100 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              Advisor Meeting Prep
            </div>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
              When presenting this topic to your advisor or thesis committee: show the PICO breakdown and the 3 specific research questions. Novices who bring clear bounded variables receive 80% faster proposal approvals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
