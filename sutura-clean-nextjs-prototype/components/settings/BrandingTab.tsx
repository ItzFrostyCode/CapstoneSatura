'use client';

import { useState, useEffect } from 'react';
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
  Link as LinkIcon,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

interface BrandingLink {
  id: number;
  label: string;
  url: string;
}

export function BrandingTab() {
  const { currentShop, updateShopBranding, pushNotification } = useERPStore();
  
  const [branding, setBranding] = useState({
    shopName: currentShop?.shopName || '',
    tagline: currentShop?.tagline || 'Precision in every stitch, excellence in every fit.',
    primaryColor: currentShop?.themeColor || '#1e3a8a',
    accentColor: currentShop?.accentColor || '#10b981',
    logoUrl: currentShop?.logoUrl || '',
    bannerUrl: currentShop?.bannerUrl || '',
    description: currentShop?.description || 'A legacy of craftsmanship and style. We specialize in bespoke formal wear and traditional attire.',
    links: [
      { id: 1, label: 'Facebook', url: 'https://facebook.com/davaotailor' },
      { id: 2, label: 'Instagram', url: 'https://instagram.com/davaotailor' }
    ] as BrandingLink[]
  });

  // Sync state if currentShop changes
  useEffect(() => {
    if (currentShop) {
      setBranding(prev => ({
        ...prev,
        shopName: currentShop.shopName,
        tagline: currentShop.tagline || prev.tagline,
        primaryColor: currentShop.themeColor || prev.primaryColor,
        accentColor: currentShop.accentColor || prev.accentColor,
        logoUrl: currentShop.logoUrl || prev.logoUrl,
        bannerUrl: currentShop.bannerUrl || prev.bannerUrl,
        description: currentShop.description || prev.description,
      }));
    }
  }, [currentShop]);

  const handleSave = () => {
    updateShopBranding({
      shopName: branding.shopName,
      tagline: branding.tagline,
      themeColor: branding.primaryColor,
      accentColor: branding.accentColor,
      logoUrl: branding.logoUrl,
      bannerUrl: branding.bannerUrl,
      description: branding.description
    });
    pushNotification('Shop branding updated successfully!', 'success');
  };

  const updateLink = (id: number, field: keyof BrandingLink, value: string) => {
    setBranding({
      ...branding,
      links: branding.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  const removeLink = (id: number) => {
    setBranding({
      ...branding,
      links: branding.links.filter(l => l.id !== id)
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* ── HEADER ── */}
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-[18px] font-bold text-slate-900 leading-none">Shop Branding</h3>
        <p className="text-[14px] text-slate-500 mt-2">Customize your storefront identity and brand presence</p>
      </div>

      <div className="flex flex-col xl:flex-row p-8 gap-12">
        {/* ── LEFT COLUMN: BRANDING FORM ── */}
        <div className="flex-1 space-y-10">
          
          {/* LOGO & BANNER UPLOAD */}
          <div className="space-y-8">
            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
              <label className="text-[14px] text-slate-500 pt-3 text-right">Shop Logo</label>
              <div className="flex items-center gap-6">
                 <div className="w-[80px] h-[80px] rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-400 font-black text-2xl">{branding.shopName.charAt(0)}</div>
                    )}
                 </div>
                 <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Logo Image URL"
                      value={branding.logoUrl}
                      onChange={(e) => setBranding({...branding, logoUrl: e.target.value})}
                      className="w-full h-9 px-3 border border-slate-200 rounded-[4px] text-[12px] outline-none"
                    />
                    <p className="text-[11px] text-slate-400">Profile picture for your shop (Recommended: 512x512)</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-start gap-4">
              <label className="text-[14px] text-slate-500 pt-3 text-right">Cover Photo</label>
              <div className="space-y-3">
                 <div className="w-full h-[120px] rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden relative shadow-inner">
                    {branding.bannerUrl ? (
                      <img src={branding.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-300">
                        <ImageIcon size={32} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Cover Photo</span>
                      </div>
                    )}
                 </div>
                 <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Cover Background URL"
                      value={branding.bannerUrl}
                      onChange={(e) => setBranding({...branding, bannerUrl: e.target.value})}
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-[4px] text-[12px] outline-none"
                    />
                 </div>
                 <p className="text-[11px] text-slate-400">Landscape background for your storefront (Recommended: 1200x400)</p>
              </div>
            </div>
          </div>

          {/* SHOP NAME */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Shop Name</label>
            <input 
              type="text" 
              value={branding.shopName}
              onChange={(e) => setBranding({...branding, shopName: e.target.value})}
              className="w-full h-12 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400 transition-all" 
            />
          </div>

          {/* TAGLINE */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Tagline</label>
            <input 
              type="text" 
              value={branding.tagline}
              onChange={(e) => setBranding({...branding, tagline: e.target.value})}
              className="w-full h-12 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400 transition-all" 
              placeholder="e.g. Precision in every stitch"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label className="text-[14px] text-slate-500 pt-3 text-right">Shop Description</label>
            <textarea 
              rows={4}
              value={branding.description}
              onChange={(e) => setBranding({...branding, description: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400 transition-all resize-none"
              placeholder="Tell your customers about your craftsmanship..."
            />
          </div>

          {/* BRAND COLORS */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label className="text-[14px] text-slate-500 pt-3 text-right">Brand Colors</label>
            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Theme Primary</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-[4px] border border-slate-200 cursor-pointer shadow-sm shrink-0"
                    style={{ backgroundColor: branding.primaryColor }}
                  />
                  <input 
                    type="text" 
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                    className="w-28 h-10 px-3 border border-slate-200 rounded-[4px] text-[13px] font-mono outline-none uppercase" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Brand Accent</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-[4px] border border-slate-200 cursor-pointer shadow-sm shrink-0"
                    style={{ backgroundColor: branding.accentColor }}
                  />
                  <input 
                    type="text" 
                    value={branding.accentColor}
                    onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                    className="w-28 h-10 px-3 border border-slate-200 rounded-[4px] text-[13px] font-mono outline-none uppercase" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
            <button 
              onClick={handleSave}
              className="w-[150px] h-[48px] bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-[2px] text-[14px] font-bold transition-all shadow-sm active:scale-95"
            >
              Save Branding
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: STORE PREVIEW ── */}
        <div className="w-full xl:w-[380px] space-y-6">
           <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Storefront Preview</div>
           
           <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-2xl shadow-slate-200/50">
              {/* BANNER PREVIEW */}
              <div className="h-32 w-full bg-slate-100 relative">
                {branding.bannerUrl ? (
                  <img src={branding.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: branding.primaryColor }} />
                )}
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="px-6 pb-6 relative">
                 {/* LOGO OVERLAY */}
                 <div className="w-20 h-20 rounded-[8px] bg-white border-4 border-white shadow-lg -mt-10 flex items-center justify-center overflow-hidden mb-4 relative z-10">
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-900 font-black text-2xl">{branding.shopName.charAt(0)}</div>
                    )}
                 </div>
                 
                 <div className="flex items-center gap-2 mb-1">
                    <div className="text-[18px] font-bold text-slate-900">{branding.shopName || 'Shop Name'}</div>
                    <CheckCircle2 size={16} className="text-blue-500" />
                 </div>
                 <div className="text-[12px] text-slate-500 mb-4 font-medium">{branding.tagline}</div>
                 
                 <div className="flex gap-2 mb-6">
                    <div 
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ backgroundColor: `${branding.accentColor}15`, color: branding.accentColor }}
                    >
                      Verified Shop
                    </div>
                    <div className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold text-slate-400 uppercase">Est. 2022</div>
                 </div>

                 <button 
                   className="w-full h-11 rounded-[4px] text-white text-[14px] font-bold transition-all shadow-lg active:scale-95"
                   style={{ backgroundColor: branding.primaryColor }}
                 >
                   Visit Store
                 </button>
              </div>
           </div>

           <div className="p-5 bg-slate-900 rounded-[12px] text-white border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center">
                    <AlertCircle size={14} className="text-amber-400" />
                 </div>
                 <span className="text-[13px] font-bold tracking-tight">Branding Intelligence</span>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                Shops with high-quality banners and logos receive up to <span className="text-white font-bold">40% more consultations</span>. Professional visuals build instant trust.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
