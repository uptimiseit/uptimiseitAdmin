import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { solutions } from "@/db/schema";
import { eq } from "drizzle-orm";
import SolutionForm from "../../SolutionForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSolutionPage({ params }: Props) {
  // 1. Await params for Next.js 15 compatibility
  const { id } = await params;

  // 2. Fetch the existing node data from the database
  const solutionData = await db
    .select()
    .from(solutions)
    .where(eq(solutions.id, parseInt(id)))
    .limit(1);

  // 3. Trigger 404 if the node is not found
  if (!solutionData || solutionData.length === 0) {
    return notFound();
  }

  const solution = solutionData[0];

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 font-mono">
              Configuration_Mode::Active
            </span>
          </div>
          
          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
            Modify_Node <span className="text-slate-400 font-light">/</span> {solution.title}
          </h2>
          
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
            // Registry_ID: {solution.id.toString().padStart(4, '0')} 
{new Date(solution.updatedAt || new Date()).toLocaleDateString()}
          </p>
        </div>

        {/* The SolutionForm handles the 9-section JSON mapping. 
            Passing initialData allows the form to populate its state.
        */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <SolutionForm initialData={solution} />
        </div>

        {/* Technical Footer */}
        <div className="mt-10 flex justify-center">
            <p className="text-[9px] font-mono text-slate-300 uppercase tracking-[0.5em]">
              // Warning: Changes_To_Live_Nodes_Affect_Production_SEO
            </p>
        </div>
      </div>
    </div>
  );
}