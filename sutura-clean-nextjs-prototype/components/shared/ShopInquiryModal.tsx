'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Send, Scissors, Ruler, HelpCircle, Package, Image as ImageIcon } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

interface ShopInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
}

export const ShopInquiryModal: React.FC<ShopInquiryModalProps> = ({
  isOpen,
  onClose,
  shopName
}) => {
  const { pushNotification } = useERPStore();
  const [subject, setSubject] = useState('Custom Design Order');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      pushNotification('Please enter a message for your inquiry.', 'error');
      return;
    }

    // Simulate sending inquiry
    pushNotification(`Inquiry sent to ${shopName}! They will get back to you shortly.`, 'success');
    onClose();
  };

  const SUBJECTS = [
    { id: 'Custom Tailoring', icon: <SparklesIcon className="text-amber-500"/>, desc: 'Bespoke / one-of-a-kind garment' },
    { id: 'Bulk Order (Uniforms)', icon: <Package className="text-purple-500"/>, desc: 'Group orders, teams, or corporate' },
    { id: 'Repair & Alterations', icon: <Scissors className="text-emerald-500"/>, desc: 'Adjustments, resizing, or patching' },
    { id: 'Price Inquiry', icon: <HelpCircle className="text-blue-500"/>, desc: 'Get an estimate for your design' },
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[600px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-[24px] font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="text-emerald-600" size={24} />
              Inquire with {shopName}
            </h2>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Get professional tailoring advice</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Subject Selection */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">What are you inquiring about?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all text-left group ${
                    subject === s.id 
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' 
                      : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="mt-0.5">{s.icon}</div>
                  <div>
                    <div className={`text-[13px] font-black ${subject === s.id ? 'text-emerald-900' : 'text-slate-900'}`}>{s.id}</div>
                    <div className="text-[10px] font-medium text-slate-500">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Message</label>
            <div className="relative group">
              <textarea 
                className="w-full h-40 px-6 py-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-medium text-slate-900 focus:bg-white focus:border-emerald-600 transition-all resize-none shadow-inner"
                placeholder="Describe your design ideas, garment type, or specific requirements..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="absolute bottom-4 right-6 flex items-center gap-2 text-slate-300">
                <ImageIcon size={16} className="cursor-pointer hover:text-emerald-500 transition-colors" />
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <span className="text-[10px] font-bold">{message.length}/1000</span>
              </div>
            </div>
          </div>

          {/* Summary / Info */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
            <HelpCircle className="text-amber-600 mt-0.5 shrink-0" size={18} />
            <p className="text-[11px] font-medium text-amber-900 leading-relaxed">
              Ateliers usually respond within <span className="font-black">2-4 hours</span> during business days. For urgent matters, we recommend booking a direct consultation.
            </p>
          </div>

          {/* Action */}
          <button 
            onClick={handleSubmit}
            className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[15px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-3 group"
          >
            Send Inquiry <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Icon components
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
