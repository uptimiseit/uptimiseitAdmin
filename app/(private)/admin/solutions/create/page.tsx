// import SolutionForm from "../SolutionForm";

import SolutionForm from "../SolutionForm";

export default function CreateSolutionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 py-20">
      <div className="mb-12 space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
          Initialize_New_Node
        </h2>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
          // Deployment_Protocol::v1.0
        </p>
      </div>
      
      {/* This calls the CRUD form you created for the 9 sections */}
      <SolutionForm />
    </div>
  );
}