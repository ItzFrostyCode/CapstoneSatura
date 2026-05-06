'use client';

import { useState } from 'react';
import { 
  Eye, 
  Building2, 
  Camera, 
  Palette, 
  Plus, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  AlertCircle,
  Link as LinkIcon 
} from 'lucide-react';

interface BrandingLink {
  id: number;
  label: string;
  url: string;
}

export function BrandingTab() {
  const [branding, setBranding] = useState({
    shopName: 'Davao Tailoring Shop',
    tagline: 'Precision in every stitch, excellence in every fit.',
    primaryColor: '#4f46e5',
    accentColor: '#10b981',
    establishedYear: '2022',
    address: '123 Tailor Street, Manila',
    phone: '+63 912 345 6789',
    links: [
      { id: 1, label: 'Facebook', url: 'https://facebook.com/davaotailor' },
      { id: 2, label: 'Instagram', url: 'https://instagram.com/davaotailor' }
    ] as BrandingLink[]
  });

  const addLink = () => {
    const newId = branding.links.length > 0 ? Math.max(...branding.links.map(l => l.id)) + 1 : 1;
    setBranding({
      ...branding,
      links: [...branding.links, { id: newId, label: 'New Link', url: '' }]
    });
  };

  const removeLink = (id: number) => {
    setBranding({
      ...branding,
      links: branding.links.filter(l => l.id !== id)
    });
  };

  const updateLink = (id: number, field: keyof BrandingLink, value: string) => {
    setBranding({
      ...branding,
      links: branding.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        {/* Shop Identity */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
            <Eye size={20} className="text-slate-400" /> Shop Identity
          </h3>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center text-slate-300 shadow-sm relative group overflow-hidden">
                <Building2 size={32} />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white cursor-pointer">
                  <Camera size={20} />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-[14px] font-black text-slate-900">Upload Shop Logo</div>
                <div className="text-[12px] text-slate-400 font-medium">SVG, PNG, or JPG (max 2MB)</div>
                <button className="mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-black hover:bg-slate-50 transition-all">Select Image</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
                <input 
                  type="text" 
                  value={branding.shopName}
                  onChange={(e) => setBranding({...branding, shopName: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                <input 
                  type="text" 
                  value={branding.tagline}
                  onChange={(e) => setBranding({...branding, tagline: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Description</label>
                <textarea 
                  rows={4}
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                  placeholder="Tell your customers about your craftsmanship..."
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-sm">
              Save Identity
            </button>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
            <Palette size={20} className="text-slate-400" /> Brand Colors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                  className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={branding.primaryColor} 
                  onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-black outline-none uppercase" 
                />
              </div>
            </div>
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={branding.accentColor}
                  onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                  className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={branding.accentColor} 
                  onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-black outline-none uppercase" 
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-sm">
              Save Colors
            </button>
          </div>
        </div>

        {/* Shop Links */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
              <LinkIcon size={20} className="text-slate-400" /> Shop Links
            </h3>
            <button 
              onClick={addLink}
              className="flex items-center gap-2 text-[12px] font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
            >
              <Plus size={16} /> Add Link
            </button>
          </div>
          <div className="space-y-4">
            {branding.links.map((link) => (
              <div key={link.id} className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <div className="flex-1 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus-within:bg-white focus-within:border-indigo-200 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <ExternalLink size={14} />
                  </div>
                  <input 
                    type="text" 
                    value={link.label}
                    onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                    placeholder="Platform (e.g. Website)" 
                    className="w-24 bg-transparent border-r border-slate-200 text-[13px] font-bold outline-none placeholder:text-slate-400 pr-2" 
                  />
                  <input 
                    type="text" 
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    placeholder="https://..." 
                    className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-slate-400" 
                  />
                </div>
                <button 
                  onClick={() => removeLink(link.id)}
                  className="w-12 h-14 rounded-2xl flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {branding.links.length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-[13px] font-medium text-slate-400">No links added yet. Add your social media or website.</p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-sm">
              Save Links
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Column */}
      <div className="space-y-6">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Live Profile Preview</h4>
            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Updating
            </span>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-100/50">
            {/* Mock Profile UI */}
            <div className="h-24" style={{ backgroundColor: branding.primaryColor }} />
            <div className="px-8 pb-8 -mt-10">
              <div className="w-20 h-20 rounded-3xl bg-white p-1 border-4 border-white shadow-xl mb-4 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-2xl">
                  {branding.shopName.charAt(0)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight leading-none">{branding.shopName}</h2>
                <div className="bg-indigo-600 text-white p-1 rounded-full">
                  <CheckCircle2 size={10} />
                </div>
              </div>
              <p className="text-[12px] font-bold text-slate-500 mb-4">{branding.tagline}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wider">Premium Shop</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wider">Est. {branding.establishedYear}</span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wider">1 Branch</span>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Building2 size={14} />
                  <span className="text-[12px] font-medium">{branding.address}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Smartphone size={14} />
                  <span className="text-[12px] font-medium">{branding.phone}</span>
                </div>
              </div>
              
              <button 
                className="w-full mt-8 h-12 rounded-2xl text-white text-[13px] font-black shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Visit Public Store
              </button>
            </div>
          </div>
          
          <div className="mt-6 p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-900/20">
            <h4 className="text-[15px] font-black mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-400" /> Pro Tip
            </h4>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
              Your public profile is what customers see when they book appointments online. A strong tagline and brand colors increase conversion by 24%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
