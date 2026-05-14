'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Scissors, MapPin, Star, Clock, MessageSquare, 
  Calendar, CheckCircle, ArrowRight, ShieldCheck, 
  Ruler, LayoutGrid, Image as ImageIcon, Box
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { ShopInquiryModal } from '@/components/shared/ShopInquiryModal';
import { BookConsultationModal } from '@/components/shared/BookConsultationModal';

// MOCK INVENTORY (Simulating the backend logic where type === 'FINISHED_GOOD' && is_sellable === true)
const PREMIUM_INVENTORY = [
  { id: 1, name: "Modern Piña Barong", category: "Formalwear", price: "₱4,500", sizes: ["M", "L", "XL"], stock: 3, img: "/assets/flash-promo-barong.png", description: "Handwoven piña fabric with intricate modern embroidery. Ready for fitting." },
  { id: 2, name: "Midnight Bespoke Suit", category: "Suits", price: "₱15,000", sizes: ["Customizable"], stock: 1, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", description: "Premium wool blend. Includes one free major alteration session." },
  { id: 3, name: "Neo-Filipiniana Dress", category: "Gowns", price: "₱8,500", sizes: ["S", "M"], stock: 2, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", description: "A contemporary take on the classic Filipiniana, featuring butterfly sleeves." },
];

export default function PremiumShopProfile() {
  const router = useRouter();
  const params = useParams();
  const { currentShop } = useERPStore();
  
  const [activeTab, setActiveTab] = useState('premade'); // 'about', 'portfolio', 'premade'
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Inherit brand colors
  const primaryColor = currentShop?.themeColor || '#059669'; // Emerald fallback
  const accentColor = currentShop?.accentColor || '#10b981';

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      
      {/* ── HERO BANNER ── */}
      <div className="relative h-[280px] w-full rounded-b-[40px] overflow-hidden mb-8 border border-slate-100 shadow-sm">
        <img 
          src={currentShop?.bannerUrl || "/assets/designer-filipiniana.png"} 
          alt="Shop Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/90 via-[#1C1917]/30 to-transparent" />
        
        {/* Verification Badge */}
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-400" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Sutura Premium Master</span>
        </div>

        {/* Shop Info Overlay */}
        <div className="absolute bottom-8 left-8 md:left-12 flex items-end gap-6 w-full">
          <div className="w-28 h-28 bg-white p-1 rounded-3xl shadow-2xl relative shrink-0">
            <div className="w-full h-full bg-slate-100 rounded-[20px] overflow-hidden flex items-center justify-center">
              {currentShop?.logoUrl ? (
                <img src={currentShop.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Scissors size={40} className="text-emerald-700" />
              )}
            </div>
            {/* Online Status */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>

          <div className="pb-2 text-white">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1">{currentShop?.shopName || 'Davao Tailors PH'}</h1>
            <p className="text-[14px] font-medium text-white/80 mb-3">{currentShop?.tagline || 'Excellence in Bespoke Tailoring'}</p>
            <div className="flex items-center gap-4 text-[12px] font-bold text-white/90">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400"/> BGC, Taguig</span>
              <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400"/> 4.9 (128 Reviews)</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-400"/> Replies within minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-0">
        
        {/* ── ACTION BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center gap-6 px-4">
            <div className="text-center">
              <div className="text-[18px] font-black text-slate-900">12</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tailors</div>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="text-center">
              <div className="text-[18px] font-black text-slate-900">450+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Garments Crafted</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="h-12 px-6 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-[13px] transition-colors flex items-center gap-2"
            >
              <MessageSquare size={16} /> Inquire
            </button>
            <button 
              onClick={() => setShowBookModal(true)}
              className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[13px] transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Calendar size={16} /> Book Consultation
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
          {[
            { id: 'premade', label: 'Premium Ready-to-Wear', icon: <Box size={16}/> },
            { id: 'portfolio', label: 'Past Works Gallery', icon: <ImageIcon size={16}/> },
            { id: 'about', label: 'The Atelier', icon: <LayoutGrid size={16}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 text-[14px] font-bold transition-all relative ${activeTab === tab.id ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full animate-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT AREA ── */}
        
        {/* PREMIUM READY-TO-WEAR (Inventory Driven) */}
        {activeTab === 'premade' && (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-8 max-w-[600px]">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Curated Finished Goods.</h2>
              <p className="text-[14px] text-slate-500 font-medium">These items are currently available in our atelier's inventory. Reserve a piece online and book a fitting consultation to ensure perfect measurements before finalizing your order.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_INVENTORY.map(item => (
                <div key={item.id} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="relative h-64 overflow-hidden bg-slate-50">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Size Badges Overlay */}
                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                      {item.sizes.map(s => (
                        <span key={s} className="px-2 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black rounded uppercase border border-slate-200/50 shadow-sm">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{item.category}</span>
                      <span className="text-[11px] font-bold text-slate-400">Stock: {item.stock}</span>
                    </div>
                    <h3 className="text-[18px] font-black text-slate-900 mb-1 leading-tight">{item.name}</h3>
                    <div className="text-xl font-black text-emerald-700 mb-3">{item.price}</div>
                    <p className="text-[12px] text-slate-500 font-medium line-clamp-2 mb-6">{item.description}</p>
                    
                    {/* Tailoring Actions (NO ADD TO CART) */}
                    <div className="space-y-2 mt-auto">
                      <button className="w-full h-11 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-bold text-[13px] transition-colors flex items-center justify-center gap-2">
                        Reserve & Fit <ArrowRight size={14}/>
                      </button>
                      <button className="w-full h-11 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-[13px] transition-colors flex items-center justify-center gap-2 border border-slate-200">
                        <MessageSquare size={14}/> Inquire Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAST WORKS GALLERY */}
        {activeTab === 'portfolio' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 text-center py-20">
            <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Atelier Portfolio</h3>
            <p className="text-slate-500 text-sm mt-2">The shop owner has not uploaded any past works yet.</p>
          </div>
        )}

        {/* THE ATELIER (ABOUT) */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-4">About Our Atelier</h2>
              <p className="text-slate-600 leading-relaxed text-[15px] mb-8">
                Welcome to Davao Tailors PH. We specialize in high-end bespoke tailoring, 
                blending traditional Filipino craftsmanship with modern, cutting-edge designs. 
                Whether you need a custom-fit suit for a corporate event or an intricately 
                woven modern Barong, our Master Tailors ensure perfection in every stitch.
              </p>
              
              <h3 className="text-lg font-bold text-slate-900 mb-4">Our Core Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Bespoke Made-to-Measure", "Ready-to-Wear Alterations", 
                  "Bridal & Formalwear", "Corporate Uniform Bulk Orders"
                ].map((s,i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-[14px] font-bold text-slate-700">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-fit">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Atelier Details</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</div>
                  <div className="text-[14px] font-bold text-slate-800 flex items-start gap-2">
                    <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    123 High Street, BGC, Taguig City
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Business Hours</div>
                  <div className="text-[14px] font-bold text-slate-800 flex items-start gap-2">
                    <Clock size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    Mon - Sat: 9:00 AM - 6:00 PM<br/>Sun: Closed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      <ShopInquiryModal 
        isOpen={showInquiryModal} 
        onClose={() => setShowInquiryModal(false)} 
        shopName={currentShop?.shopName || 'this Atelier'}
      />

      <BookConsultationModal 
        isOpen={showBookModal} 
        onClose={() => setShowBookModal(false)}
      />
    </div>
  );
}

// Helper Icon components
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
