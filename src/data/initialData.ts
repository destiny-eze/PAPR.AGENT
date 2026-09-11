import { ResearchProject, ResearcherPersona, PersonaDetails } from "../types";

export const PERSONA_DEFINITIONS: Record<ResearcherPersona, PersonaDetails> = {
  undergraduate: {
    id: "undergraduate",
    label: "Undergraduate",
    badge: "Novice Researcher",
    tagline: "Topic feasibility, IMRaD scaffolding & citation confidence",
    topPainPoints: [
      "Struggling to pick a feasible research topic and title",
      "Finding and synthesizing relevant peer-reviewed sources",
      "Lack of methodology knowledge and statistical anxiety",
      "Disorganized writing structure and missing key sections",
      "Fear of accidental plagiarism and mis-citation"
    ],
    recommendedFocus: "Use the PICO Formulator to narrow your question, follow the IMRaD skeleton, and rely on the Gantt timeline to avoid last-minute rush.",
    pdfCitation: "Jordan survey & Philippine writing studies (2023-2024)"
  },
  graduate: {
    id: "graduate",
    label: "Master's & PhD",
    badge: "Advanced Scholar",
    tagline: "Literature gap synthesis, thesis structuring & advisor alignment",
    topPainPoints: [
      "Originality anxiety and scope creep in problem definition",
      "Producing list-like literature reviews instead of thematic synthesis",
      "Severe writer's block on long manuscripts/theses",
      "Supervisor expectation mismatches and unclear feedback",
      "Time juggling between teaching, experiments, and writing"
    ],
    recommendedFocus: "Use the Literature Synthesis Matrix to identify critical gaps and structure your thesis by writing Methods first, followed by Results and Introduction.",
    pdfCitation: "Iloilo study & Somali thesis study (mean 3.4/5 time challenge)"
  },
  early_career: {
    id: "early_career",
    label: "Early-Career (ECR)",
    badge: "Tenure-Track / Postdoc",
    tagline: "Grant framing, high-impact publication & time blocking",
    topPainPoints: [
      "Intense 'publish or perish' pressure and journal selection hurdles",
      "Grant funding competition (86% of researchers report funding deficit)",
      "Heavy teaching/administrative load eating research time",
      "Lack of senior institutional mentorship",
      "Handling peer review rejections without burnout"
    ],
    recommendedFocus: "Target strategic journal tiers, deploy Pomodoro time-blocking for dedicated writing hours, and use the Rebuttal Matrix for constructive revisions.",
    pdfCitation: "INASP/ISC worldwide researcher survey & Kaduna Univ. review"
  },
  senior_academic: {
    id: "senior_academic",
    label: "Senior Academic",
    badge: "Principal Investigator",
    tagline: "Authorship ethics, modern methodology shifts & delegation",
    topPainPoints: [
      "Extreme administrative workload leaving minimal dedicated writing time",
      "Keeping current with new computational tools & open data standards",
      "Co-authorship order disputes and unintended over-crediting",
      "Managing diverse graduate student writing styles across large labs",
      "Peer review fatigue and editorial service overload"
    ],
    recommendedFocus: "Enforce transparent CRediT authorship taxonomies, utilize structured lab writing guidelines, and delegate initial section drafting.",
    pdfCitation: "Senior scholar survey on authorship dilemmas and sabbatical models"
  },
  interdisciplinary: {
    id: "interdisciplinary",
    label: "Interdisciplinary Team",
    badge: "Cross-Discipline",
    tagline: "Bridging jargon, conflicting paradigms & authorship credit",
    topPainPoints: [
      "Heavy disciplinary jargon and conflicting communication styles",
      "Incompatible research paradigms (qualitative vs. quantitative models)",
      "Authorship order norms varying by discipline (alphabetical vs. first/last)",
      "Finding suitable publication venues that value cross-discipline work",
      "Grant reviewers applying narrow, single-discipline evaluation criteria"
    ],
    recommendedFocus: "Establish a shared project glossary, define a unified problem upfront, and use CRediT contributorship statements to reward all team members.",
    pdfCitation: "PLOS ONE & AAC&U interdisciplinary collaboration reports"
  },
  non_native_english: {
    id: "non_native_english",
    label: "Non-Native English (NNES)",
    badge: "Global Researcher",
    tagline: "Academic lexicon, epistemic hedging & thesis-first structure",
    topPainPoints: [
      "Limited academic vocabulary leading to ambiguous or oversimplified phrasing",
      "Cultural rhetorical norms (building arguments gradually vs. thesis upfront)",
      "Anxiety that reviewers will judge language quality over scientific merit",
      "Uncertainty around paraphrasing boundaries and plagiarism fears",
      "Impostor syndrome and paralyzing dread of peer review submission"
    ],
    recommendedFocus: "Leverage Swales' move-based phrasebank, apply epistemic hedging, and re-structure arguments to state the central finding directly upfront.",
    pdfCitation: "TESOL postgrad studies & AWEJ scientific writing research"
  }
};

export const CREDIT_ROLES = [
  { id: "Conceptualization", label: "Conceptualization", desc: "Formulation of overarching research goals, hypotheses, and aims." },
  { id: "Methodology", label: "Methodology", desc: "Development or design of methodology and creation of experimental models." },
  { id: "Software", label: "Software", desc: "Programming, software development, designing computer programs, or testing code." },
  { id: "Validation", label: "Validation", desc: "Verification of overall replication, reproduction, and test validity." },
  { id: "Formal Analysis", label: "Formal Analysis", desc: "Application of statistical, mathematical, computational, or other formal techniques." },
  { id: "Investigation", label: "Investigation", desc: "Conducting experimental procedures, data collection, and evidence gathering." },
  { id: "Resources", label: "Resources", desc: "Provision of study materials, reagents, patients, lab samples, or instrumentation." },
  { id: "Data Curation", label: "Data Curation", desc: "Management activities to annotate, clean, and maintain research data." },
  { id: "Writing - Original Draft", label: "Writing - Original Draft", desc: "Preparation and creation of the published work (specifically the primary draft)." },
  { id: "Writing - Review & Editing", label: "Writing - Review & Editing", desc: "Critical review, commentary, revision, and intellectual refinement." },
  { id: "Visualization", label: "Visualization", desc: "Preparation, creation, or presentation of graphs, charts, diagrams, and figures." },
  { id: "Supervision", label: "Supervision", desc: "Oversight and leadership responsibility for the research activity planning and execution." },
  { id: "Project Administration", label: "Project Administration", desc: "Management and coordination responsibility for the research activity." },
  { id: "Funding Acquisition", label: "Funding Acquisition", desc: "Acquisition of financial support leading to this publication." }
];

export const ACADEMIC_PHRASEBANK = [
  {
    category: "Establishing Significance (Intro Move 1)",
    phrases: [
      "In recent years, considerable scholarly attention has centered upon...",
      "The capacity to effectively analyze and optimize [X] is widely regarded as pivotal for...",
      "A substantial body of empirical literature has demonstrated that...",
      "Over the past decade, rapid advancements in [X] have transformed traditional understanding of..."
    ]
  },
  {
    category: "Indicating a Research Gap (Intro Move 2)",
    phrases: [
      "However, previous investigations have predominantly focused on [X], leaving [Y] largely unexplored.",
      "Despite these foundational advances, empirical evidence remains contradictory regarding...",
      "Much of the existing scholarship suffers from two notable limitations: first, [...]; second, [...]",
      "While the theoretical basis of [X] is well established, its practical application under [Y] remains unverified."
    ]
  },
  {
    category: "Announcing Present Work (Intro Move 3)",
    phrases: [
      "To address this critical lacuna, the present study investigates...",
      "Specifically, this research formulates two primary objectives: first, [...]; second, [...]",
      "The primary thesis defended herein is that [X] exerts a moderating effect on [Y] through...",
      "In contrast to prior retrospective approaches, our methodology adopts a prospective design."
    ]
  },
  {
    category: "Describing Methodology & Justification",
    phrases: [
      "To ensure reproducibility and control for confounding variables, a quasi-experimental design was adopted.",
      "Participants were selected via stratified purposive sampling to represent diverse...",
      "All instrumentation underwent rigorous construct validity testing prior to deployment.",
      "Data preprocessing involved normalization using standard z-score transformations to mitigate outlier skew."
    ]
  },
  {
    category: "Hedging & Epistemic Caution (Crucial for NNES)",
    phrases: [
      "These observations lend preliminary support to the hypothesis that...",
      "While not conclusive, the data tend to indicate a discernible trend toward...",
      "It is plausible that the observed disparity stems from unmeasured situational factors.",
      "Caution is warranted when extrapolating these findings beyond the studied cohort.",
      "Our results should be interpreted within the constraints of the cross-sectional dataset."
    ]
  },
  {
    category: "Discussing Limitations & Future Work",
    phrases: [
      "A primary limitation of this investigation resides in the reliance on self-reported metrics.",
      "Future research would benefit from longitudinal tracking to assess long-term stability.",
      "Notwithstanding these limitations, our findings provide a solid empirical benchmark for..."
    ]
  }
];

export const SAMPLE_PROJECTS: ResearchProject[] = [
  {
    id: "proj_multimodal_llm",
    title: "Cognitive Load and Decision Latency in Multimodal LLM Workflows",
    workingSubtitle: "A Comparative Investigation of Human-AI Interaction Under Information Overload",
    discipline: "Computer Science & Human-Computer Interaction",
    persona: "graduate",
    lastModified: "Today, 10:45 AM",
    pico: {
      population: "Knowledge workers performing multi-source analytical synthesis tasks",
      intervention: "Structured multimodal LLM scaffolding with progressive disclosure",
      comparison: "Standard unstructured chat-based LLM conversational interfaces",
      outcome: "NASA-TLX cognitive load index, task completion latency, and citation accuracy"
    },
    researchQuestions: [
      "How does structured prompt scaffolding affect cognitive fatigue during complex literature synthesis?",
      "To what extent does conversational interface modality moderate decision latency in high-stakes reasoning?",
      "What interaction design patterns minimize hallucination oversight among novice academic writers?"
    ],
    hypothesis: "Structured multimodal scaffolding significantly reduces user cognitive load (NASA-TLX > 20% reduction) while preserving analytical rigor compared to open-ended conversational interfaces.",
    feasibilityScore: "High",
    feasibilityNotes: "Ethics approval (IRB) approved; participant pool of 60 graduate students accessible; instrumentation coded via React and logging telemetry.",
    keywords: ["Multimodal LLMs", "Cognitive Load", "Human-AI Interaction", "NASA-TLX", "Academic Writing Scaffolding"],
    papers: [
      {
        id: "p1",
        title: "Cognitive Architecture and Human-AI Collaborative Reasoning",
        authors: "Chen, H., & Rodriguez, M.",
        year: 2024,
        journal: "ACM Transactions on Computer-Human Interaction",
        doi: "10.1145/3641289",
        methodology: "Within-subject controlled laboratory trial (N=48)",
        keyFindings: "Unstructured chat prompts induced 34% higher extraneous cognitive load during multi-document synthesis.",
        limitations: "Conducted solely with undergraduate engineering students.",
        relevanceToProject: "Provides validated NASA-TLX baseline and motivates our structured interface approach.",
        tags: ["Cognitive Load", "Experimental", "HCI"],
        citationFormat: {
          apa: "Chen, H., & Rodriguez, M. (2024). Cognitive architecture and human-AI collaborative reasoning. ACM Transactions on Computer-Human Interaction, 31(2), 1-28.",
          ieee: "H. Chen and M. Rodriguez, \"Cognitive architecture and human-AI collaborative reasoning,\" ACM Trans. Comput.-Hum. Interact., vol. 31, no. 2, pp. 1-28, 2024.",
          bibtex: "@article{chen2024cognitive,\n  author = {Chen, H. and Rodriguez, M.},\n  title = {Cognitive architecture and human-AI collaborative reasoning},\n  journal = {ACM TOCHI},\n  year = {2024},\n  volume = {31},\n  number = {2}\n}"
        }
      },
      {
        id: "p2",
        title: "Mitigating Cognitive Tunneling in Generative AI Decision Support",
        authors: "Kowalski, S., Patel, A., & Thorne, J.",
        year: 2023,
        journal: "International Journal of Human-Computer Studies",
        doi: "10.1016/j.ijhcs.2023.102941",
        methodology: "Mixed-methods eye-tracking & task performance study",
        keyFindings: "Visual chunking and move-based scaffolding reduced uncritical acceptance of AI errors by 41%.",
        limitations: "Did not evaluate multi-day research writing tasks.",
        relevanceToProject: "Directly justifies our step-by-step Swales' move architecture in Papr.",
        tags: ["Scaffolding", "Eye-Tracking", "Decision Support"],
        citationFormat: {
          apa: "Kowalski, S., Patel, A., & Thorne, J. (2023). Mitigating cognitive tunneling in generative AI decision support. International Journal of Human-Computer Studies, 178, 102941.",
          ieee: "S. Kowalski, A. Patel, and J. Thorne, \"Mitigating cognitive tunneling in generative AI decision support,\" Int. J. Hum.-Comput. Stud., vol. 178, p. 102941, 2023.",
          bibtex: "@article{kowalski2023mitigating,\n  author = {Kowalski, S. and Patel, A. and Thorne, J.},\n  title = {Mitigating cognitive tunneling in generative AI decision support},\n  journal = {IJHCS},\n  year = {2023},\n  volume = {178}\n}"
        }
      },
      {
        id: "p3",
        title: "Writing Under Pressure: Academic Novices and Digital Writing Assistants",
        authors: "Vanderbilt, E., & Morales, G.",
        year: 2024,
        journal: "Journal of English for Academic Purposes",
        doi: "10.1016/j.jeap.2024.101340",
        methodology: "Survey and log analysis across 12 universities (N=620)",
        keyFindings: "Non-native English writers experienced persistent impostor anxiety despite grammatical accuracy improvements.",
        limitations: "Self-report survey without direct psychological biometric monitoring.",
        relevanceToProject: "Supports our dedicated NNES confidence-building and rhetorical structuring tools.",
        tags: ["NNES", "Writing Anxiety", "Academic Lexicon"],
        citationFormat: {
          apa: "Vanderbilt, E., & Morales, G. (2024). Writing under pressure: Academic novices and digital writing assistants. Journal of English for Academic Purposes, 68, 101340.",
          ieee: "E. Vanderbilt and G. Morales, \"Writing under pressure: Academic novices and digital writing assistants,\" J. Engl. Acad. Purp., vol. 68, p. 101340, 2024.",
          bibtex: "@article{vanderbilt2024writing,\n  author = {Vanderbilt, E. and Morales, G.},\n  title = {Writing under pressure: Academic novices and digital writing assistants},\n  journal = {JEAP},\n  year = {2024},\n  volume = {68}\n}"
        }
      }
    ],
    themes: [
      {
        id: "th1",
        title: "Cognitive Friction in AI-Assisted Synthesis",
        consensus: "Unstructured chat outputs impose high working-memory demands as users must continually cross-reference sources.",
        divergence: "Debate over whether conversational dialogue fosters deeper reflection or merely delays task completion.",
        criticalGap: "Lack of empirical testing on structured rhetorical move interfaces versus conversational text boxes.",
        citingPapers: ["p1", "p2"]
      },
      {
        id: "th2",
        title: "Novice & NNES Psychological Barriers",
        consensus: "Academic writing anxiety is exacerbated by fear of peer critique and stylistic insecurity.",
        divergence: "Whether automated grammar fixers empower writers or deepen reliance on external validation.",
        criticalGap: "Tools rarely address rhetorical structure (thesis-first) or epistemic hedging guidance.",
        citingPapers: ["p3"]
      }
    ],
    manuscript: {
      Abstract: {
        title: "Abstract",
        content: "Modern academic researchers face escalating pressures to synthesize vast literature bases while maintaining rigorous methodological standards. Although large language model (LLM) tools promise productivity enhancements, unstructured conversational interfaces often induce substantial extraneous cognitive load and decision fatigue. This study investigates the impact of structured rhetorical move scaffolding on researcher workflow efficiency and perceived cognitive load. Utilizing a controlled within-subject experimental trial (N=60), participants completed complex academic synthesis tasks under two conditions: standard conversational chat and structured IMRaD scaffolding. Results indicate that structured scaffolding led to a 28.4% reduction in NASA-TLX cognitive workload scores (p < 0.001) and a 33% increase in source citation accuracy, without compromising writing voice or conceptual depth. These findings suggest that user interface architecture plays a decisive role in human-AI collaborative scholarship, providing design implications for next-generation academic authoring tools.",
        targetWordCount: 250,
        status: "complete"
      },
      Introduction: {
        title: "Introduction",
        content: `Over the past decade, substantial scholarly attention has centered upon the systemic cognitive demands placed on academic researchers during manuscript composition. As the volume of published literature expands exponentially, novice and experienced scholars alike confront severe time constraints and synthesis bottlenecks (Chen & Rodriguez, 2024).

However, previous investigations have predominantly focused on automated grammar correction and spell-checking, leaving higher-order cognitive scaffolding and rhetorical move formulation largely unaddressed. Unstructured generative text interfaces frequently exacerbate cognitive tunneling, forcing authors to continuously verify disconnected prose fragments against primary sources (Kowalski et al., 2023). Furthermore, non-native English scholars continue to report acute anxiety regarding disciplinary conventions and epistemic hedging standards (Vanderbilt & Morales, 2024).

To address this critical gap, the present study investigates whether structured IMRaD scaffolding with integrated rhetorical moves reduces user cognitive load during academic manuscript formulation. Specifically, we examine the following question: to what extent does structured move scaffolding lower decision latency and enhance citation fidelity compared to conventional chat interfaces? We hypothesize that structured scaffolding provides an external cognitive architecture that frees working memory for analytical synthesis.`,
        targetWordCount: 950,
        status: "drafting",
        activeMoveIndex: 2
      },
      Methods: {
        title: "Methods",
        content: `A within-subject randomized controlled experiment was conducted with N=60 researchers stratified across graduate students (n=32), early-career postdocs (n=18), and interdisciplinary scholars (n=10). 

Each participant completed two balanced academic synthesis tasks: (a) generating a thematic literature matrix and Introduction draft using a standard conversational AI interface, and (b) executing the identical task using Papr's structured rhetorical move scaffold. Task order and topic domains were counterbalanced using a Latin square design to mitigate order and learning effects.

Primary outcome metrics included the standardized NASA-TLX cognitive workload index (encompassing mental demand, effort, and frustration), objective task completion latency recorded via automated telemetry, and citation attribution accuracy evaluated by dual-blind expert reviewers. All procedures adhered strictly to institutional review board protocols (IRB #2024-HCI-0912).`,
        targetWordCount: 800,
        status: "complete"
      },
      Results: {
        title: "Results",
        content: `Quantitative analysis demonstrated statistically significant reductions across all six NASA-TLX subscales for the structured scaffolding condition. Overall composite workload decreased from M = 68.4 (SD = 9.2) in the conversational baseline to M = 48.9 (SD = 8.1) in the structured condition (t(59) = 11.42, p < 0.001, Cohen's d = 1.48).

Participants in the structured condition completed their thematic synthesis 14.2 minutes faster on average (95% CI [10.8, 17.6], p < 0.001). Furthermore, citation attribution fidelity rose from 71.4% to 94.8%, with expert raters observing substantially fewer unsupported generalizations and unwarranted causal claims.`,
        targetWordCount: 700,
        status: "drafting"
      },
      Discussion: {
        title: "Discussion",
        content: `These empirical findings lend robust support to our central hypothesis: structuring the writing interface according to recognized rhetorical moves drastically mitigates the extraneous cognitive burden associated with academic synthesis. Rather than wrestling with prompt engineering, researchers were able to channel attentional resources into conceptual critique and methodological justification.

Our results corroborate the cognitive tunneling observations reported by Kowalski et al. (2023), while extending their scope into active manuscript drafting. Crucially, the observed improvements in citation fidelity demonstrate that structural scaffolds safeguard academic integrity by discouraging passive cut-and-paste behaviors.

Several limitations warrant acknowledgment. First, our evaluation took place in a single laboratory session; longitudinal tracking across a multi-month dissertation timeline is necessary to verify retention. Second, while non-native English participants exhibited the largest proportional reductions in frustration, further field studies across diverse linguistic cohorts are recommended.`,
        targetWordCount: 900,
        status: "drafting"
      }
    },
    contributors: [
      {
        id: "c1",
        name: "Alex M. Vance",
        email: "alex.vance@university.edu",
        affiliation: "Department of Computer Science, State University",
        roles: ["Conceptualization", "Methodology", "Software", "Formal Analysis", "Writing - Original Draft"],
        isCorrespondingAuthor: true,
        order: 1
      },
      {
        id: "c2",
        name: "Dr. Elena Rostova",
        email: "e.rostova@university.edu",
        affiliation: "School of Information & Cognitive Systems",
        roles: ["Conceptualization", "Supervision", "Writing - Review & Editing", "Funding Acquisition"],
        isCorrespondingAuthor: false,
        order: 2
      },
      {
        id: "c3",
        name: "Kenji Sato",
        email: "k.sato@lab.res.org",
        affiliation: "HCI Collaborative Laboratory",
        roles: ["Investigation", "Data Curation", "Validation"],
        isCorrespondingAuthor: false,
        order: 3
      }
    ],
    rebuttals: [
      {
        id: "r1",
        reviewerNum: 1,
        comment: "The sample size of N=60 is reasonable, but the manuscript does not adequately explain how learning effects were controlled between task conditions.",
        stance: "agree_and_modify",
        authorNotes: "We used a Latin square counterbalanced design. We should explicitly state this in Methods 2.2 and add the exact statistical test.",
        responseDraft: "We thank Reviewer 1 for highlighting this essential methodological detail. We fully agree that order and carryover effects must be stringently controlled. In our revised Methods section (Section 2.2), we have added explicit clarification detailing our Latin square counterbalancing schema and reported the two-way ANOVA confirmation that task sequence was not statistically significant.",
        manuscriptModification: "\"[Added to Methods, Section 2.2]: Task sequence and domain pairings were counterbalanced via a 2x2 Latin square configuration. A two-way repeated measures ANOVA confirmed no significant order effects on composite cognitive workload (F(1,58) = 0.42, p = 0.52).\"",
        targetLocation: "Methods Section 2.2, Paragraph 2",
        status: "finalized"
      },
      {
        id: "r2",
        reviewerNum: 2,
        comment: "The distinction between 'cognitive load' and 'decision latency' in the Discussion feels somewhat blurred. Please provide clearer theoretical separation.",
        stance: "clarify_without_change",
        authorNotes: "Reviewer 2 makes a fair point on terminology. We should clarify the definition based on Sweller's cognitive load theory.",
        responseDraft: "We are grateful to Reviewer 2 for this constructive conceptual point. We have carefully refined Section 4.1 to distinctly separate internal subjective working memory burden (measured via NASA-TLX) from external behavioral execution latency (measured in seconds), citing Sweller (2020).",
        manuscriptModification: "\"[Revised in Discussion, Section 4.1]: We explicitly distinguish between subjective cognitive load (the mental effort exerted on working memory) and decision latency (the operational time required to formulate a synthesis move).\"",
        targetLocation: "Discussion Section 4.1, Paragraph 3",
        status: "drafted"
      }
    ],
    milestones: [
      { id: "m1", phase: "topic", title: "Finalize Research Question & PICO Hypotheses", deadlineWeek: 2, completed: true, notes: "Approved with committee advisor." },
      { id: "m2", phase: "lit_review", title: "Conduct Systematic Literature Search & Synthesis Matrix", deadlineWeek: 5, completed: true, notes: "42 papers screened, 18 retained." },
      { id: "m3", phase: "methodology", title: "Pre-register Protocol & Ethics (IRB) Clearance", deadlineWeek: 8, completed: true, notes: "IRB #2024-HCI-0912 granted." },
      { id: "m4", phase: "data_collection", title: "Run Experimental Trials (N=60 participants)", deadlineWeek: 13, completed: true, notes: "Completed lab sessions in 3 cohorts." },
      { id: "m5", phase: "analysis", title: "Statistical Analysis & ANOVA Significance Tests", deadlineWeek: 16, completed: true, notes: "Data cleaned; Cohen's d calculated." },
      { id: "m6", phase: "writing", title: "Complete Full IMRaD Draft & Academic Move Polish", deadlineWeek: 20, completed: false, notes: "Methods & Results done; Intro & Discussion in progress." },
      { id: "m7", phase: "submission", title: "Target Journal Formatting & CRediT Agreement Submission", deadlineWeek: 23, completed: false, notes: "Targeting ACM CHI 2026." },
      { id: "m8", phase: "revision", title: "Peer Review Response & Rebuttal Letter Preparation", deadlineWeek: 28, completed: false, notes: "Awaiting review cycle." }
    ],
    notes: "Remember to verify whether the journal requires APA 7th or IEEE citation formatting before camera-ready submission."
  },
  {
    id: "proj_interdisciplinary_climate",
    title: "Urban Microclimate Resilience and Canopy Equity: A Socio-Ecological Modeling Framework",
    workingSubtitle: "Bridging Remote Sensing Heat Island Data with Municipal Environmental Justice Indicators",
    discipline: "Urban Climatology & Environmental Sociology",
    persona: "interdisciplinary",
    lastModified: "Yesterday",
    pico: {
      population: "Vulnerable residential neighborhoods in metropolitan census tracts",
      intervention: "Targeted municipal tree canopy expansion and cool roof retrofits",
      comparison: "Historical laissez-faire zoning without equity weighting",
      outcome: "Surface temperature attenuation, heat-related morbidity, and social vulnerability index"
    },
    researchQuestions: [
      "How do discrepancies between physical heat island data and sociological vulnerability metrics affect green space allocation?",
      "What collaborative governance framework reconciles biophysical modeling with community participatory priorities?"
    ],
    hypothesis: "Integrating socio-spatial equity weights into microclimate hydrodynamic models yields a 35% higher reduction in heat-related vulnerability than purely biophysical optimization.",
    feasibilityScore: "Moderate",
    feasibilityNotes: "Cross-disciplinary data harmonization required (GIS rasters vs census tracts); team spans two distinct university departments.",
    keywords: ["Urban Heat Island", "Canopy Equity", "Environmental Justice", "Socio-Ecological Modeling", "Interdisciplinary"],
    papers: [],
    themes: [],
    manuscript: {
      Introduction: {
        title: "Introduction",
        content: "Urban climate resilience demands reconciling physical thermodynamic models with social stratification dynamics...",
        targetWordCount: 1100,
        status: "drafting"
      },
      Methods: {
        title: "Methods",
        content: "Coupling WRF-Urban atmospheric boundary layer models with CDC Social Vulnerability Index rasters...",
        targetWordCount: 950,
        status: "drafting"
      }
    },
    contributors: [
      {
        id: "ic1",
        name: "Dr. Marcus Thorne",
        email: "m.thorne@climatology.org",
        affiliation: "Department of Atmospheric Sciences",
        roles: ["Conceptualization", "Methodology", "Formal Analysis", "Writing - Original Draft"],
        isCorrespondingAuthor: true,
        order: 1
      },
      {
        id: "ic2",
        name: "Dr. Aisha Morales",
        email: "a.morales@sociology.org",
        affiliation: "Institute for Urban Sociology & Policy",
        roles: ["Conceptualization", "Investigation", "Resources", "Writing - Review & Editing"],
        isCorrespondingAuthor: false,
        order: 2
      }
    ],
    rebuttals: [],
    milestones: [
      { id: "im1", phase: "topic", title: "Establish Joint Interdisciplinary Research Charter & Glossary", deadlineWeek: 3, completed: true, notes: "Agreed on CRediT roles early to prevent disputes." },
      { id: "im2", phase: "lit_review", title: "Synthesize Climatological & Sociological Literature", deadlineWeek: 7, completed: true, notes: "Addressed conflicting paradigm vocabularies." },
      { id: "im3", phase: "methodology", title: "Harmonize Raster GIS & Census Tract Boundaries", deadlineWeek: 12, completed: false, notes: "Current active phase." }
    ],
    notes: "Important: Ensure sociological definitions of 'vulnerability' are not reduced to mere thermal exposure."
  }
];
