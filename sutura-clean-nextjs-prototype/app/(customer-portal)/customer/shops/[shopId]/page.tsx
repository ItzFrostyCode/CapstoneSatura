'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Share2, Star, MapPin, ShieldCheck, 
  Calendar, MessageSquare, Heart, Box, LayoutGrid, Clock, CheckCircle, 
  Plus, Minus, X, ArrowRight, UserPlus, UserCheck, Ruler, Smartphone,
  Eye, ChevronUp, Info, Send, Camera, Link as LinkIcon, Check
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, startOfDay, isBefore
} from 'date-fns';
import { useERPStore } from '@/store/useERPStore';

interface InventorySize {
  size: string;
  stock: number;
  measurement: string;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  price: string;
  sizes: InventorySize[];
  img: string;
  description: string;
  rating: number;
  reviews: number;
  likes: number;
}

// MOCK INVENTORY
const PREMIUM_INVENTORY: InventoryItem[] = [
  { 
    id: 1, 
    name: "Modern Piña Barong", 
    category: "Formalwear", 
    price: "₱4,500", 
    sizes: [
      { size: "M", stock: 4, measurement: "Chest 38-40\"" },
      { size: "L", stock: 2, measurement: "Chest 42-44\"" },
      { size: "XL", stock: 1, measurement: "Chest 46-48\"" }
    ], 
    img: "/catalog/Classsic Barong Tagalog.png", 
    description: "Handwoven piña fabric with intricate modern embroidery. Ready for fitting.",
    rating: 4.8,
    reviews: 24,
    likes: 156
  },
  { 
    id: 2, 
    name: "Midnight Bespoke Suit", 
    category: "Suits", 
    price: "₱15,000", 
    sizes: [
      { size: "40R", stock: 1, measurement: "Chest 40\"" },
      { size: "42R", stock: 1, measurement: "Chest 42\"" }
    ], 
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", 
    description: "Premium wool blend. Includes one free major alteration session.",
    rating: 4.9,
    reviews: 12,
    likes: 89
  },
  { 
    id: 3, 
    name: "Neo-Filipiniana Dress", 
    category: "Gowns", 
    price: "₱8,500", 
    sizes: [
      { size: "S", stock: 2, measurement: "Bust 32-34\"" },
      { size: "M", stock: 3, measurement: "Bust 35-37\"" }
    ], 
    img: "/catalog/Modern Filipiniana.png", 
    description: "A contemporary take on the classic Filipiniana, featuring butterfly sleeves.",
    rating: 4.7,
    reviews: 45,
    likes: 312
  },
];

interface MeasurementProfile {
  id: string;
  versionName: string;
  createdAt: string;
  // Core Metrics
  neck: string;
  chest: string;
  waist: string;
  hips: string;
  shoulder: string;
  sleeve: string;
  length: string;
  // Ultimate Metrics
  armhole?: string;
  bicep?: string;
  wrist?: string;
  backWidth?: string;
  frontWidth?: string;
  slope?: string;
  // Preferences
  fitPreference: 'Slim' | 'Regular' | 'Loose' | 'Oversized';
  postureTags: string[];
  styleNotes: string;
}

export default function PremiumShopProfile() {
  const { shopId } = useParams();
  const [activeTab, setActiveTab] = useState('premade'); // 'about', 'premade', 'branches'
  const [view, setView] = useState<'profile' | 'reserve' | 'add-measurements' | 'chat' | 'book-appointment'>('profile');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedReviewItem, setSelectedReviewItem] = useState<InventoryItem | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Measurement Versioning
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementProfile[]>([
    {
      id: 'v1',
      versionName: '2024 Wedding Fit',
      createdAt: '2024-05-10',
      neck: '15.5', shoulder: '18', chest: '40', waist: '34', hips: '38', sleeve: '24', length: '28',
      armhole: '19', bicep: '14', wrist: '7', backWidth: '16', slope: '2',
      fitPreference: 'Slim',
      postureTags: ['Square Shoulders', 'Prominent Chest'],
      styleNotes: 'For the main wedding event. Snug fit.'
    },
    {
      id: 'v2',
      versionName: 'Relaxed Barong',
      createdAt: '2024-03-15',
      neck: '16.0', shoulder: '18.5', chest: '42', waist: '36', hips: '40', sleeve: '24.5', length: '29',
      armhole: '20', bicep: '15', wrist: '7.5', backWidth: '16.5', slope: '2',
      fitPreference: 'Regular',
      postureTags: ['Erect'],
      styleNotes: 'Standard casual barong fit.'
    },
    {
      id: 'v3',
      versionName: 'Office Suit 2023',
      createdAt: '2023-11-20',
      neck: '15.5', shoulder: '18', chest: '41', waist: '35', hips: '39', sleeve: '24', length: '28.5',
      fitPreference: 'Regular',
      postureTags: ['Square Shoulders'],
      styleNotes: 'Business formal version.'
    }
  ]);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('v1');

  // Form State for Posture Tags in the UI
  const [tempPostureTags, setTempPostureTags] = useState<string[]>([]);
  const [tempFit, setTempFit] = useState<'Slim' | 'Regular' | 'Loose' | 'Oversized'>('Regular');

  const [reservationForm, setReservationForm] = useState({
    phone: '',
    size: '',
    measurement: '',
    notes: '',
    paymentMode: '50%' as 'full' | '50%',
    agreed: false,
    isCustom: false,
    quantity: 1,
    paymentType: 'walk-in' as 'walk-in' | 'online',
    onlineMethod: 'GCash' as 'GCash' | 'Maya',
    refNo: '',
    showItemReviews: false
  });

  const [appointmentForm, setAppointmentForm] = useState({
    purpose: 'Consultation' as 'Consultation' | 'Custom Clothing' | 'Bulk Order' | 'Alterations' | 'Other',
    specificPurpose: '',
    date: null as Date | null,
    time: '',
    notes: '',
    inspirationFiles: [] as File[],
    inspirationLink: '',
    estimatedQuantity: '',
    orgName: '',
    personnel: [{ 
      name: '', 
      size: 'M', 
      type: 'Standard',
      measurements: { neck: '', chest: '', waist: '', hips: '', length: '', shoulder: '' },
      isExpanded: true
    }] as { 
      name: string, 
      size: string, 
      type: 'Standard' | 'Custom',
      measurements: Record<string, string>,
      isExpanded: boolean
    }[],
    agreed: false
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { 
    appointments,
    followedShops,
    heartedItems,
    toggleFollowShop,
    toggleHeartItem
  } = useERPStore();

  const isFollowing = followedShops.includes(shopId as string);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  const activeMeasurement = measurementHistory.find(m => m.id === selectedVersionId) || measurementHistory[0];

  const handleReserve = (item: InventoryItem) => {
    setSelectedItem(item);
    const firstAvailable = item.sizes.find(s => s.stock > 0);
    setReservationForm({ 
      ...reservationForm, 
      size: firstAvailable?.size || '',
      measurement: firstAvailable?.measurement || '',
      agreed: false,
      isCustom: false
    });
    setView('reserve');
    window.scrollTo(0, 0);
  };

  const handleInquire = (item: InventoryItem) => {
    setSelectedItem(item);
    setView('chat');
    window.scrollTo(0, 0);
  };

  const confirmReservation = () => {
    if (!reservationForm.isCustom && !reservationForm.agreed) return;
    setView('profile');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
    window.scrollTo(0, 0);
  };

  const saveMeasurements = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newVersion: MeasurementProfile = {
      id: `v${Date.now()}`,
      versionName: (formData.get('versionName') as string) || `Fit Version ${measurementHistory.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      neck: formData.get('neck') as string,
      chest: formData.get('chest') as string,
      waist: formData.get('waist') as string,
      hips: formData.get('hips') as string,
      shoulder: formData.get('shoulder') as string,
      sleeve: formData.get('sleeve') as string,
      length: formData.get('length') as string,
      armhole: formData.get('armhole') as string,
      bicep: formData.get('bicep') as string,
      wrist: formData.get('wrist') as string,
      backWidth: formData.get('backWidth') as string,
      frontWidth: formData.get('frontWidth') as string,
      slope: formData.get('slope') as string,
      fitPreference: tempFit,
      postureTags: tempPostureTags,
      styleNotes: formData.get('styleNotes') as string
    };
    setMeasurementHistory([newVersion, ...measurementHistory]);
    setSelectedVersionId(newVersion.id);
    setView('reserve');
  };

  const getNumericalPrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''));
  const fullPrice = selectedItem ? getNumericalPrice(selectedItem.price) : 0;
  const partialPrice = fullPrice * 0.5;

  if (view === 'chat') {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FA] animate-in slide-in-from-right duration-500">
        {/* CHAT HEADER */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shadow-sm">
          <button 
            onClick={() => setView('profile')}
            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-1 items-center gap-3">
            <div className="w-12 h-12 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 shrink-0">
               <img src="/catalog/Golden Needle Tailoring LOGO.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[13px] font-black text-slate-900 tracking-tight leading-none mb-1">Golden Needle Tailoring</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={8} className="text-emerald-500" /> Davao City
                </span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Star size={8} className="text-amber-400 fill-amber-400" /> 4.9 (128)
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Premium Shop</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 px-6 py-8 space-y-6">
          {/* AUTO GREETING */}
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-500">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white shrink-0 mt-1">
              <MessageSquare size={14} />
            </div>
            <div className="max-w-[80%] bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                Hello! Thank you for inquiring at Golden Needle. How can we help you with this piece today?
              </p>
            </div>
          </div>

          {/* PRODUCT CARD IN CHAT */}
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-left duration-500 delay-300">
            <div className="w-8 h-8 opacity-0 shrink-0" /> {/* Spacer */}
            <div className="max-w-[85%] bg-white border border-slate-100 overflow-hidden rounded-[28px] shadow-md border-b-4 border-b-emerald-500">
              <div className="h-40 w-full overflow-hidden bg-slate-50">
                <img src={selectedItem?.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[15px] font-black text-slate-900 tracking-tight">{selectedItem?.name}</h4>
                  <span className="text-[14px] font-black text-emerald-700">{selectedItem?.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-black text-slate-900">{selectedItem?.rating}</span>
                  </div>
                  <div className="h-3 w-px bg-slate-100" />
                  <div className="flex items-center gap-1.5">
                    <Heart size={12} className="text-rose-500 fill-rose-500" />
                    <span className="text-[11px] font-black text-rose-500">{selectedItem?.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-white border-t border-slate-100 pb-safe">
          <div className="relative flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Type your message..."
              className="flex-1 h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all"
            />
            <button className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 active:scale-90 transition-all">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'book-appointment') {
    return (
      <div className="flex flex-col min-h-screen bg-white animate-in slide-in-from-right duration-500 pb-32">
        {/* COMPACT HEADER */}
        <div className="px-6 py-5 flex items-center justify-between bg-[#FAF8F5] border-b border-slate-100 sticky top-0 z-50">
          <button 
            onClick={() => setView('profile')}
            className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 shadow-sm active:scale-90 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-[12px] font-black uppercase tracking-widest text-slate-900 leading-none mb-2">
              Book Appointment
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 leading-none">Golden Needle Tailoring</p>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="flex-1 px-6 py-8 space-y-10">
          {/* 1. PURPOSE SELECTION - COMPRESSED */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Purpose</label>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{appointmentForm.purpose}</span>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {['Consultation', 'Custom Clothing', 'Bulk Order', 'Alterations'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAppointmentForm({...appointmentForm, purpose: p as any})}
                    className={`h-10 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${appointmentForm.purpose === p ? 'bg-[#069668] border-[#069668] text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAppointmentForm({...appointmentForm, purpose: 'Other'})}
                className={`w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${appointmentForm.purpose === 'Other' ? 'bg-[#069668] border-[#069668] text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
              >
                Other
              </button>
            </div>
            {appointmentForm.purpose === 'Bulk Order' && (
              <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Est. Quantity</label>
                    <input 
                      type="number"
                      placeholder="e.g. 50"
                      className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[11px] font-bold outline-none focus:bg-white focus:border-[#069668] transition-all"
                      value={appointmentForm.estimatedQuantity}
                      onChange={(e) => setAppointmentForm({...appointmentForm, estimatedQuantity: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Org / Team Name</label>
                    <input 
                      type="text"
                      placeholder="Company or Event..."
                      className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[11px] font-bold outline-none focus:bg-white focus:border-[#069668] transition-all"
                      value={appointmentForm.orgName}
                      onChange={(e) => setAppointmentForm({...appointmentForm, orgName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Personnel Roster Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member List & Sizes</label>
                    <div className="flex gap-4 items-center">
                      {/* Mini Size Guide Link */}
                      <button 
                        type="button"
                        className="text-[9px] font-black text-[#069668] bg-emerald-50 px-3 py-1 rounded-full uppercase flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                        onClick={() => {
                          const guide = document.getElementById('size-guide-table');
                          if (guide) guide.classList.toggle('hidden');
                        }}
                      >
                        <Info size={12} /> Size Guide
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAppointmentForm({
                          ...appointmentForm, 
                          personnel: [...appointmentForm.personnel, { 
                            name: '', 
                            size: 'M', 
                            type: 'Standard',
                            measurements: { neck: '', chest: '', waist: '', hips: '', length: '', shoulder: '' },
                            isExpanded: true
                          }]
                        })}
                        className="text-[9px] font-black text-[#069668] uppercase flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Person
                      </button>
                    </div>
                  </div>

                  {/* Standard Size Guide Table (Initially Hidden or Toggled) */}
                  <div id="size-guide-table" className="hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Standard Size Reference (Inches)</span>
                        <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">Generic Artisanal Scale</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-[9px] text-left">
                          <thead>
                            <tr className="text-white border-b border-slate-700">
                              <th className="pb-2 font-black">SIZE</th>
                              <th className="pb-2 font-black">NECK</th>
                              <th className="pb-2 font-black">CHEST</th>
                              <th className="pb-2 font-black">WAIST</th>
                              <th className="pb-2 font-black">HIPS</th>
                              <th className="pb-2 font-black">SHLDR</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/90">
                            {[
                              { s: 'S', n: '14.5', c: '36-38', w: '30-32', h: '37-39', sh: '17.5' },
                              { s: 'M', n: '15.5', c: '39-41', w: '32-34', h: '40-42', sh: '18.5' },
                              { s: 'L', n: '16.5', c: '42-44', w: '35-37', h: '43-45', sh: '19.5' },
                              { s: 'XL', n: '17.5', c: '45-47', w: '38-40', h: '46-48', sh: '20.5' },
                              { s: '2XL', n: '18.5', c: '48-50', w: '41-43', h: '49-51', sh: '21.5' },
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-slate-800 last:border-0">
                                <td className="py-2 font-black text-emerald-400">{row.s}</td>
                                <td className="py-2 font-bold">{row.n}&quot;</td>
                                <td className="py-2 font-bold">{row.c}&quot;</td>
                                <td className="py-2 font-bold">{row.w}&quot;</td>
                                <td className="py-2 font-bold">{row.h}&quot;</td>
                                <td className="py-2 font-bold">{row.sh}&quot;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {appointmentForm.personnel.map((person, idx) => (
                      <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-right-2">
                        <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 items-center">
                          <input 
                            type="text"
                            placeholder="Full Name"
                            className="flex-[2] h-9 bg-white border border-slate-200 rounded-lg px-3 text-[11px] font-bold outline-none focus:border-[#069668]"
                            value={person.name}
                            onChange={(e) => {
                              const newPersonnel = [...appointmentForm.personnel];
                              newPersonnel[idx].name = e.target.value;
                              setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                            }}
                          />
                          <select 
                            className="flex-1 h-9 bg-white border border-slate-200 rounded-lg px-2 text-[10px] font-black uppercase outline-none focus:border-[#069668]"
                            value={person.type}
                            onChange={(e) => {
                              const newPersonnel = [...appointmentForm.personnel];
                              newPersonnel[idx].type = e.target.value as any;
                              newPersonnel[idx].isExpanded = e.target.value === 'Custom';
                              setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                            }}
                          >
                            <option value="Standard">Standard</option>
                            <option value="Custom">Custom</option>
                          </select>
                          
                          {person.type === 'Standard' ? (
                            <select 
                              className="w-16 h-9 bg-white border border-slate-200 rounded-lg px-2 text-[10px] font-black uppercase outline-none focus:border-[#069668]"
                              value={person.size}
                              onChange={(e) => {
                                const newPersonnel = [...appointmentForm.personnel];
                                newPersonnel[idx].size = e.target.value;
                                setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                              }}
                            >
                              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => {
                                const newPersonnel = [...appointmentForm.personnel];
                                newPersonnel[idx].isExpanded = !newPersonnel[idx].isExpanded;
                                setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                              }}
                              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${person.isExpanded ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-emerald-600'}`}
                            >
                              {person.isExpanded ? <ChevronUp size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                          
                          <button 
                            type="button"
                            onClick={() => {
                              const newPersonnel = appointmentForm.personnel.filter((_, i) => i !== idx);
                              setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                            }}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Expandable Custom Measurements */}
                        {person.type === 'Custom' && person.isExpanded && (
                          <div className="mx-2 p-4 bg-white border-2 border-emerald-50 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300 shadow-sm">
                             <div className="flex items-center justify-between">
                               <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                 <Ruler size={12} />
                                 Metrics for {person.name || 'this person'}
                               </p>
                               <span className="text-[8px] font-bold text-slate-400 uppercase">Unit: Inches</span>
                             </div>
                             <div className="grid grid-cols-3 gap-3">
                               {['neck', 'chest', 'waist', 'hips', 'length', 'shoulder'].map((metric) => (
                                 <div key={metric} className="space-y-1">
                                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-tight ml-1">{metric}</label>
                                   <input 
                                     type="number"
                                     placeholder='0.0"'
                                     className="w-full h-9 bg-slate-50 border border-slate-100 rounded-lg px-2 text-[11px] font-bold outline-none focus:bg-white focus:border-emerald-500"
                                     value={person.measurements[metric]}
                                     onChange={(e) => {
                                       const newPersonnel = [...appointmentForm.personnel];
                                       newPersonnel[idx].measurements[metric] = e.target.value;
                                       setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                                     }}
                                   />
                                 </div>
                               ))}
                             </div>
                             <button 
                               type="button"
                               onClick={() => {
                                 const newPersonnel = [...appointmentForm.personnel];
                                 newPersonnel[idx].isExpanded = false;
                                 setAppointmentForm({...appointmentForm, personnel: newPersonnel});
                                }}
                               className="w-full h-8 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                             >
                               Save & Collapse
                             </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {appointmentForm.purpose === 'Other' && (
              <input 
                autoFocus
                placeholder="Describe specific request..."
                className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[11px] font-medium outline-none focus:bg-white focus:border-[#069668] transition-all"
                value={appointmentForm.specificPurpose}
                onChange={(e) => setAppointmentForm({...appointmentForm, specificPurpose: e.target.value})}
              />
            )}
          </div>

          {/* 2. SCHEDULE SELECTION - COMPRESSED SIDE-BY-SIDE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Schedule</label>
              {appointmentForm.date && (
                <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {format(appointmentForm.date, 'MMM d')} {appointmentForm.time && `@ ${appointmentForm.time}`}
                </span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              {/* Resized Calendar */}
              <div className="flex-[2.5] bg-slate-50 rounded-[24px] p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{format(currentMonth, 'MMMM yyyy')}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"><ChevronLeft size={14}/></button>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"><ChevronRight size={14}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={`${d}-${i}`} className="text-center text-[8px] font-black text-slate-300 mb-2 uppercase">{d}</div>)}
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => <div key={i} />)}
                  {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map(day => {
                    const isPast = isBefore(day, startOfDay(new Date()));
                    const isSelected = appointmentForm.date && isSameDay(day, appointmentForm.date);
                    
                    // Helper to normalize time to 24h for robust comparison
                    const to24h = (timeStr: string) => {
                      if (!timeStr) return '';
                      const normalized = timeStr.toUpperCase();
                      if (normalized.includes('AM') || normalized.includes('PM')) {
                        const [time, period] = normalized.split(' ');
                        const [hStr, mStr] = time.split(':');
                        let h = Number(hStr);
                        const m = Number(mStr || 0);
                        if (period === 'PM' && h !== 12) h += 12;
                        if (period === 'AM' && h === 12) h = 0;
                        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                      }
                      const [hStr, mStr] = normalized.split(':');
                      const h = Number(hStr);
                      const m = Number(mStr || 0);
                      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    };

                    // Check if all slots are taken
                    const dayApts = appointments.filter(a => {
                      const aptDate = typeof a.date === 'string' ? new Date(a.date) : a.date;
                      return isSameDay(aptDate, day) && 
                      ['Scheduled', 'Completed', 'Pending Review'].includes(a.status);
                    });
                    
                    const isFullyBooked = timeSlots.every(slot => 
                      dayApts.some(a => to24h(a.startTime) === to24h(slot))
                    );

                    return (
                      <button
                        key={day.toString()}
                        disabled={isPast || isFullyBooked}
                        onClick={() => setAppointmentForm({...appointmentForm, date: day, time: ''})}
                        className={`h-10 rounded-xl flex flex-col items-center justify-center text-[12px] font-black transition-all relative ${
                          isSelected ? 'bg-[#069668] text-white shadow-md scale-105 z-10' :
                          isFullyBooked ? 'bg-rose-50 text-rose-500 border border-rose-100 cursor-not-allowed' :
                          isPast ? 'text-slate-200 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-white border border-slate-100 hover:border-emerald-300'
                        }`}
                      >
                        {format(day, 'd')}
                        {isFullyBooked && !isPast && (
                          <span className="text-[6px] font-black uppercase mt-0.5 opacity-60">Full</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Vertical Time Slots - Right Side */}
              <div className="flex-1">
                {appointmentForm.date ? (
                  <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Time</div>
                    {timeSlots.map(t => {
                      // Helper to normalize time to 24h for robust comparison
                      const to24h = (timeStr: string) => {
                        if (!timeStr) return '';
                        const normalized = timeStr.toUpperCase();
                        if (normalized.includes('AM') || normalized.includes('PM')) {
                          const [time, period] = normalized.split(' ');
                          const [hStr, mStr] = time.split(':');
                          let h = Number(hStr);
                          const m = Number(mStr || 0);
                          if (period === 'PM' && h !== 12) h += 12;
                          if (period === 'AM' && h === 12) h = 0;
                          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                        }
                        const [hStr, mStr] = normalized.split(':');
                        const h = Number(hStr);
                        const m = Number(mStr || 0);
                        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                      };

                      const existingApt = appointments.find(a => {
                        const aptDate = typeof a.date === 'string' ? new Date(a.date) : a.date;
                        return isSameDay(aptDate, appointmentForm.date!) && 
                        to24h(a.startTime) === to24h(t) &&
                        ['Scheduled', 'Completed', 'Pending Review'].includes(a.status);
                      });
                      const isBooked = !!existingApt;
                      
                      const [h_m, period] = t.split(' ');
                      const [h, m] = h_m.split(':').map(Number);
                      const actualHour = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
                      const slotTime = new Date(appointmentForm.date!);
                      slotTime.setHours(actualHour, m, 0, 0);
                      const isInPast = isBefore(slotTime, new Date());

                      return (
                        <button
                          key={t}
                          disabled={isBooked || isInPast}
                          onClick={() => setAppointmentForm({...appointmentForm, time: t})}
                          className={`h-11 rounded-xl flex items-center justify-between px-4 text-[10px] font-black transition-all border ${
                            appointmentForm.time === t ? 'bg-[#069668] border-[#069668] text-white shadow-sm' :
                            isBooked ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' :
                            isInPast ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed opacity-50' :
                            'bg-white border-slate-100 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50/30'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock size={12} className={appointmentForm.time === t ? 'text-white' : 'text-slate-300'} />
                            {t}
                          </span>
                          {isBooked ? (
                            <span className="text-[8px] font-black uppercase text-slate-400">Booked</span>
                          ) : (
                            appointmentForm.time === t && <Check size={12} />
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center bg-slate-50 rounded-[24px] border border-dashed border-slate-200 p-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                      <Calendar size={16} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center leading-tight">Pick a date to view<br/>available time slots</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. INSPIRATION & 4. NOTES - STACKED */}
          <div className="space-y-10">
            {/* Inspiration */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">3. Inspiration</label>
              
              {/* 4 Placeholder Images Grid */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <label key={i} className="aspect-square border-2 border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center gap-1 group cursor-pointer hover:border-[#069668] hover:bg-emerald-50/30 transition-all overflow-hidden relative bg-slate-50/30">
                    <input type="file" accept="image/*" className="hidden" 
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const newFiles = [...appointmentForm.inspirationFiles, ...files].slice(0, 4);
                        setAppointmentForm({...appointmentForm, inspirationFiles: newFiles});
                      }}
                    />
                    {appointmentForm.inspirationFiles[i-1] ? (
                      <div className="absolute inset-0 bg-[#069668] flex items-center justify-center">
                         <CheckCircle size={20} className="text-white" />
                      </div>
                    ) : (
                      <>
                        <Camera size={16} className="text-slate-300 group-hover:text-[#069668] transition-colors" />
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#069668]">3MB MAX</span>
                      </>
                    )}
                  </label>
                ))}
              </div>

              {/* Link Input - Below Images */}
              <div className="space-y-2 w-full">
                <div className="relative">
                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" placeholder="Paste link..." value={appointmentForm.inspirationLink} onChange={(e) => setAppointmentForm({...appointmentForm, inspirationLink: e.target.value})}
                    className="w-full h-10 pl-8 pr-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:border-[#069668] transition-all"
                  />
                </div>
                <div className="text-[8px] text-slate-400 px-1 font-bold uppercase italic flex items-center gap-2">
                   <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                   Pinterest / Google Drive
                </div>
              </div>
            </div>

            {/* 4. Notes */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Notes</label>
              <textarea 
                rows={2}
                placeholder="Specific fit requests or details..."
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-medium outline-none focus:bg-white focus:border-[#069668] transition-all resize-none"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
              />
            </div>
          </div>

          {/* 5. POLICY - DETAILED & COMPACT */}
          <div className="space-y-3 pb-24">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Booking Terms</span>
              </div>
              <ul className="space-y-2">
                {[
                  'Subject to Shop Approval (Check your notifications)',
                  '30-minute No-Show grace period only',
                  'Inspiration assets are used for prep-work',
                  'Reschedule at least 24 hours in advance'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#069668] mt-1.5 shrink-0" />
                    <span className="text-[9px] font-bold text-slate-500 leading-tight uppercase tracking-tight">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              onClick={() => setAppointmentForm({...appointmentForm, agreed: !appointmentForm.agreed})}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${appointmentForm.agreed ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100 shadow-sm'}`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all ${appointmentForm.agreed ? 'bg-[#069668] border-[#069668] text-white' : 'border-slate-300'}`}>
                {appointmentForm.agreed && <Check size={12} />}
              </div>
              <p className={`text-[10px] font-bold leading-tight ${appointmentForm.agreed ? 'text-white' : 'text-slate-500'} uppercase tracking-tight`}>
                I agree to the appointment review and confirmation policy.
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 max-w-[480px] mx-auto z-50 pb-safe">
          <button 
            onClick={() => {
              setView('profile');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 5000);
              window.scrollTo(0, 0);
            }}
            disabled={!appointmentForm.agreed || !appointmentForm.date || !appointmentForm.time}
            className={`w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${(!appointmentForm.agreed || !appointmentForm.date || !appointmentForm.time) ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-[#069668] text-white shadow-emerald-600/20'}`}
          >
            Submit Appointment Request
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'add-measurements') {
    return (
      <div className="flex flex-col min-h-screen bg-white animate-in slide-in-from-bottom duration-500 pb-32">
        {/* HEADER */}
        <div className="px-6 pt-8 pb-6 flex items-center justify-between bg-slate-900 text-white rounded-b-[40px]">
          <button 
            onClick={() => setView('reserve')}
            className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-[14px] font-black uppercase tracking-widest text-emerald-400">Add New Pattern</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Ultimate Bespoke Profile</p>
          </div>
          <div className="w-12 h-12" />
        </div>

        <form onSubmit={saveMeasurements} className="px-6 py-6 space-y-8">
          {/* VERSION NAME */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fit Version Name</label>
            <input 
              name="versionName"
              placeholder="e.g. Slim Wedding Fit, Casual Relaxed"
              required
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-[20px] px-6 text-[13px] font-black outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
            />
          </div>
          {/* POSTURE & FIGURATION */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Posture & Figuration</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tempPostureTags.map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black rounded-lg flex items-center gap-1.5 animate-in zoom-in shadow-md shadow-emerald-600/10">
                  {tag}
                  <button type="button" onClick={() => setTempPostureTags(tempPostureTags.filter(t => t !== tag))}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                'Square Shoulders', 'Stooped', 'Erect', 'Prominent Chest', 
                'Prominent Seat', 'Sway Back', 'Head Forward'
              ].filter(t => !tempPostureTags.includes(t)).map(tag => (
                <button 
                  key={tag}
                  type="button"
                  onClick={() => setTempPostureTags([...tempPostureTags, tag])}
                  className="px-2 py-2.5 bg-slate-50 border border-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all text-center leading-tight"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* FIT PREFERENCE */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">2. Fit Preference</label>
            <div className="bg-slate-50 p-[5px] rounded-[18px] flex gap-1">
              {['Slim', 'Regular', 'Loose', 'Oversized'].map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setTempFit(fit as any)}
                  className={`flex-1 h-10 rounded-[12px] text-[8px] font-black uppercase tracking-widest transition-all ${tempFit === fit ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* DETAILED METRICS */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">3. Detailed Metrics (Inches)</label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 bg-slate-50/30 p-5 rounded-[24px] border border-slate-100">
              {[
                { label: 'Neck', name: 'neck', placeholder: '15.5' },
                { label: 'Shoulder', name: 'shoulder', placeholder: '18' },
                { label: 'Chest', name: 'chest', placeholder: '40' },
                { label: 'Waist', name: 'waist', placeholder: '34' },
                { label: 'Hips', name: 'hips', placeholder: '38' },
                { label: 'Sleeve', name: 'sleeve', placeholder: '24' },
                { label: 'Armhole', name: 'armhole', placeholder: '19' },
                { label: 'Bicep', name: 'bicep', placeholder: '14' },
                { label: 'Wrist', name: 'wrist', placeholder: '7' },
                { label: 'Back Width', name: 'backWidth', placeholder: '16' },
                { label: 'Front Width', name: 'frontWidth', placeholder: '15' },
                { label: 'Slope', name: 'slope', placeholder: '2' },
                { label: 'Length', name: 'length', placeholder: '28' }
              ].map((field) => (
                <div key={field.name} className="flex justify-between items-center border-b border-slate-50 pb-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                  <input 
                    name={field.name}
                    type="number" 
                    step="0.1"
                    required
                    placeholder={field.placeholder}
                    className="w-14 h-7 bg-transparent text-right text-[12px] font-black text-slate-900 outline-none focus:text-emerald-600 transition-all placeholder:text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* STYLE NOTES */}
          <div className="space-y-3 pb-24">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Style Preferences & Notes</label>
            <textarea 
              name="styleNotes"
              rows={3}
              placeholder="Specific fit requests..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[20px] text-[13px] font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 max-w-[480px] mx-auto z-50 pb-safe">
            <button 
              type="submit"
              className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Update Ultimate Profile
              <CheckCircle size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (view === 'reserve') {
    return (
      <div className="flex flex-col min-h-screen bg-white animate-in fade-in slide-in-from-right duration-500 pb-32">
        {/* COMPACT HEADER */}
        <div className="px-6 py-5 flex items-center justify-between bg-[#FAF8F5] border-b border-slate-100">
          <button 
            onClick={() => setView('profile')}
            className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-900 shadow-sm active:scale-90 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-[12px] font-black uppercase tracking-widest text-slate-900 leading-none mb-2">
              {reservationForm.isCustom ? 'Tailoring Consultation' : 'Confirm Commitment'}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 leading-none">Golden Needle Tailoring</p>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-black text-slate-900">4.9 (128)</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10" />
        </div>

        <div className="flex-1 px-6 py-8">
          {/* PRODUCT PREVIEW */}
          <div className="flex flex-col gap-5 mb-10 p-5 bg-emerald-50/50 rounded-[40px] border border-emerald-100/50 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border border-emerald-200/50 shadow-lg shrink-0">
                <img src={selectedItem?.img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-[20px] font-black text-slate-900 leading-tight mb-1">{selectedItem?.name}</h2>
                <p className="text-emerald-700 font-black text-[18px] mb-3">
                  {reservationForm.isCustom ? 'Quote on Consultation' : selectedItem?.price}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="px-3 py-1 bg-white border border-emerald-100 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-widest shadow-sm">
                    {reservationForm.isCustom ? 'Bespoke Custom' : 'Ready-to-Wear'}
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-full px-3 py-1 shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Size:</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{reservationForm.size}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL STATS ROW (PERSISTENT - CLEAN VERSION) */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-100/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-black text-slate-900">{selectedItem?.rating}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Rating</span>
                </div>
                <div className="h-3 w-px bg-emerald-200/50" />
                <div className="flex items-center gap-1.5">
                  <Heart size={12} className="text-rose-500 fill-rose-500" />
                  <span className="text-[11px] font-black text-rose-500">{selectedItem?.likes}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">Likes</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleHeartItem(`ITM-00${selectedItem?.id}`)}
                  className={`h-9 w-9 bg-white border rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${heartedItems.includes(`ITM-00${selectedItem?.id}`) ? 'border-rose-100 text-rose-500' : 'border-slate-100 text-slate-300'}`}
                >
                  <Heart size={16} className={heartedItems.includes(`ITM-00${selectedItem?.id}`) ? "fill-rose-500" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="space-y-12">
            {/* 1. SELECTION TABS (SHOP STYLE) */}
            <div className="flex items-center gap-8 border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
              {[
                { id: 'standard', label: 'Standard', icon: <Box size={16}/> },
                { id: 'custom', label: 'Custom', icon: <Ruler size={16}/> },
                { id: 'reviews', label: 'Ratings', icon: <Star size={16}/> },
              ].map(tab => (
                <button
                  key={tab.label}
                  onClick={() => {
                    if (tab.id === 'reviews') setReservationForm({...reservationForm, showItemReviews: true});
                    else setReservationForm({...reservationForm, isCustom: tab.id === 'custom', showItemReviews: false});
                  }}
                  className={`pb-4 flex items-center gap-2 text-[12px] font-black transition-all relative uppercase tracking-widest shrink-0 ${
                    (tab.id === 'reviews' && reservationForm.showItemReviews) || 
                    (tab.id === 'standard' && !reservationForm.isCustom && !reservationForm.showItemReviews) ||
                    (tab.id === 'custom' && reservationForm.isCustom && !reservationForm.showItemReviews)
                    ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {(
                    (tab.id === 'reviews' && reservationForm.showItemReviews) || 
                    (tab.id === 'standard' && !reservationForm.isCustom && !reservationForm.showItemReviews) ||
                    (tab.id === 'custom' && reservationForm.isCustom && !reservationForm.showItemReviews)
                  ) && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full animate-in zoom-in duration-300" />
                  )}
                </button>
              ))}
            </div>

            {/* 2. DYNAMIC CONTENT: STANDARD VS CUSTOM VS REVIEWS */}
            {(reservationForm as any).showItemReviews ? (
               <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                  {/* UNIFIED INTERACTIVE ACTION */}
                  <div className="w-full">
                    <button 
                      onClick={() => setSelectedReviewItem(selectedItem)}
                      className="w-full h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                    >
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                      Post Feedback & Rating
                    </button>
                  </div>

                  <div className="space-y-2 px-2">
                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-4">Item Feedback</p>
                    <div className="divide-y divide-slate-100">
                      {[
                        { user: "Arturo P.", rating: 5, comment: "The Piña fabric is authentic and the embroidery is stunning.", date: "Just now" },
                        { user: "Bianca S.", rating: 5, comment: "Perfect for my wedding guest outfit. Standard size 40 fits like a glove.", date: "Yesterday" }
                      ].map((rev, i) => (
                        <div key={i} className="py-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-black text-slate-900">{rev.user}</span>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => <Star key={s} size={8} className="fill-amber-400 text-amber-400" />)}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{rev.date}</span>
                          </div>
                          <p className="text-[12px] text-slate-500 leading-relaxed font-medium italic">&quot;{rev.comment}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            ) : !reservationForm.isCustom ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* SIZE SELECTION */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">2. Select Your Available Size</label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedItem?.sizes.filter((s: any) => s.stock > 0).map((s: any) => (
                      <button 
                        key={s.size}
                        onClick={() => setReservationForm({...reservationForm, size: s.size, measurement: s.measurement})}
                        className={`h-16 rounded-[20px] p-5 flex items-center justify-between transition-all border ${reservationForm.size === s.size ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                      >
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[16px] leading-tight">{s.size}</span>
                            <span className={`text-[10px] font-black tracking-tight ${reservationForm.size === s.size ? 'text-white' : 'text-slate-900'}`}>
                              ({s.measurement})
                            </span>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${reservationForm.size === s.size ? 'text-white/60' : 'text-slate-400'}`}>Standard Fit</span>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <span className={`font-black text-[13px] ${reservationForm.size === s.size ? 'text-white' : 'text-slate-900'}`}>{s.stock}</span>
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${reservationForm.size === s.size ? 'text-white/60' : 'text-slate-400'}`}>Stock</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUANTITY SELECTION */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">3. Quantity</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-[24px] p-2.5 h-16 px-6">
                    <span className="text-[14px] font-black text-slate-900 tracking-tight">How many items?</span>
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl h-11 px-1">
                      <button 
                        type="button"
                        onClick={() => setReservationForm({...reservationForm, quantity: Math.max(1, reservationForm.quantity - 1)})}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <div className="w-10 text-center font-black text-[14px] text-slate-900">
                        {reservationForm.quantity}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setReservationForm({...reservationForm, quantity: reservationForm.quantity + 1})}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. PAYMENT TYPE SELECTION */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">4. Payment Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                    {[
                      { id: 'walk-in', label: 'Walk-In', icon: <MapPin size={14}/> },
                      { id: 'online', label: 'Online', icon: <Smartphone size={14}/> },
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setReservationForm({...reservationForm, paymentType: type.id as any})}
                        className={`h-12 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${reservationForm.paymentType === type.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {reservationForm.paymentType === 'online' ? (
                  <>
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      {/* ONLINE FLOW: COMMITMENT & METHOD */}
                      <div className="space-y-4">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">5. Online Payment Details</label>
                        
                        {/* Merchant Details */}
                        <div className="p-4 bg-slate-900 rounded-[20px] shadow-xl border border-slate-800">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Receiving Account</span>
                            <Smartphone size={14} className="text-emerald-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-white text-[14px] font-black tracking-tight">Elena Roxas</h4>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Shop Owner</p>
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                              <span className="text-emerald-400 font-black text-[15px] tracking-[2px]">0917 123 4567</span>
                            </div>
                          </div>
                        </div>

                        {/* Commitment */}
                        <div className="grid grid-cols-2 gap-2">
                          {['50%', 'full'].map((mode) => (
                            <button 
                              key={mode}
                              onClick={() => setReservationForm({...reservationForm, paymentMode: mode as any})}
                              className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all border ${reservationForm.paymentMode === mode ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                            >
                              <span className="font-black text-[14px] uppercase">{mode === '50%' ? '50% Down' : 'Full Pay'}</span>
                              <span className={`text-[9px] font-bold ${reservationForm.paymentMode === mode ? 'text-white/60' : 'text-slate-400'}`}>
                                ₱{(mode === '50%' ? partialPrice : fullPrice).toLocaleString()}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Method Selection */}
                        <div className="grid grid-cols-2 gap-2">
                          {['GCash', 'Maya'].map((method) => (
                            <button 
                              key={method}
                              onClick={() => setReservationForm({...reservationForm, onlineMethod: method as any})}
                              className={`h-12 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${reservationForm.onlineMethod === method ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>

                        {/* Proof of Payment */}
                        <div className="space-y-3">
                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[11px] uppercase tracking-widest border-r border-slate-200 pr-4">Ref #</div>
                            <input 
                              type="text" 
                              placeholder="Enter Reference Number"
                              value={reservationForm.refNo}
                              onChange={(e) => setReservationForm({...reservationForm, refNo: e.target.value})}
                              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-24 pr-6 text-[13px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all"
                            />
                          </div>

                          <div className="h-32 border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              <Box size={18} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700">Upload Screenshot</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AGREEMENT BOX (ONLINE) */}
                    <div 
                      onClick={() => setReservationForm({...reservationForm, agreed: !reservationForm.agreed})}
                      className={`p-6 rounded-[32px] border transition-all cursor-pointer flex gap-4 ${reservationForm.agreed ? 'bg-emerald-900 border-emerald-900 shadow-2xl' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 mt-1 transition-all ${reservationForm.agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                        {reservationForm.agreed && <CheckCircle size={14} />}
                      </div>
                      <div>
                        <h4 className={`text-[13px] font-black mb-1 ${reservationForm.agreed ? 'text-white' : 'text-slate-900'}`}>Online Payment Agreement</h4>
                        <p className={`text-[11px] font-medium leading-relaxed ${reservationForm.agreed ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                          I confirm that I have transferred the amount and provided the correct reference number. Production will start after verification.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div 
                    onClick={() => setReservationForm({...reservationForm, agreed: !reservationForm.agreed})}
                    className={`animate-in fade-in slide-in-from-top-4 duration-500 p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${reservationForm.agreed ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${reservationForm.agreed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <MapPin size={16} />
                        </div>
                        <h4 className={`text-[14px] font-black tracking-tight ${reservationForm.agreed ? 'text-white' : 'text-slate-900'}`}>Pay Physically at Shop</h4>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${reservationForm.agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                        {reservationForm.agreed && <CheckCircle size={12} />}
                      </div>
                    </div>
                    
                    <p className={`text-[11px] font-medium leading-relaxed ${reservationForm.agreed ? 'text-white/50' : 'text-slate-500'}`}>
                      Visit our studio within 48 hours for fitting and payment.
                    </p>

                    <div className={`w-full p-4 rounded-xl border transition-all ${reservationForm.agreed ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${reservationForm.agreed ? 'text-emerald-400' : 'text-emerald-600'}`}>Walk-In Commitment</h5>
                      <p className={`text-[11px] font-bold leading-relaxed ${reservationForm.agreed ? 'text-white/70' : 'text-slate-600'}`}>
                        I confirm my intent to visit the shop within 48 hours. I understand that the items will be released if payment is not made during my visit.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-500">
                {/* MEASUREMENT VERSION SELECTOR */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">2. Select Pattern Version</label>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-md">{measurementHistory.length} Saved</span>
                    </div>
                    <button 
                      onClick={() => {
                        setTempPostureTags([]);
                        setTempFit('Regular');
                        setView('add-measurements');
                      }}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <UserPlus size={14} />
                      Add New Pattern
                    </button>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-4 px-2 snap-x snap-mandatory scroll-smooth custom-scrollbar">
                    {measurementHistory.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => setSelectedVersionId(profile.id)}
                        className={`shrink-0 p-5 rounded-[28px] border transition-all flex flex-col items-start min-w-[160px] snap-center relative overflow-hidden group ${selectedVersionId === profile.id ? 'bg-slate-900 border-slate-900 ring-4 ring-emerald-500/10' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                      >
                        <span className={`text-[13px] font-black tracking-tight mb-0.5 ${selectedVersionId === profile.id ? 'text-white' : 'text-slate-900'}`}>
                          {profile.versionName}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedVersionId === profile.id ? 'text-white/40' : 'text-slate-400'}`}>
                          {profile.createdAt}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      height: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: #f1f5f9;
                      border-radius: 10px;
                      margin-inline: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #10b981;
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #059669;
                    }
                  `}</style>
                </div>

                {/* ACTIVE MEASUREMENT DETAILS */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 ml-2 uppercase">3. Pattern Details</label>
                  <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-500">
                    {/* Fit & Posture Summary */}
                    <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-50">
                      <span className="px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-emerald-600/20 border border-emerald-500">
                        {activeMeasurement.fitPreference} Fit
                      </span>
                      {activeMeasurement.postureTags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Metrics Grid (Compact) */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                      {[
                        { label: 'Neck', value: activeMeasurement.neck },
                        { label: 'Shoulder', value: activeMeasurement.shoulder },
                        { label: 'Chest', value: activeMeasurement.chest },
                        { label: 'Waist', value: activeMeasurement.waist },
                        { label: 'Hips', value: activeMeasurement.hips },
                        { label: 'Sleeve', value: activeMeasurement.sleeve },
                        { label: 'Armhole', value: activeMeasurement.armhole },
                        { label: 'Bicep', value: activeMeasurement.bicep },
                        { label: 'Wrist', value: activeMeasurement.wrist },
                        { label: 'Back Width', value: activeMeasurement.backWidth },
                        { label: 'Slope', value: activeMeasurement.slope },
                        { label: 'Length', value: activeMeasurement.length },
                      ].filter(m => m.value).map((m) => (
                        <div key={m.label} className="flex justify-between items-center border-b border-slate-50 pb-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                          <span className="text-[12px] font-black text-slate-900">{m.value}&quot;</span>
                        </div>
                      ))}
                    </div>

                    {activeMeasurement.styleNotes && (
                      <div className="pt-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Style Preferences</span>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic line-clamp-2">&quot;{activeMeasurement.styleNotes}&quot;</p>
                      </div>
                    )}

                    <button 
                      onClick={() => setView('add-measurements')}
                      className="w-full mt-2 h-12 bg-slate-50 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Ruler size={14} />
                      Update Pattern Details
                    </button>
                  </div>
                </div>

                {/* QUANTITY SELECTION (BESPOKE) */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">3. Quantity</label>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-[24px] p-2.5 h-16 px-6">
                    <span className="text-[14px] font-black text-slate-900 tracking-tight">How many items?</span>
                    <div className="flex items-center bg-white border border-slate-200 rounded-2xl h-11 px-1">
                      <button 
                        type="button"
                        onClick={() => setReservationForm({...reservationForm, quantity: Math.max(1, reservationForm.quantity - 1)})}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
                      >
                        <Minus size={18} />
                      </button>
                      <div className="w-10 text-center font-black text-[14px] text-slate-900">
                        {reservationForm.quantity}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setReservationForm({...reservationForm, quantity: reservationForm.quantity + 1})}
                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-900 active:scale-90 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. TAILORING AGREEMENT */}
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">4. Tailoring Agreement</label>
                  <div 
                    onClick={() => setReservationForm({...reservationForm, agreed: !reservationForm.agreed})}
                    className={`p-6 rounded-[32px] border transition-all cursor-pointer space-y-5 ${reservationForm.agreed ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className={`text-[15px] font-black tracking-tight ${reservationForm.agreed ? 'text-white' : 'text-slate-900'}`}>Tailoring Terms</h4>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${reservationForm.agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                        {reservationForm.agreed && <CheckCircle size={14} />}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className={`text-[11px] font-bold uppercase tracking-widest ${reservationForm.agreed ? 'text-emerald-400' : 'text-slate-400'}`}>Customer Acknowledges:</p>
                      <ul className={`text-[12px] space-y-2 font-medium leading-relaxed ${reservationForm.agreed ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li className="flex gap-2">
                          <span className="text-emerald-500">•</span>
                          Production begins ONLY after payment confirmation.
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500">•</span>
                          Custom tailoring requires fittings and possible adjustments.
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500">•</span>
                          Completion dates may vary based on revisions/fitting results.
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500">•</span>
                          Custom garments are non-refundable once production starts.
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-500">•</span>
                          Remaining balance must be settled before garment release.
                        </li>
                      </ul>
                    </div>

                    <div className={`pt-4 border-t ${reservationForm.agreed ? 'border-white/10' : 'border-slate-200'}`}>
                      <p className={`text-[11px] font-black uppercase tracking-widest ${reservationForm.agreed ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {reservationForm.agreed ? 'Terms Accepted' : 'Click to Agree & Commit'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. PAYMENT TYPE SELECTION (BESPOKE) */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">5. Payment Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                    {[
                      { id: 'walk-in', label: 'Walk-In', icon: <MapPin size={14}/> },
                      { id: 'online', label: 'Online', icon: <Smartphone size={14}/> },
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setReservationForm({...reservationForm, paymentType: type.id as any})}
                        className={`h-12 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${reservationForm.paymentType === type.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {reservationForm.paymentType === 'online' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* ONLINE FLOW: COMMITMENT & METHOD */}
                    <div className="space-y-4">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">6. Online Payment Details</label>
                      
                      {/* Merchant Details */}
                      <div className="p-4 bg-slate-900 rounded-[20px] shadow-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Receiving Account</span>
                          <Smartphone size={14} className="text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white text-[14px] font-black tracking-tight">Elena Roxas</h4>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Shop Owner</p>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                            <span className="text-emerald-400 font-black text-[15px] tracking-[2px]">0917 123 4567</span>
                          </div>
                        </div>
                      </div>

                      {/* Commitment */}
                      <div className="grid grid-cols-2 gap-2">
                        {['50%', 'full'].map((mode) => (
                          <button 
                            key={mode}
                            onClick={() => setReservationForm({...reservationForm, paymentMode: mode as any})}
                            className={`h-14 rounded-2xl flex flex-col items-center justify-center transition-all border ${reservationForm.paymentMode === mode ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                          >
                            <span className="font-black text-[14px] uppercase">{mode === '50%' ? '50% Down' : 'Full Pay'}</span>
                            <span className={`text-[9px] font-bold ${reservationForm.paymentMode === mode ? 'text-white/60' : 'text-slate-400'}`}>
                              ₱{(mode === '50%' ? partialPrice : fullPrice).toLocaleString()}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Method Selection */}
                      <div className="grid grid-cols-2 gap-2">
                        {['GCash', 'Maya'].map((method) => (
                          <button 
                            key={method}
                            onClick={() => setReservationForm({...reservationForm, onlineMethod: method as any})}
                            className={`h-12 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all ${reservationForm.onlineMethod === method ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>

                      {/* Proof of Payment */}
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[11px] uppercase tracking-widest border-r border-slate-200 pr-4">Ref #</div>
                          <input 
                            type="text" 
                            placeholder="Enter Reference Number"
                            value={reservationForm.refNo}
                            onChange={(e) => setReservationForm({...reservationForm, refNo: e.target.value})}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-24 pr-6 text-[13px] font-bold outline-none focus:bg-white focus:border-emerald-500 transition-all"
                          />
                        </div>

                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <Box size={18} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700">Upload Screenshot</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setReservationForm({...reservationForm, agreed: !reservationForm.agreed})}
                    className={`animate-in fade-in slide-in-from-top-4 duration-500 p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${reservationForm.agreed ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${reservationForm.agreed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <MapPin size={16} />
                        </div>
                        <h4 className={`text-[14px] font-black tracking-tight ${reservationForm.agreed ? 'text-white' : 'text-slate-900'}`}>Pay Physically at Shop</h4>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${reservationForm.agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                        {reservationForm.agreed && <CheckCircle size={12} />}
                      </div>
                    </div>
                    
                    <p className={`text-[11px] font-medium leading-relaxed ${reservationForm.agreed ? 'text-white/50' : 'text-slate-500'}`}>
                      Visit our studio within 48 hours for fitting and payment.
                    </p>

                    <div className={`w-full p-4 rounded-xl border transition-all ${reservationForm.agreed ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                      <h5 className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${reservationForm.agreed ? 'text-emerald-400' : 'text-emerald-600'}`}>Walk-In Commitment</h5>
                      <p className={`text-[11px] font-bold leading-relaxed ${reservationForm.agreed ? 'text-white/70' : 'text-slate-600'}`}>
                        I confirm my intent to visit the shop within 48 hours. I understand that the items will be released if payment is not made during my visit.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-4 max-w-[480px] mx-auto z-50 pb-safe">
          <button 
            onClick={() => handleInquire(selectedItem!)}
            className="flex-1 h-16 bg-white border border-emerald-100 text-emerald-700 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare size={18} />
            Inquire
          </button>
          <button 
            onClick={confirmReservation}
            disabled={!reservationForm.agreed}
            className={`flex-[2] h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${!reservationForm.agreed ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 text-white shadow-emerald-600/20'}`}
          >
            {reservationForm.paymentType === 'walk-in' ? 'Save Reservation' : 'Submit Payment Proof'}
            <ArrowRight size={18} />
          </button>
        </div>

        {/* PRODUCT RATING MODAL (SHARED) */}
        {selectedReviewItem && (
          <div className="fixed inset-0 z-[12000] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-white/20">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                    <img src={selectedReviewItem.img} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-1">Rate this item</h3>
                    <p className="text-[11px] font-bold text-slate-400 leading-tight line-clamp-1">{selectedReviewItem.name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReviewItem(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="text-center py-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Overall Quality</p>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="transition-all active:scale-90">
                        <Star size={32} className={`${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Write your review</label>
                  <textarea 
                    placeholder="Tell others about the fit, fabric, and quality..."
                    className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[28px] p-6 text-[13px] font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                  />
                </div>

                <button 
                  onClick={() => setSelectedReviewItem(null)}
                  className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                >
                  Post Review & Rating
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col relative w-full">
      {/* CONFIRMATION TOAST */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[11000] animate-in slide-in-from-top-10 duration-500 w-[90%] max-w-[400px]">
          <div className="bg-slate-900 text-white px-6 py-5 rounded-[32px] shadow-2xl flex items-start gap-4 border border-white/10 backdrop-blur-xl">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[14px] font-black tracking-tight mb-1">Item Reserved Successfully!</p>
              <p className="text-[11px] text-white/60 font-medium leading-relaxed">Please visit the shop within 48 hours for fitting and payment confirmation.</p>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative h-[320px] w-full overflow-hidden">
        <img 
          src="/assets/designer-filipiniana.png" 
          alt="Shop Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
        
        {/* Header Controls */}
        <div className="absolute top-8 inset-x-6 flex justify-between items-center z-20">
          <Link href="/shops" className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
            <ChevronLeft size={24} />
          </Link>
          <button className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
            <Share2 size={20} />
          </button>
        </div>

        {/* Shop Branding Overlay */}
        <div className="absolute bottom-8 inset-x-8 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white p-2 rounded-[28px] shadow-2xl relative shrink-0">
              <div className="w-full h-full bg-slate-50 rounded-[20px] overflow-hidden flex items-center justify-center border border-slate-100 p-2">
                 <img src="/catalog/Golden Needle Tailoring LOGO.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight">Golden Needle Tailoring</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[12px] font-bold text-white/70">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-emerald-400"/> Davao City</span>
            <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400"/> 4.9 (128)</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400"/> Premium Shop</span>
          </div>
        </div>
      </div>

      {/* SHOP ACTIONS */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-2">
        <button 
          onClick={() => setView('book-appointment')}
          className="flex-[3] h-14 bg-[#069668] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
        >
          <Calendar size={18} />
          Book Appointment
        </button>
        
        <button 
          onClick={() => toggleFollowShop(shopId as string)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 border ${isFollowing ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-slate-100 text-slate-400'}`}
        >
          {isFollowing ? <UserCheck size={22} /> : <UserPlus size={22} />}
        </button>

        <button className="w-14 h-14 bg-white text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all">
          <MessageSquare size={20} />
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-8 px-6 border-b border-slate-100 bg-[#FAF8F5] sticky top-[64px] z-[1000]">
        {[
          { id: 'premade', label: 'Store', icon: <Box size={16}/> },
          { id: 'about', label: 'Bio', icon: <LayoutGrid size={16}/> },
          { id: 'branches', label: 'Branches', icon: <MapPin size={16}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pt-6 pb-4 flex items-center gap-2 text-[13px] font-black transition-all relative uppercase tracking-widest ${activeTab === tab.id ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-800'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-t-full animate-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 px-6 py-8 pb-12">
        
        {/* PREMADE INVENTORY */}
        {activeTab === 'premade' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
            <div>
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-2">Ready-to-Wear</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic opacity-80">Available for fitting in our studio today.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {PREMIUM_INVENTORY.map(item => (
                <div key={item.id} className="bg-white border border-slate-100 rounded-[32px] overflow-hidden group hover:shadow-xl transition-all p-4">
                  <div className="relative h-72 rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 mb-4">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-700 border border-emerald-50 shadow-sm">
                      {item.category}
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-[18px] font-black text-slate-900 leading-tight">{item.name}</h3>
                      <span className="text-[16px] font-black text-emerald-700">{item.price}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-black text-slate-900">{item.rating}</span>
                        <button 
                          onClick={() => setSelectedReviewItem(item)}
                          className="text-[9px] font-black text-emerald-600 underline decoration-2 underline-offset-2 ml-1"
                        >
                          Rate
                        </button>
                      </div>
                      <div className="h-3 w-px bg-slate-100" />
                      <button 
                        onClick={() => handleInquire(item)}
                        className="flex items-center gap-1.5 hover:opacity-70 transition-all"
                      >
                        <MessageSquare size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Inquire</span>
                      </button>
                      <div className="h-3 w-px bg-slate-100" />
                      <button 
                        onClick={() => toggleHeartItem(`ITM-00${item.id}`)}
                        className="flex items-center gap-1.5 active:scale-90 transition-all"
                      >
                        <Heart size={12} className={heartedItems.includes(`ITM-00${item.id}`) ? "text-rose-500 fill-rose-500" : "text-slate-300"} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${heartedItems.includes(`ITM-00${item.id}`) ? "text-rose-500" : "text-slate-400"}`}>
                          {heartedItems.includes(`ITM-00${item.id}`) ? item.likes + 1 : item.likes}
                        </span>
                      </button>
                    </div>

                    <p className="text-[12px] text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed">{item.description}</p>
                    
                    <button 
                      onClick={() => handleReserve(item)}
                      className="w-full h-14 bg-slate-900 hover:bg-emerald-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                      Reserve & Fit Today
                      <ArrowRight size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RELATED BRANCHES */}
        {activeTab === 'branches' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
            <div>
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight mb-2">Our Studios</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic opacity-80">Choose the most convenient location for your fitting.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { name: "Main Boutique Studio", address: "123 Quirino Ave, Davao City", phone: "0912 345 6789", status: "Active" },
                { name: "SM Lanang Atelier", address: "2nd Level, SM Lanang Premier", phone: "0912 345 6780", status: "Active" },
                { name: "Abreeza Fitting Room", address: "3rd Level, Abreeza Mall", phone: "0912 345 6781", status: "Closed for Renovation" },
              ].map((branch, i) => (
                <div key={i} className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${branch.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                      {branch.status}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-black text-slate-900 mb-1">{branch.name}</h3>
                  <p className="text-[13px] text-slate-500 font-medium mb-4 leading-relaxed">{branch.address}</p>
                  
                  <div className="h-px bg-slate-50 mb-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[11px] font-bold">9:00 AM - 8:00 PM</span>
                    </div>
                    <button className="text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
                      View Map
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THE BIO (ABOUT) */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
            <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 shadow-sm">
              <h2 className="text-[20px] font-black text-emerald-900 mb-4 tracking-tight">Our Master Story</h2>
              <p className="text-emerald-800 leading-relaxed text-[14px] font-medium opacity-80">
                Golden Needle has been a cornerstone of Davao formalwear for over 20 years. 
                Blended traditional techniques with modern style, we specialize in high-end bespoke tailoring 
                for the city&apos;s most prestigious events.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest px-2">Core Services</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Bespoke Made-to-Measure", "Formal Alterations", 
                  "Bridal Gowns", "Corporate Uniform Design"
                ].map((s,i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <CheckCircle size={20} />
                    </div>
                    <span className="text-[14px] font-black text-slate-700 tracking-tight">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[32px] text-white">
              <h3 className="text-[14px] font-black uppercase tracking-widest mb-6 text-emerald-400">Atelier Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold">123 Quirino Ave, Davao City</p>
                    <p className="text-[11px] text-white/40 font-medium mt-1 uppercase tracking-widest">Master Studio Location</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold">Mon - Sat: 9:00 AM - 6:00 PM</p>
                    <p className="text-[11px] text-white/40 font-medium mt-1 uppercase tracking-widest">Business Hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RATINGS & REVIEWS */}
            <div className="space-y-6 mt-12 pt-12 border-t border-slate-100">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Ratings & Reviews</h3>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-[14px] font-black text-slate-900">4.9</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">How was your experience?</p>
                 <div className="flex justify-center gap-2 mb-8">
                   {[1,2,3,4,5].map(s => (
                     <button key={s} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 hover:text-amber-400 hover:bg-amber-50 transition-all active:scale-90">
                       <Star size={24} className={s <= 4 ? "fill-amber-400 text-amber-400" : "fill-current"} />
                     </button>
                   ))}
                 </div>
                 <textarea 
                   placeholder="Write your review here... (Optional)"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[13px] font-medium min-h-[100px] outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all mb-4"
                 />
                 <button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                   Submit My Review
                 </button>
              </div>

              {/* MOCK REVIEWS LIST */}
              <div className="space-y-4">
                {[
                  { user: "Maria Clara", rating: 5, comment: "Excellent craftsmanship on my Filipiniana! The fit was perfect on the first try.", date: "2 days ago" },
                  { user: "Jose Rizal", rating: 4, comment: "Great quality suits. A bit of a wait but definitely worth it.", date: "1 week ago" }
                ].map((rev, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white border border-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-black text-slate-900">{rev.user}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed font-medium italic">&quot;{rev.comment}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* PRODUCT RATING MODAL */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-[12000] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-white/20">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                  <img src={selectedReviewItem.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-1">Rate this item</h3>
                  <p className="text-[11px] font-bold text-slate-400 leading-tight line-clamp-1">{selectedReviewItem.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReviewItem(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="text-center py-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Overall Quality</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="transition-all active:scale-90">
                      <Star size={32} className={`${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Write your review</label>
                <textarea 
                  placeholder="Tell others about the fit, fabric, and quality..."
                  className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[28px] p-6 text-[13px] font-medium outline-none focus:bg-white focus:border-emerald-500 transition-all resize-none"
                />
              </div>

              <button 
                onClick={() => setSelectedReviewItem(null)}
                className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-slate-900/10"
              >
                Post Review & Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
