import React, { useState } from "react";
import { 
  Sparkles, 
  Languages, 
  ShieldCheck, 
  Check, 
  Copy, 
  ArrowRight, 
  BookOpen, 
  AlertCircle, 
  HelpCircle,
  Feather,
  HeartHandshake
} from "lucide-react";
import { ResearchProject } from "../types";
import { ACADEMIC_PHRASEBANK } from "../data/initialData";

interface StyleNNESStudioTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

export const StyleNNESStudioTab: React.FC<StyleNNESStudioTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [inputText, setInputText] = useState(
    "In our experiment we saw that when people use the chatbot without any outline they get really confused and take a lot of time. This definitely proves that our new method is the best solution for students."
  );
  const [polishMode, setPolishMode] = useState<
    "academic_tone" | "hedging_adjust" | "nnes_clarity" | "directness_thesis" | "paraphrase_safe"
  >("academic_tone");
  const [loading, setLoading] = useState(false);
  const [polishedResult, setPolishedResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunPolisher = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/papr/style-polisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          mode: polishMode,
          targetAudience: "High-Impact Academic Journal",
        }),
      });

      if (!res.ok) throw new Error("Polisher error");
      const data = await res.json();
      setPolishedResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to polish text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Style &amp; NNES Studio
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Epistemic Hedging &amp; Academic Rhetoric
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Scholarly Tone, Hedging &amp; Lexicon Optimizer
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Directly resolves the critical Non-Native English Speaker (NNES) and novice challenges documented in the PDF: overcoming colloquial grammar, applying appropriate academic hedging, and structuring arguments thesis-first.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Plagiarism-Safe Scaffolding
            </span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Polisher & Phrasebank */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Polisher Tool */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-zinc-900">Academic Prose Polisher</h3>
              </div>
              <span className="text-xs text-zinc-400">Select optimization mode</span>
            </div>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {[
                { id: "academic_tone", label: "Scholarly Tone", desc: "Formal vocabulary" },
                { id: "hedging_adjust", label: "Epistemic Hedging", desc: "Prudent caution" },
                { id: "nnes_clarity", label: "NNES Grammar", desc: "Articles & Syntax" },
                { id: "directness_thesis", label: "Thesis-First", desc: "Direct structure" },
                { id: "paraphrase_safe", label: "Safe Paraphrase", desc: "Plagiarism shield" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPolishMode(m.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    polishMode === m.id
                      ? "bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <div className="font-semibold text-xs">{m.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Input textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700">
                Input Draft Prose (or paste from Introduction/Discussion)
              </label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or write your academic sentences here..."
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-xs text-zinc-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-500">
                Mode explanation:{" "}
                {polishMode === "hedging_adjust" && "Converts absolute assertions ('definitely proves') into scholarly hedging ('suggests preliminary support')."}
                {polishMode === "academic_tone" && "Eliminates conversational phrases ('really confused', 'a lot of time') in favor of precise metrics."}
                {polishMode === "nnes_clarity" && "Calibrates definite/indefinite articles (a/an/the) and prepositions."}
                {polishMode === "directness_thesis" && "Reorders inductive, gradual build-ups to place the claim upfront (standard in Western peer review)."}
                {polishMode === "paraphrase_safe" && "Rephrases ideas from authoritative sources to eliminate unintentional verbatim overlap."}
              </span>
              <button
                onClick={handleRunPolisher}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Polishing..." : "Polish Prose"}</span>
              </button>
            </div>

            {/* Polished Result Output */}
            {polishedResult && (
              <div className="mt-6 pt-6 border-t border-zinc-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                      Optimized Scholarly Output
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(polishedResult.polishedText, "polished")}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    {copiedKey === "polished" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "polished" ? "Copied!" : "Copy Text"}</span>
                  </button>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg font-serif text-xs text-zinc-900 leading-relaxed">
                  {polishedResult.polishedText}
                </div>

                {/* Specific Improvements */}
                {polishedResult.specificImprovements && polishedResult.specificImprovements.length > 0 && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5 text-xs">
                    <div className="font-semibold text-emerald-950">Specific Stylistic Revisions:</div>
                    <ul className="list-disc list-inside space-y-1 text-emerald-900 text-[11px]">
                      {polishedResult.specificImprovements.map((imp: string, i: number) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reassurance from PDF: Normalizing Writing Struggles */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 shadow-2xs flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-amber-950">
                Impostor Syndrome &amp; Language Anxiety Normalization
              </div>
              <p className="text-amber-800 leading-relaxed">
                As reported in the 2024 TESOL postgrad studies, many non-native English scholars fear that peer reviewers will reject them based on language alone. In reality, peer reviewers focus primarily on research design and logical validity. Using standardized rhetorical moves and calibrated hedging establishes immediate credibility.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Manchester Academic Phrasebank Browser */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                Academic Phrasebank Repository
              </h4>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Curated formulas to reduce cognitive burden when writing in academic English:
            </p>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {ACADEMIC_PHRASEBANK.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="font-semibold text-xs text-zinc-900">
                    {cat.category}
                  </div>
                  <div className="space-y-1.5">
                    {cat.phrases.map((phrase, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => handleCopy(phrase, `phrase_${idx}_${pIdx}`)}
                        className="p-2 rounded bg-white hover:bg-indigo-50/70 border border-zinc-200 hover:border-indigo-200 transition-colors text-[11px] text-zinc-700 cursor-pointer font-serif italic flex items-center justify-between group"
                      >
                        <span className="line-clamp-2">"{phrase}"</span>
                        <span className="text-[10px] text-zinc-400 group-hover:text-indigo-600 font-sans shrink-0 ml-1">
                          {copiedKey === `phrase_${idx}_${pIdx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
