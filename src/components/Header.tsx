import React from "react";
import { 
  Sparkles, 
  Download, 
  Users, 
  HelpCircle,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { ResearchProject, ResearcherPersona } from "../types";
import { PERSONA_DEFINITIONS } from "../data/initialData";
import { PaprLogo } from "./PaprLogo";

interface HeaderProps {
  currentProject: ResearchProject;
  projects: ResearchProject[];
  onSelectProject: (id: string) => void;
  onSelectPersona: (persona: ResearcherPersona) => void;
  onOpenExport: () => void;
  onOpenNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onSelectPersona,
  onOpenExport,
  onOpenNewProject
}) => {
  const activePersonaDetails = PERSONA_DEFINITIONS[currentProject.persona] || PERSONA_DEFINITIONS.graduate;

  return (
    <header className="border-b border-[#E8EAED] bg-[#FFFFFF] sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <PaprLogo className="h-8 w-auto text-[#041026]" />
              <div className="h-5 w-[1px] bg-[#E8EAED] hidden sm:block" />
              <span className="text-xs font-medium text-[#4285F4] tracking-tight hidden sm:inline-block">
                Research, made clear.
              </span>
            </div>
          </div>

          {/* Project Switcher */}
          <div className="flex items-center gap-2.5">
            <div className="relative group">
              <select
                value={currentProject.id}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    onOpenNewProject();
                  } else {
                    onSelectProject(e.target.value);
                  }
                }}
                className="appearance-none bg-[#FFFFFF] border border-[#E8EAED] text-[#202124] text-xs sm:text-sm rounded-lg pl-3 pr-8 py-2 font-medium hover:border-[#DADCE0] focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] focus:outline-hidden cursor-pointer max-w-[180px] sm:max-w-[280px] truncate transition-colors shadow-2xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    📄 {p.title}
                  </option>
                ))}
                <option value="new">+ Create New Paper</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5F6368] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Researcher Persona Selector */}
            <div className="relative group hidden md:block">
              <select
                value={currentProject.persona}
                onChange={(e) => onSelectPersona(e.target.value as ResearcherPersona)}
                className="appearance-none bg-[#F8F9FA] hover:bg-[#F1F3F4] border border-[#E8EAED] text-[#202124] text-xs rounded-lg pl-3 pr-7 py-2 font-medium focus:ring-2 focus:ring-[#4285F4]/30 focus:border-[#4285F4] focus:outline-hidden cursor-pointer transition-colors shadow-2xs"
                title="Switch researcher profile to adapt scaffolds and guidance"
              >
                {Object.values(PERSONA_DEFINITIONS).map((p) => (
                  <option key={p.id} value={p.id}>
                    👤 {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#5F6368] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Export & Actions */}
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#202124] bg-[#FFFFFF] border border-[#E8EAED] rounded-lg hover:bg-[#F8F9FA] hover:border-[#DADCE0] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5F6368]" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Persona Guidance Ribbon */}
        <div className="py-2 border-t border-[#E8EAED] flex items-center justify-between text-xs text-[#5F6368] overflow-x-auto gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-[#202124] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4285F4]"></span>
              {activePersonaDetails.label}:
            </span>
            <span className="text-[#5F6368] italic text-[13px]">{activePersonaDetails.tagline}</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-[#5F6368] text-[11px]">
            <span className="bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#E8EAED] text-[#5F6368]">
              Grounded in: {activePersonaDetails.pdfCitation}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
