export type ResearcherPersona = 
  | "undergraduate"
  | "graduate"
  | "early_career"
  | "senior_academic"
  | "interdisciplinary"
  | "non_native_english";

export interface PersonaDetails {
  id: ResearcherPersona;
  label: string;
  badge: string;
  tagline: string;
  topPainPoints: string[];
  recommendedFocus: string;
  pdfCitation: string;
}

export interface PICOData {
  population: string;
  intervention: string;
  comparison: string;
  outcome: string;
}

export interface LiteraturePaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi?: string;
  methodology: string;
  keyFindings: string;
  limitations: string;
  relevanceToProject: string;
  tags: string[];
  citationFormat?: {
    apa: string;
    ieee: string;
    bibtex: string;
  };
}

export interface SynthesisTheme {
  id: string;
  title: string;
  consensus: string;
  divergence: string;
  criticalGap: string;
  citingPapers: string[];
}

export interface IMRaDSectionData {
  title: "Introduction" | "Methods" | "Results" | "Discussion" | "Abstract";
  content: string;
  targetWordCount: number;
  status: "not_started" | "drafting" | "in_review" | "complete";
  activeMoveIndex?: number;
}

export interface SwalesMove {
  moveId: string;
  title: string;
  description: string;
  sentenceStarters: string[];
  sampleProse: string;
}

export interface CRediTContributor {
  id: string;
  name: string;
  email: string;
  affiliation: string;
  roles: string[];
  isCorrespondingAuthor: boolean;
  order: number;
}

export interface RebuttalItem {
  id: string;
  reviewerNum: 1 | 2 | 3;
  comment: string;
  stance: "agree_and_modify" | "clarify_without_change" | "respectfully_rebut";
  authorNotes: string;
  responseDraft: string;
  manuscriptModification: string;
  targetLocation: string;
  status: "pending" | "drafted" | "finalized";
}

export interface ResearchMilestone {
  id: string;
  phase: "topic" | "lit_review" | "methodology" | "data_collection" | "analysis" | "writing" | "submission" | "revision";
  title: string;
  deadlineWeek: number;
  completed: boolean;
  notes: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  workingSubtitle: string;
  discipline: string;
  persona: ResearcherPersona;
  lastModified: string;
  pico: PICOData;
  researchQuestions: string[];
  hypothesis: string;
  feasibilityScore: "High" | "Moderate" | "Challenging";
  feasibilityNotes: string;
  keywords: string[];
  papers: LiteraturePaper[];
  themes: SynthesisTheme[];
  manuscript: Record<string, IMRaDSectionData>;
  contributors: CRediTContributor[];
  rebuttals: RebuttalItem[];
  milestones: ResearchMilestone[];
  notes: string;
}
