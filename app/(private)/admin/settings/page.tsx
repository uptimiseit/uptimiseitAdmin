// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Save,
//   Building2,
//   Mail,
//   Globe,
//   Link as LinkIcon,
//   AlertTriangle,
//   Loader2,
//   Image as ImageIcon,
//   Upload,
// } from "lucide-react";

// // Server Actions
// import {
//   getGlobalSettings,
//   upsertGlobalSettings,
// } from "@/lib/actions/settings.actions";

// export default function AdminSettingsPage() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // --- STATE ---
//   const [settings, setSettings] = useState({
//     companyName: "Uptimise IT",
//     siteUrl: "https://uptimiseit.com",
//     logoUrl: "",
//     faviconUrl: "",
//     supportEmail: "",
//     salesEmail: "",
//     contactPhone: "",
//     address: "",
//     maintenanceMode: false,
//   });

//   const [socialLinks, setSocialLinks] = useState({
//     linkedin: "",
//     twitter: "",
//     instagram: "",
//     github: "",
//   });

//   // --- LOAD DATA ---
//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     setIsLoading(true);
//     const res = await getGlobalSettings();

//     if (res.success && res.data) {
//       setSettings({
//         companyName: res.data.companyName || "Uptimise IT",
//         siteUrl: res.data.siteUrl || "https://uptimiseit.com",
//         logoUrl: res.data.logoUrl || "",
//         faviconUrl: res.data.faviconUrl || "",
//         supportEmail: res.data.supportEmail || "",
//         salesEmail: res.data.salesEmail || "",
//         contactPhone: res.data.contactPhone || "",
//         address: res.data.address || "",
//         maintenanceMode: res.data.maintenanceMode || false,
//       });

//       if (res.data.socialLinks) {
//         setSocialLinks(res.data.socialLinks as any);
//       }
//     }
//     setIsLoading(false);
//   };

//   // --- HANDLERS ---
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setSettings({ ...settings, [e.target.name]: e.target.value });
//   };

//   const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
//   };

//   // --- IMAGE UPLOAD HANDLER ---
//   const handleImageUpload = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: "logoUrl" | "faviconUrl"
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Convert image to Base64 to store in database and preview instantly
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setSettings((prev) => ({ ...prev, [field]: reader.result as string }));
//     };
//     reader.readAsDataURL(file);

//     /* * NOTE FOR PRODUCTION: 
//      * If images are too large, Base64 can slow down the database. 
//      * In the future, you can replace the lines above with an API call to 
//      * upload the file to S3 / Cloudinary / Uploadthing, and then save the returned URL.
//      */
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);

//     try {
//       const payload = {
//         ...settings,
//         socialLinks, 
//       };

//       const res = await upsertGlobalSettings(payload);

//       if (res.success) {
//         alert("Global settings saved successfully!");
//       } else {
//         alert("Failed to save settings.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("An unexpected error occurred.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400">
//         <Loader2 size={32} className="animate-spin text-indigo-500" />
//         <p className="font-bold">Loading System Configurations...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pb-24">
      
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
//             <Globe className="text-indigo-600" size={24} /> Global Site Settings
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Manage your brand identity, contact information, and global
//             configurations.
//           </p>
//         </div>
//         <button
//           onClick={handleSave}
//           disabled={isSaving}
//           className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
//         >
//           {isSaving ? (
//             <Loader2 size={18} className="animate-spin" />
//           ) : (
//             <Save size={18} />
//           )}
//           {isSaving ? "Saving..." : "Save All Settings"}
//         </button>
//       </div>

//       <form onSubmit={handleSave} className="space-y-8">
        
//         {/* SECTION 1: Brand Identity */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
//             <Building2 size={18} className="text-indigo-500" />
//             <h2 className="font-bold text-slate-900">Brand Identity</h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Company Name *
//               </label>
//               <input
//                 type="text"
//                 name="companyName"
//                 required
//                 value={settings.companyName}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
            
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Main Website URL *
//               </label>
//               <input
//                 type="url"
//                 name="siteUrl"
//                 required
//                 value={settings.siteUrl}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>

//             {/* --- NEW LOGO UPLOAD COMPONENT --- */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
//                 <ImageIcon size={14} className="text-slate-400" /> Company Logo
//               </label>
//               <div className="flex items-center gap-4">
//                 {settings.logoUrl ? (
//                   <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img src={settings.logoUrl} alt="Logo Preview" className="h-full w-full object-contain p-2" />
//                   </div>
//                 ) : (
//                   <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
//                     <ImageIcon className="text-slate-300" size={24} />
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e, "logoUrl")}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
//                 />
//               </div>
//             </div>

//             {/* --- NEW FAVICON UPLOAD COMPONENT --- */}
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
//                 <ImageIcon size={14} className="text-slate-400" /> Favicon (Browser Tab Icon)
//               </label>
//               <div className="flex items-center gap-4">
//                 {settings.faviconUrl ? (
//                   <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img src={settings.faviconUrl} alt="Favicon Preview" className="h-full w-full object-contain p-3" />
//                   </div>
//                 ) : (
//                   <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
//                     <ImageIcon className="text-slate-300" size={24} />
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleImageUpload(e, "faviconUrl")}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
//                 />
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* SECTION 2: Contact Information */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
//             <Mail size={18} className="text-emerald-500" />
//             <h2 className="font-bold text-slate-900">Contact Information</h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Support / General Email
//               </label>
//               <input
//                 type="email"
//                 name="supportEmail"
//                 value={settings.supportEmail}
//                 onChange={handleChange}
//                 placeholder="info@uptimiseit.com"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Sales / Leads Email
//               </label>
//               <input
//                 type="email"
//                 name="salesEmail"
//                 value={settings.salesEmail}
//                 onChange={handleChange}
//                 placeholder="sales@uptimiseit.com"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5 md:col-span-2">
//               <label className="text-sm font-bold text-slate-800">
//                 Contact Phone Number
//               </label>
//               <input
//                 type="text"
//                 name="contactPhone"
//                 value={settings.contactPhone}
//                 onChange={handleChange}
//                 placeholder="+1 (555) 123-4567"
//                 className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5 md:col-span-2">
//               <label className="text-sm font-bold text-slate-800">
//                 Physical Address / Headquarters
//               </label>
//               <textarea
//                 name="address"
//                 rows={3}
//                 value={settings.address}
//                 onChange={handleChange}
//                 placeholder="123 Tech Park, Suite 400..."
//                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 resize-y transition-all"
//               ></textarea>
//             </div>
//           </div>
//         </div>

//         {/* SECTION 3: Social Media Links */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
//             <LinkIcon size={18} className="text-sky-500" />
//             <h2 className="font-bold text-slate-900">Social Media Profiles</h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 LinkedIn Profile URL
//               </label>
//               <input
//                 type="url"
//                 name="linkedin"
//                 value={socialLinks.linkedin}
//                 onChange={handleSocialChange}
//                 placeholder="https://linkedin.com/company/uptimiseit"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Twitter / X URL
//               </label>
//               <input
//                 type="url"
//                 name="twitter"
//                 value={socialLinks.twitter}
//                 onChange={handleSocialChange}
//                 placeholder="https://twitter.com/uptimiseit"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 Instagram URL
//               </label>
//               <input
//                 type="url"
//                 name="instagram"
//                 value={socialLinks.instagram}
//                 onChange={handleSocialChange}
//                 placeholder="https://instagram.com/uptimiseit"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-sm font-bold text-slate-800">
//                 GitHub Organization URL
//               </label>
//               <input
//                 type="url"
//                 name="github"
//                 value={socialLinks.github}
//                 onChange={handleSocialChange}
//                 placeholder="https://github.com/uptimiseit"
//                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
//               />
//             </div>
//           </div>
//         </div>

//         {/* SECTION 4: Danger Zone / System */}
//         <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-red-100 bg-red-50 flex items-center gap-2">
//             <AlertTriangle size={18} className="text-red-500" />
//             <h2 className="font-bold text-red-900">System Configuration</h2>
//           </div>
//           <div className="p-6">
//             <label className="flex items-start gap-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 checked={settings.maintenanceMode}
//                 onChange={(e) =>
//                   setSettings({
//                     ...settings,
//                     maintenanceMode: e.target.checked,
//                   })
//                 }
//                 className="w-5 h-5 mt-0.5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
//               />
//               <div>
//                 <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
//                   Enable Maintenance Mode
//                 </p>
//                 <p className="text-xs text-slate-500 mt-0.5">
//                   When active, all public visitors will see a "Site under
//                   construction" screen. You will still be able to access the
//                   admin panel.
//                 </p>
//               </div>
//             </label>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }


// settings 

"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Building2,
  Mail,
  Globe,
  Link as LinkIcon,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

// Server Actions
import {
  getGlobalSettings,
  upsertGlobalSettings,
} from "@/lib/actions/settings.actions";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track which specific image is uploading for targeted UI spinners
  const [uploadingField, setUploadingField] = useState<"logoUrl" | "faviconUrl" | null>(null);

  // --- STATE ---
  const [settings, setSettings] = useState({
    companyName: "Uptimise IT",
    siteUrl: "https://uptimiseit.com",
    logoUrl: "",
    faviconUrl: "",
    supportEmail: "",
    salesEmail: "",
    contactPhone: "",
    address: "",
    maintenanceMode: false,
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    github: "",
  });

  // --- LOAD DATA ---
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await getGlobalSettings();

    if (res.success && res.data) {
      setSettings({
        companyName: res.data.companyName || "Uptimise IT",
        siteUrl: res.data.siteUrl || "https://uptimiseit.com",
        logoUrl: res.data.logoUrl || "",
        faviconUrl: res.data.faviconUrl || "",
        supportEmail: res.data.supportEmail || "",
        salesEmail: res.data.salesEmail || "",
        contactPhone: res.data.contactPhone || "",
        address: res.data.address || "",
        maintenanceMode: res.data.maintenanceMode || false,
      });

      if (res.data.socialLinks) {
        setSocialLinks(res.data.socialLinks as any);
      }
    }
    setIsLoading(false);
  };

  // --- HANDLERS ---
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  // --- AWS S3 IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "faviconUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instantly show a local preview and trigger the specific loader
    const objectUrl = URL.createObjectURL(file);
    setSettings((prev) => ({ ...prev, [field]: objectUrl }));
    setUploadingField(field);

    try {
      // 2. Fetch Presigned URL
      const res = await fetch(`/api/upload-url?file=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      
      if (!res.ok) throw new Error("Failed to get upload credentials");
      const { signedUrl, cdnUrl } = await res.json();

      // 3. Upload directly to AWS S3
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type, 
        },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload to S3");

      // 4. Success! Save the final CDN URL to state
      setSettings((prev) => ({ ...prev, [field]: cdnUrl }));
      
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload image. Check your AWS credentials.");
      // Clear the preview if it fails
      setSettings((prev) => ({ ...prev, [field]: "" }));
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...settings,
        socialLinks, 
      };

      const res = await upsertGlobalSettings(payload);

      if (res.success) {
        alert("Global settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="font-bold">Loading System Configurations...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="text-indigo-600" size={24} /> Global Site Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your brand identity, contact information, and global configurations.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Saving..." : "Save All Settings"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Brand Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Building2 size={18} className="text-indigo-500" />
            <h2 className="font-bold text-slate-900">Brand Identity</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Company Name *</label>
              <input
                type="text"
                name="companyName"
                required
                value={settings.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Main Website URL *</label>
              <input
                type="url"
                name="siteUrl"
                required
                value={settings.siteUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* --- LOGO UPLOAD COMPONENT --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={14} className="text-slate-400" /> Company Logo
              </label>
              <div className="flex items-center gap-4">
                {settings.logoUrl ? (
                  <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                    {uploadingField === "logoUrl" && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                        <Loader2 size={20} className="animate-spin text-indigo-600" />
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={settings.logoUrl} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <ImageIcon className="text-slate-300" size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logoUrl")}
                  disabled={uploadingField !== null}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

            {/* --- FAVICON UPLOAD COMPONENT --- */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={14} className="text-slate-400" /> Favicon (Browser Tab Icon)
              </label>
              <div className="flex items-center gap-4">
                {settings.faviconUrl ? (
                  <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                    {uploadingField === "faviconUrl" && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                        <Loader2 size={20} className="animate-spin text-indigo-600" />
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={settings.faviconUrl} alt="Favicon Preview" className="h-full w-full object-contain p-3" />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <ImageIcon className="text-slate-300" size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "faviconUrl")}
                  disabled={uploadingField !== null}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Mail size={18} className="text-emerald-500" />
            <h2 className="font-bold text-slate-900">Contact Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Support / General Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="info@uptimiseit.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Sales / Leads Email</label>
              <input
                type="email"
                name="salesEmail"
                value={settings.salesEmail}
                onChange={handleChange}
                placeholder="sales@uptimiseit.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-slate-800">Contact Phone Number</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-slate-800">Physical Address / Headquarters</label>
              <textarea
                name="address"
                rows={3}
                value={settings.address}
                onChange={handleChange}
                placeholder="123 Tech Park, Suite 400..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 resize-y transition-all"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 3: Social Media Links */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <LinkIcon size={18} className="text-sky-500" />
            <h2 className="font-bold text-slate-900">Social Media Profiles</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin"
                value={socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/company/uptimiseit"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Twitter / X URL</label>
              <input
                type="url"
                name="twitter"
                value={socialLinks.twitter}
                onChange={handleSocialChange}
                placeholder="https://twitter.com/uptimiseit"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={socialLinks.instagram}
                onChange={handleSocialChange}
                placeholder="https://instagram.com/uptimiseit"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-800">GitHub Organization URL</label>
              <input
                type="url"
                name="github"
                value={socialLinks.github}
                onChange={handleSocialChange}
                placeholder="https://github.com/uptimiseit"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Danger Zone / System */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-red-100 bg-red-50 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="font-bold text-red-900">System Configuration</h2>
          </div>
          <div className="p-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked,
                  })
                }
                className="w-5 h-5 mt-0.5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Enable Maintenance Mode
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  When active, all public visitors will see a "Site under construction" screen. You will still be able to access the admin panel.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}