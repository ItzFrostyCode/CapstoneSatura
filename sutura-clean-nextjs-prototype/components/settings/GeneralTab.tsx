'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Building2, Clock, Camera, RefreshCw, Calendar, ShieldCheck } from 'lucide-react';
import { User as UserType } from '@/types/erp';
import { useERPStore } from '@/store/useERPStore';

interface GeneralTabProps {
  currentUser: UserType;
}

export function GeneralTab({ currentUser }: GeneralTabProps) {
  const { currentSubscription, updateUserAvatar } = useERPStore();
  
  // Operating Hours State
  const [hours, setHours] = useState([
    { day: 'Monday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Tuesday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Wednesday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Thursday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Friday', open: '09:00 AM', close: '06:00 PM', isOpen: true },
    { day: 'Saturday', open: '10:00 AM', close: '04:00 PM', isOpen: true },
    { day: 'Sunday', open: 'Closed', close: 'Closed', isOpen: false },
  ]);

  const toggleDay = (idx: number) => {
    const newHours = [...hours];
    newHours[idx].isOpen = !newHours[idx].isOpen;
    setHours(newHours);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-slate-400" /> Public Profile
        </h3>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl bg-indigo-50 flex items-center justify-center text-white overflow-hidden shadow-xl border-4 border-white relative">
                {currentUser.avatar ? (
                  <Image 
                    src={currentUser.avatar} 
                    alt="Avatar" 
                    fill 
                    unoptimized
                    className="object-contain p-2" 
                  />
                ) : (
                  <User size={32} className="text-slate-300" />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
              <input 
                type="text" 
                defaultValue={currentUser.name} 
                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
              <input 
                type="text" 
                value="Shop Owner" 
                disabled 
                className="w-full h-12 px-5 bg-slate-100 border border-slate-100 rounded-xl text-[14px] font-black text-slate-400 outline-none" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 rounded-[32px] p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={28} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-black tracking-tight">{currentSubscription?.planName || 'Premium Plan'}</h3>
                <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <p className="text-slate-400 text-[13px] font-medium mt-1">Your subscription is managed monthly.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Calendar size={12} /> Start Date
              </div>
              <div className="text-[14px] font-black text-white">
                {currentSubscription?.startDate ? formatDate(currentSubscription.startDate) : 'May 1, 2026'}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Calendar size={12} /> Renewal Date
              </div>
              <div className="text-[14px] font-black text-indigo-300">
                {currentSubscription?.endDate ? formatDate(currentSubscription.endDate) : 'June 1, 2026'}
              </div>
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
            <input 
              type="text" 
              defaultValue="Sutura Tailoring HQ" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" 
            />
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
            <input 
              type="text" 
              defaultValue="+63 912 345 6789" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Headquarters Address</label>
            <input 
              type="text" 
              defaultValue="123 Tailor Street, Manila, Philippines" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" 
            />
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
                    <input 
                      type="text" 
                      defaultValue={item.open} 
                      className="w-24 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-center outline-none focus:border-slate-900" 
                    />
                    <span className="text-slate-300">—</span>
                    <input 
                      type="text" 
                      defaultValue={item.close} 
                      className="w-24 h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-bold text-center outline-none focus:border-slate-900" 
                    />
                  </div>
                ) : (
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-4">Closed for Business</span>
                )}
                
                <button 
                  onClick={() => toggleDay(idx)}
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
}
