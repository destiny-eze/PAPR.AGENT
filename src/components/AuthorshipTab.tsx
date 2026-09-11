import React, { useState } from "react";
import { 
  Users, 
  Sparkles, 
  Plus, 
  Check, 
  Copy, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  ShieldAlert,
  ArrowUpDown,
  Trash2
} from "lucide-react";
import { ResearchProject, CRediTContributor } from "../types";
import { CREDIT_ROLES } from "../data/initialData";

interface AuthorshipTabProps {
  project: ResearchProject;
  onUpdateProject: (updated: Partial<ResearchProject>) => void;
}

export const AuthorshipTab: React.FC<AuthorshipTabProps> = ({
  project,
  onUpdateProject,
}) => {
  const [copied, setCopied] = useState(false);
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAffiliation, setNewAffiliation] = useState("");

  const toggleRole = (contributorId: string, roleName: string) => {
    const updated = project.contributors.map((c) => {
      if (c.id !== contributorId) return c;
      const has = c.roles.includes(roleName);
      const roles = has ? c.roles.filter((r) => r !== roleName) : [...c.roles, roleName];
      return { ...c, roles };
    });
    onUpdateProject({ contributors: updated });
  };

  const toggleCorresponding = (contributorId: string) => {
    const updated = project.contributors.map((c) => ({
      ...c,
      isCorrespondingAuthor: c.id === contributorId,
    }));
    onUpdateProject({ contributors: updated });
  };

  const handleAddAuthor = () => {
    if (!newName.trim()) return;
    const author: CRediTContributor = {
      id: `c_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim() || "author@institution.edu",
      affiliation: newAffiliation.trim() || "Department of Research",
      roles: ["Investigation", "Writing - Review & Editing"],
      isCorrespondingAuthor: project.contributors.length === 0,
      order: project.contributors.length + 1,
    };
    onUpdateProject({ contributors: [...project.contributors, author] });
    setNewName("");
    setNewEmail("");
    setNewAffiliation("");
    setShowAddAuthor(false);
  };

  const handleDeleteAuthor = (id: string) => {
    onUpdateProject({ contributors: project.contributors.filter((c) => c.id !== id) });
  };

  // Generate formal statement
  const generateCRediTStatement = () => {
    const parts = project.contributors.map((c) => {
      const rolesStr = c.roles.length > 0 ? c.roles.join(", ") : "General contribution";
      return `${c.name}: ${rolesStr}.`;
    });
    return `CRediT Contributorship Statement:
${parts.join(" ")}
All authors have critically reviewed and approved the final manuscript.`;
  };

  const formalStatement = generateCRediTStatement();

  const handleCopyStatement = () => {
    navigator.clipboard.writeText(formalStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                CRediT Authorship &amp; Contributorship
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {project.contributors.length} Registered Authors
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mt-1">
              Equitable Authorship Matrix &amp; Charter
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-0.5">
              Directly resolves the systemic co-authorship dilemmas highlighted in the PDF: preventing junior scholar under-crediting, senior unintentional over-crediting, and interdisciplinary order disputes through the 14 standard CRediT taxonomy roles.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddAuthor(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Co-Author</span>
            </button>
          </div>
        </div>
      </div>

      {/* CRediT Taxonomy Interactive Matrix */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-zinc-900">
              CRediT Role Allocation Matrix
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            Check off all qualifying roles per researcher
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3 sticky left-0 bg-zinc-50 z-10 w-48 shadow-xs">
                  Author &amp; Affiliation
                </th>
                {CREDIT_ROLES.map((role) => (
                  <th
                    key={role.id}
                    className="p-3 text-center min-w-[110px] whitespace-nowrap"
                    title={role.desc}
                  >
                    <div className="text-[11px] font-bold text-zinc-800">{role.label}</div>
                  </th>
                ))}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {project.contributors.map((author, aIdx) => (
                <tr key={author.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="p-3 sticky left-0 bg-white hover:bg-zinc-50/70 z-10 border-r border-zinc-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-zinc-400 text-[11px]">{aIdx + 1}.</span>
                      <div>
                        <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <span>{author.name}</span>
                          {author.isCorrespondingAuthor && (
                            <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded">
                              Corr.
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                          {author.affiliation}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 14 CRediT Checkboxes */}
                  {CREDIT_ROLES.map((role) => {
                    const isChecked = author.roles.includes(role.id);
                    return (
                      <td key={role.id} className="p-3 text-center">
                        <button
                          onClick={() => toggleRole(author.id, role.id)}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition-colors cursor-pointer ${
                            isChecked
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-zinc-100 text-zinc-300 hover:bg-zinc-200"
                          }`}
                          title={`Toggle ${role.label} for ${author.name}`}
                        >
                          {isChecked ? <Check className="w-3.5 h-3.5" /> : null}
                        </button>
                      </td>
                    );
                  })}

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleCorresponding(author.id)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded transition-colors ${
                          author.isCorrespondingAuthor
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-zinc-500 hover:bg-zinc-100"
                        }`}
                        title="Set corresponding author"
                      >
                        {author.isCorrespondingAuthor ? "Corresponding" : "Set Corr."}
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove author"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Bottom: Generated Statement & Authorship Ethics Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Generated CRediT Statement ready for submission */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900">
              Journal Contributorship Statement
            </h3>
            <button
              onClick={handleCopyStatement}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Statement"}</span>
            </button>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">
            {formalStatement}
          </div>

          <p className="text-[11px] text-zinc-500">
            Format compliant with Elsevier, Springer Nature, Wiley, and PLOS ONE requirements. Paste directly into the manuscript submission portal.
          </p>
        </div>

        {/* Right: Authorship Conflict Prevention Checklist */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 pb-3 border-b border-zinc-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Authorship Charter &amp; COPE Ethics</span>
          </h3>

          <div className="space-y-3 text-xs text-zinc-700">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1.5">
              <span className="font-semibold text-zinc-900 block">
                The 4 COPE / ICMJE Criteria for Authorship:
              </span>
              <ul className="list-disc list-inside space-y-1 text-zinc-600 text-[11px]">
                <li>Substantial contributions to the conception, design, or acquisition of data.</li>
                <li>Drafting the work or revising it critically for important intellectual content.</li>
                <li>Final approval of the version to be published.</li>
                <li>Agreement to be accountable for all aspects of the research integrity.</li>
              </ul>
            </div>

            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Note on interdisciplinary teams: Senior authors in engineering typically sit last, whereas in mathematics authors are strictly alphabetical. Confirm conventions with co-authors in writing before drafting commences.
            </p>
          </div>
        </div>
      </div>

      {/* Add Author Modal */}
      {showAddAuthor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="font-bold text-base text-zinc-900">Add Co-Author</h3>
            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Full Name &amp; Title</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Jordan Sterling"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. j.sterling@university.edu"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Affiliation / Department</label>
                <input
                  type="text"
                  value={newAffiliation}
                  onChange={(e) => setNewAffiliation(e.target.value)}
                  placeholder="e.g. Department of Cognitive Science"
                  className="w-full border border-zinc-300 rounded-lg p-2 text-zinc-800"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddAuthor(false)}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAuthor}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs"
              >
                Add Contributor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
