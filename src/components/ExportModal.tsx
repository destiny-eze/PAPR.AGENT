import React, { useState } from "react";
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Code2, 
  BookOpen, 
  MessageSquare,
  Users
} from "lucide-react";
import { ResearchProject } from "../types";

interface ExportModalProps {
  project: ResearchProject;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [exportType, setExportType] = useState<"markdown" | "latex" | "bibtex" | "rebuttal">("markdown");
  const [copied, setCopied] = useState(false);

  const generateMarkdownDraft = () => {
    let md = `# ${project.title}\n\n`;
    if (project.workingSubtitle) md += `*${project.workingSubtitle}*\n\n`;
    
    // Authors
    const authors = project.contributors.map((c) => `${c.name} (${c.affiliation})`).join(", ");
    if (authors) md += `**Authors**: ${authors}\n\n`;
    
    md += `**Keywords**: ${project.keywords.join(", ")}\n\n---\n\n`;

    // Sections
    const sections = ["Abstract", "Introduction", "Methods", "Results", "Discussion"];
    for (const sec of sections) {
      const data = project.manuscript[sec];
      if (data && data.content.trim()) {
        md += `## ${sec}\n\n${data.content.trim()}\n\n`;
      }
    }

    // CRediT statement
    const creditParts = project.contributors.map((c) => `${c.name}: ${(c.roles || []).join(", ")}.`);
    md += `## CRediT Author Statement\n\n${creditParts.join(" ")}\n\n`;

    // References
    if (project.papers.length > 0) {
      md += `## References\n\n`;
      project.papers.forEach((p) => {
        md += `- ${p.citationFormat?.apa || `${p.authors} (${p.year}). ${p.title}. ${p.journal}.`}\n`;
      });
    }

    return md;
  };

  const generateLaTeXDraft = () => {
    return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{${project.title}}
\\author{${project.contributors.map(c => c.name).join(" \\and ")}}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
${project.manuscript.Abstract?.content || "Abstract text goes here..."}
\\end{abstract}

\\section{Introduction}
${project.manuscript.Introduction?.content || "Introduction content..."}

\\section{Methods}
${project.manuscript.Methods?.content || "Methods content..."}

\\section{Results}
${project.manuscript.Results?.content || "Results content..."}

\\section{Discussion}
${project.manuscript.Discussion?.content || "Discussion content..."}

\\bibliographystyle{plain}
\\bibliography{references}

\\end{document}`;
  };

  const generateBibTeX = () => {
    if (project.papers.length === 0) {
      return "% No papers indexed yet in Lit Matrix.";
    }
    return project.papers
      .map((p) => p.citationFormat?.bibtex || `@article{ref_${p.id},\n  author = {${p.authors}},\n  title = {${p.title}},\n  year = {${p.year}},\n  journal = {${p.journal}}\n}`)
      .join("\n\n");
  };

  const generateRebuttal = () => {
    if (project.rebuttals.length === 0) {
      return "No reviewer comments recorded in Rebuttal Matrix.";
    }
    let text = `RESPONSE TO REVIEWERS\nManuscript: "${project.title}"\n\nDear Editor and Reviewers,\nThank you for your constructive critiques. Below are our point-by-point responses:\n\n`;
    project.rebuttals.forEach((r, idx) => {
      text += `Point ${idx + 1} (Reviewer #${r.reviewerNum}):\n"${r.comment}"\n\nResponse:\n${r.responseDraft}\n\nRevision (${r.targetLocation}):\n${r.manuscriptModification}\n\n-------------------------\n\n`;
    });
    return text;
  };

  const getContent = () => {
    switch (exportType) {
      case "markdown": return generateMarkdownDraft();
      case "latex": return generateLaTeXDraft();
      case "bibtex": return generateBibTeX();
      case "rebuttal": return generateRebuttal();
    }
  };

  const content = getContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions = {
      markdown: "md",
      latex: "tex",
      bibtex: "bib",
      rebuttal: "txt"
    };
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `papr_${project.id}_${exportType}.${extensions[exportType]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl border border-zinc-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-zinc-900">Export Research Deliverables</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format tabs */}
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => setExportType("markdown")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              exportType === "markdown" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown Manuscript (.md)</span>
          </button>

          <button
            onClick={() => setExportType("latex")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              exportType === "latex" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>LaTeX Template (.tex)</span>
          </button>

          <button
            onClick={() => setExportType("bibtex")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              exportType === "bibtex" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>BibTeX Citations (.bib)</span>
          </button>

          <button
            onClick={() => setExportType("rebuttal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              exportType === "rebuttal" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviewer Rebuttal Letter</span>
          </button>
        </div>

        {/* Preview block */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 border border-zinc-200 rounded-lg p-4 font-mono text-xs text-zinc-800 whitespace-pre-wrap select-all">
          {content}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-500">
            Export ready for Overleaf, Word, or journal submission portals.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
