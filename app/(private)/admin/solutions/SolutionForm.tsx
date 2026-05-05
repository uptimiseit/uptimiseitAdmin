"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// React Icons Imports
import { 
  HiOutlineRocketLaunch, HiOutlineCpuChip, HiOutlineCube, 
  HiOutlineShieldCheck, HiOutlineBolt, HiOutlineCommandLine,
  HiOutlineSquares2X2, HiOutlineTrash, HiOutlinePlus,
  HiOutlineCog6Tooth, HiOutlineCheckBadge, HiOutlineArrowTopRightOnSquare,
  HiOutlinePresentationChartLine, HiOutlineLightBulb, HiOutlineBeaker
} from "react-icons/hi2";
import { RiRobotLine, RiDatabase2Line, RiCodeSSlashLine, RiSave3Line } from "react-icons/ri";
import { saveSolution } from "@/lib/actions/solution.actions";
import { Globe } from "lucide-react";

// 1. Icon Registry for Visual Selection
const ICON_OPTIONS = [
  { name: "Rocket", icon: HiOutlineRocketLaunch },
  { name: "CPU", icon: HiOutlineCpuChip },
  { name: "Bot", icon: RiRobotLine },
  { name: "Shield", icon: HiOutlineShieldCheck },
  { name: "Database", icon: RiDatabase2Line },
  { name: "Code", icon: RiCodeSSlashLine },
  { name: "Zap", icon: HiOutlineBolt },
  { name: "Grid", icon: HiOutlineSquares2X2 },
  { name: "Badge", icon: HiOutlineCheckBadge },
  { name: "Chart", icon: HiOutlinePresentationChartLine },
  { name: "Bulb", icon: HiOutlineLightBulb },
  { name: "Lab", icon: HiOutlineBeaker },
  { name: "Website", icon: Globe },
];

export default function SolutionForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("meta");

  // 2. Full State following your exact page structure
  const [formData, setFormData] = useState(initialData || {
    title: "",
    slug: "",
    description: "",
    icon: "Rocket",
    content: {
      hero: { badge: "", heading: "", accent: "", description: "" },
      challenges: [{ title: "", desc: "", icon: "Shield" }],
      approach: { heading: "", description: "", points: [""] },
      buildItems: [{ title: "", desc: "", icon: "Bot" }],
      techStack: ["Next.js", "React", "Node.js", "PostgreSQL"],
      process: [
        { step: "1. Scope", title: "Feature Scoping", desc: "" },
        { step: "2. Design", title: "UX/UI Prototyping", desc: "" },
        { step: "3. Build", title: "Sprint Development", desc: "" },
        { step: "4. Launch", title: "Deploy & Monitor", desc: "" }
      ],
      benefits: [{ title: "Investor-Ready", desc: "", icon: "Chart" }],
      edge: { heading: "The Startup Edge", description: "", features: [{ title: "", desc: "" }] },
      cta: { heading: "Stop Dreaming.", accent: "Start Building.", description: "" }
    }
  });

  const updateContent = (section: string, value: any) => {
    setFormData({ ...formData, content: { ...formData.content, [section]: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveSolution(formData);
    if (res.success) router.push("/admin/solutions");
    setLoading(false);
  };

  // 3. Reusable Components
  const IconSelector = ({ value, onChange }: any) => (
    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
      {ICON_OPTIONS.map((opt) => (
        <button
          key={opt.name}
          type="button"
          onClick={() => onChange(opt.name)}
          className={`p-2 rounded-lg transition-all ${
            value === opt.name ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-200"
          }`}
        >
          <opt.icon size={18} />
        </button>
      ))}
    </div>
  );

  const TabBtn = ({ id, label, icon: Icon }: any) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl ${
        activeTab === id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
      
      {/* --- STICKY HEADER --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6 mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <HiOutlineCog6Tooth size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-900">Solution_Architect</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">// Complete_Node_Config</p>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-all shadow-2xl"
        >
          {loading ? "Syncing..." : <><RiSave3Line size={18} /> Commit_Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <div className="lg:col-span-1 space-y-2 h-fit sticky top-32">
          <TabBtn id="meta" label="Identity" icon={HiOutlineCommandLine} />
          <TabBtn id="hero" label="Hero Section" icon={HiOutlineRocketLaunch} />
          <TabBtn id="strategy" label="Strategy & Why" icon={HiOutlineShieldCheck} />
          <TabBtn id="delivery" label="Process & Flow" icon={HiOutlineBolt} />
          <TabBtn id="edge" label="Success Edge" icon={HiOutlineCheckBadge} />
          <TabBtn id="stack" label="Tech & CTA" icon={RiCodeSSlashLine} />
        </div>

        {/* --- MAIN FORM CONTENT --- */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-[600px]">
          
          {/* TAB 1: IDENTITY */}
          {activeTab === "meta" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-black text-blue-600 uppercase italic tracking-widest">// Submenu_Config</h3>
              <div className="grid gap-6">
                <input className="admin-input-simple" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Display Title" />
                <div className="grid grid-cols-2 gap-6">
                  <input className="admin-input-simple font-mono" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="URL Slug" />
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Submenu Icon</p>
                    <IconSelector value={formData.icon} onChange={(val: string) => setFormData({...formData, icon: val})} />
                  </div>
                </div>
                <textarea className="admin-input-simple h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Submenu Snippet Description..." />
              </div>
            </div>
          )}

          {/* TAB 2: HERO */}
          {activeTab === "hero" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-sm font-black text-orange-600 uppercase italic tracking-widest">// Hero_Section</h3>
              <div className="grid gap-6">
                <input placeholder="Badge (e.g. For Founders)" className="admin-input-simple" value={formData.content.hero.badge} onChange={(e) => updateContent('hero', {...formData.content.hero, badge: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Heading Main" className="admin-input-simple font-black" value={formData.content.hero.heading} onChange={(e) => updateContent('hero', {...formData.content.hero, heading: e.target.value})} />
                  <input placeholder="Heading Accent" className="admin-input-simple font-black text-orange-600" value={formData.content.hero.accent} onChange={(e) => updateContent('hero', {...formData.content.hero, accent: e.target.value})} />
                </div>
                <textarea placeholder="Hero Description" className="admin-input-simple h-32" value={formData.content.hero.description} onChange={(e) => updateContent('hero', {...formData.content.hero, description: e.target.value})} />
              </div>
            </div>
          )}

          {/* TAB 3: STRATEGY (Challenges & Approach) */}
          {activeTab === "strategy" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              {/* Challenges */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// Why_Fail_Registry</h4>
                {formData.content.challenges.map((item: any, i: number) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <IconSelector value={item.icon} onChange={(val: string) => {
                        const newC = [...formData.content.challenges];
                        newC[i].icon = val;
                        updateContent('challenges', newC);
                      }} />
                      <button type="button" onClick={() => updateContent('challenges', formData.content.challenges.filter((_:any, idx:number) => idx !== i))}><HiOutlineTrash size={18} /></button>
                    </div>
                    <input placeholder="Title" className="admin-input-simple font-bold" value={item.title} onChange={(e) => {
                      const newC = [...formData.content.challenges];
                      newC[i].title = e.target.value;
                      updateContent('challenges', newC);
                    }} />
                    <textarea placeholder="Description" className="admin-input-simple h-20 text-xs" value={item.desc} onChange={(e) => {
                      const newC = [...formData.content.challenges];
                      newC[i].desc = e.target.value;
                      updateContent('challenges', newC);
                    }} />
                  </div>
                ))}
                <button type="button" onClick={() => updateContent('challenges', [...formData.content.challenges, {title: "", desc: "", icon: "Shield"}])} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><HiOutlinePlus /> Add_Challenge</button>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY (Build Items & Process) */}
          {activeTab === "delivery" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              {/* Build Items */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// Capability_Modules</h4>
                {formData.content.buildItems.map((item: any, i: number) => (
                  <div key={i} className="p-6 border border-slate-100 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <IconSelector value={item.icon} onChange={(val: string) => {
                        const newB = [...formData.content.buildItems];
                        newB[i].icon = val;
                        updateContent('buildItems', newB);
                      }} />
                      <button type="button" onClick={() => updateContent('buildItems', formData.content.buildItems.filter((_:any, idx:number) => idx !== i))}><HiOutlineTrash size={18}/></button>
                    </div>
                    <input placeholder="Capability Title" className="admin-input-simple font-bold" value={item.title} onChange={(e) => {
                      const newB = [...formData.content.buildItems];
                      newB[i].title = e.target.value;
                      updateContent('buildItems', newB);
                    }} />
                  </div>
                ))}
                <button type="button" onClick={() => updateContent('buildItems', [...formData.content.buildItems, {title: "", desc: "", icon: "Bot"}])} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2"><HiOutlinePlus /> Add_Module</button>
              </div>

              {/* Process */}
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// Delivery_Protocol</h4>
                {formData.content.process.map((p: any, i: number) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl space-y-3">
                    <input placeholder="Step (e.g. 1. Scope)" className="admin-input-simple font-mono text-xs" value={p.step} onChange={(e) => {
                      const newP = [...formData.content.process];
                      newP[i].step = e.target.value;
                      updateContent('process', newP);
                    }} />
                    <input placeholder="Title" className="admin-input-simple" value={p.title} onChange={(e) => {
                      const newP = [...formData.content.process];
                      newP[i].title = e.target.value;
                      updateContent('process', newP);
                    }} />
                    <textarea placeholder="Description" className="admin-input-simple h-20 text-xs" value={p.desc} onChange={(e) => {
                      const newP = [...formData.content.process];
                      newP[i].desc = e.target.value;
                      updateContent('process', newP);
                    }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDGE & SUCCESS */}
          {activeTab === "edge" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// Startup_Success_Benefits</h4>
                {formData.content.benefits.map((b: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center">
                    <IconSelector value={b.icon} onChange={(val: string) => {
                      const newB = [...formData.content.benefits];
                      newB[i].icon = val;
                      updateContent('benefits', newB);
                    }} />
                    <input placeholder="Benefit Title" className="admin-input-simple flex-1" value={b.title} onChange={(e) => {
                      const newB = [...formData.content.benefits];
                      newB[i].title = e.target.value;
                      updateContent('benefits', newB);
                    }} />
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// The_Startup_Edge</h4>
                <input placeholder="Edge Heading" className="admin-input-simple mb-4" value={formData.content.edge.heading} onChange={(e) => updateContent('edge', {...formData.content.edge, heading: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.content.edge.features.map((f: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl">
                      <input placeholder="Feature Title" className="admin-input-simple font-bold" value={f.title} onChange={(e) => {
                        const newF = [...formData.content.edge.features];
                        newF[i].title = e.target.value;
                        updateContent('edge', {...formData.content.edge, features: newF});
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STACK & CTA */}
          {activeTab === "stack" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// Technology_Graph</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.content.techStack.map((t: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                      <input className="bg-transparent border-none outline-none text-xs font-bold w-28" value={t} onChange={(e) => {
                        const newT = [...formData.content.techStack];
                        newT[i] = e.target.value;
                        updateContent('techStack', newT);
                      }} />
                      <button type="button" onClick={() => updateContent('techStack', formData.content.techStack.filter((_:any, idx:number) => idx !== i))}><HiOutlineTrash size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => updateContent('techStack', [...formData.content.techStack, ""])} className="px-5 py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase">+ Add_Tech</button>
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">// End_Protocol_CTA</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="CTA Heading" className="admin-input-simple" value={formData.content.cta.heading} onChange={(e) => updateContent('cta', {...formData.content.cta, heading: e.target.value})} />
                  <input placeholder="CTA Accent" className="admin-input-simple text-blue-600" value={formData.content.cta.accent} onChange={(e) => updateContent('cta', {...formData.content.cta, accent: e.target.value})} />
                </div>
                <textarea placeholder="CTA Subtext" className="admin-input-simple h-24" value={formData.content.cta.description} onChange={(e) => updateContent('cta', {...formData.content.cta, description: e.target.value})} />
              </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
}