'use client';

import { useState } from 'react';
import { useERPStore } from '../../store/useERPStore';
import { 
  User, 
  Shield, 
  Globe, 
  Save, 
  Camera,
  Mail,
  Smartphone,
  Lock,
  Building2,
  Palette,
  Clock,
  Eye,
  LogOut,
  ChevronRight,
  ExternalLink,
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { currentUser } = useERPStore();

  // --- BRANDING STATE (FOR LIVE PREVIEW) ---
  const [branding, setBranding] = useState({
    shopName: 'Davao Tailoring Shop',
    tagline: 'Precision in every stitch, excellence in every fit.',
    primaryColor: '#4f46e5', // Indigo 600
    accentColor: '#10b981',  // Emerald 500
    establishedYear: '2022',
    address: '123 Tailor Street, Manila',
    phone: '+63 912 345 6789',
    links: [
      { id: 1, label: 'Facebook', url: 'https://facebook.com/davaotailor' },
      { id: 2, label: 'Instagram', url: 'https://instagram.com/davaotailor' }
    ]
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

  const updateLink = (id: number, field: 'label' | 'url', value: string) => {
    setBranding({
      ...branding,
      links: branding.links.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  // --- OPERATING HOURS STATE ---
  const [hours, setHours] = useState([
    { day: 'Monday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Tuesday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Wednesday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Thursday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Friday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Saturday', open: '10:00 AM', close: '04:00 PM', isOpen: true },
    { day: 'Sunday', open: 'Closed', close: 'Closed', isOpen: false },
  ]);

  const tabs = [
    { id: 'general', name: 'General', icon: <User size={18} /> },
    { id: 'account', name: 'Account Settings', icon: <Lock size={18} /> },
    { id: 'branding', name: 'Shop Branding', icon: <Palette size={18} /> },
    { id: 'system', name: 'System', icon: <Globe size={18} /> },
  ];

  // --- RENDER FUNCTIONS ---

  const renderGeneral = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-slate-400" /> Public Profile
        </h3>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white overflow-hidden shadow-xl border-4 border-white">
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={20} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
              <input type="text" defaultValue={currentUser.name} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <input type="text" value="Shop Owner" disabled className="w-full h-12 px-5 bg-slate-100 border border-slate-100 rounded-xl text-[14px] font-black text-slate-400 outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Business Info Card */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-slate-400" /> Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
            <input type="text" defaultValue="Sutura Tailoring HQ" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Type</label>
            <select className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none appearance-none">
              <option>Bespoke Tailoring</option>
              <option>Ready-to-Wear</option>
              <option>Uniform Supply</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
            <input type="text" defaultValue="+63 912 345 6789" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Headquarters Address</label>
            <input type="text" defaultValue="123 Tailor Street, Manila, Philippines" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-sm">
            Save Business Info
          </button>
        </div>
      </div>

      {/* Operating Hours Grid */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Operating Hours
          </h3>
          <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Weekly Schedule</span>
        </div>
        <div className="space-y-3">
          {hours.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] ${item.isOpen ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-200 text-slate-400'}`}>
                  {item.day.substring(0, 3)}
                </div>
                <span className={`text-[14px] font-bold ${item.isOpen ? 'text-slate-700' : 'text-slate-400'}`}>{item.day}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {item.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue={item.open} className="w-24 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-center outline-none focus:border-slate-900" />
                    <span className="text-slate-300">—</span>
                    <input type="text" defaultValue={item.close} className="w-24 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-center outline-none focus:border-slate-900" />
                  </div>
                ) : (
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-4">Closed for Business</span>
                )}
                
                <button 
                  onClick={() => {
                    const newHours = [...hours];
                    newHours[idx].isOpen = !newHours[idx].isOpen;
                    setHours(newHours);
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative ${item.isOpen ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.isOpen ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-sm">
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Account Details */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-slate-400" /> Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input type="email" defaultValue="joshua@sutura.com" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900" />
              <Mail className="absolute right-4 top-3.5 text-slate-300" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input type="text" defaultValue="joshua_owner" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900" />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-slate-400" /> Account Security
        </h3>
        <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
              <Lock size={20} />
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-900">Change Password</div>
              <div className="text-[12px] text-slate-500 font-medium">Last changed 3 months ago</div>
            </div>
          </div>
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[13px] font-black hover:bg-slate-50 transition-all shadow-sm"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Session Control */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
            <Smartphone size={20} className="text-slate-400" /> Active Sessions
          </h3>
          <button className="text-[12px] font-black text-rose-600 hover:text-rose-700 flex items-center gap-1">
            <LogOut size={14} /> Log out all devices
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Globe size={18} />
              </div>
              <div>
                <div className="text-[13px] font-black text-slate-900">Chrome on macOS (Current)</div>
                <div className="text-[11px] text-slate-400 font-medium">Manila, PH • 192.168.1.1</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Smartphone size={18} />
              </div>
              <div>
                <div className="text-[13px] font-black text-slate-900">iPhone 15 Pro</div>
                <div className="text-[11px] text-slate-400 font-medium">Manila, PH • 2 days ago</div>
              </div>
            </div>
            <button className="text-slate-300 hover:text-rose-500 transition-colors">
              <AlertCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBranding = () => (
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

  const renderSystem = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Financial Settings */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-slate-400" /> Financial Settings
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">VAT / Tax Rate (%)</label>
            <div className="relative">
              <input type="number" defaultValue="12" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-black outline-none focus:bg-white focus:border-slate-900" />
              <span className="absolute right-5 top-3.5 text-slate-400 font-black">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Prefix</label>
            <div className="flex items-center gap-3">
              <input type="text" defaultValue="SUT" className="w-32 h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-black outline-none focus:bg-white focus:border-slate-900 uppercase" />
              <div className="flex-1 h-12 bg-slate-100 rounded-xl flex items-center px-4 text-[12px] font-bold text-slate-400 italic">
                Example: SUT-2024-001
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Pricing Rules</label>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-600">Auto-include Labor in Tax</span>
                <button className="w-10 h-5 bg-slate-900 rounded-full relative">
                  <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between group relative">
                <span className="text-[13px] font-bold text-slate-600 flex items-center gap-2">
                  Rounding (Up to nearest 10)
                </span>
                <button className="w-10 h-5 bg-slate-900 rounded-full relative">
                  <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Localization Settings */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 h-fit">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Globe size={24} />
          </div>
          <h4 className="text-[18px] font-black tracking-tight mb-2">Regional Controls</h4>
          <p className="text-[13px] text-slate-400 font-medium mb-8">System-wide timezone and currency preferences.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Timezone</label>
              <div className="relative">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[14px] font-black outline-none px-5 appearance-none cursor-pointer hover:bg-white/10 transition-all">
                  <option className="bg-slate-900">GMT+8 (Manila)</option>
                  <option className="bg-slate-900">GMT+0 (UTC)</option>
                  <option className="bg-slate-900">EST (New York)</option>
                </select>
                <ChevronRight className="absolute right-4 top-4 text-slate-500 rotate-90" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Currency</label>
              <div className="relative">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[14px] font-black outline-none px-5 appearance-none cursor-pointer hover:bg-white/10 transition-all">
                  <option className="bg-slate-900">Philippine Peso (₱)</option>
                  <option className="bg-slate-900">US Dollar ($)</option>
                  <option className="bg-slate-900">Euro (€)</option>
                </select>
                <ChevronRight className="absolute right-4 top-4 text-slate-500 rotate-90" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Settings</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-2">Manage your luxury tailoring shops global configuration and profile.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-2xl text-[13px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
            Discard
          </button>
          <button className="bg-slate-900 text-white h-12 px-8 rounded-2xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 group">
            <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Changes
          </button>
        </div>
      </div>

      {/* ── CAPSULE TABS ── */}
      <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[20px] w-fit border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-[13px] font-black transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 translate-y-[-1px]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-indigo-600' : ''}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="pb-20">
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'account' && renderAccount()}
        {activeTab === 'branding' && renderBranding()}
        {activeTab === 'system' && renderSystem()}
      </div>

      {/* --- PASSWORD CHANGE MODAL --- */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[24px] font-black text-slate-900 tracking-tight">Change Password</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <ChevronRight size={20} className="rotate-180" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" />
              </div>
            </div>
            
            <div className="mt-10 flex flex-col gap-3">
              <button className="w-full h-12 bg-slate-900 text-white rounded-2xl text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                Update Security Credentials
              </button>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-full h-12 text-slate-400 text-[13px] font-black hover:text-slate-600 transition-all"
              >
                Cancel and Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
