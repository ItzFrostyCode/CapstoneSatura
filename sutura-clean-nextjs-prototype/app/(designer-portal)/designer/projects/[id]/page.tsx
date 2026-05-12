'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Send, Scissors, 
  Palette, Ruler, Info, Layers, 
  Clock, CheckCircle2, ChevronRight, 
  Image as ImageIcon, FileText, Share2
} from 'lucide-react';
import Link from 'next/link';

// Mock Data for the Scalable Blueprint
const mockBlueprint = {
  id: "DS-2026-001",
  requestId: "REQ-992",
  customerName: "Maria Clara Santos",
  garmentType: "Modern Filipiniana Gown",
  targetDate: "June 15, 2026",
  status: 'Draft',
  inspirationImages: [
    { url: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=400", note: "Traditional silhouette reference" },
    { url: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=400", note: "Modern sleeve embroidery" }
  ],
  sketches: [
    { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600", version: "v1.2", date: "May 10, 2026" }
  ],
  fabricSuggestions: [
    { name: "Pina Silk", type: "Main Body", color: "Ivory" },
    { name: "Raw Silk", type: "Lining", color: "Champagne" }
  ],
  colorPalette: [
    { name: "Ivory Pearl", hex: "#F5F5F0" },
    { name: "Golden Sand", hex: "#E2D1B3" },
    { name: "Deep Rose", hex: "#8D4E5B" }
  ],
  styleNotes: [
    "High-low hemline with structured butterfly sleeves",
    "Hand-embroidered floral patterns on the bodice",
    "Hidden side zipper for a cleaner silhouette"
  ],
  measurementRequirements: [
    "Precision bust and waist fitting required",
    "Sleeve height: Exactly 10 inches from shoulder",
    "Train length: 12 inches"
  ],
  specialInstructions: [
    "Reinforced internal boning for bodice structure",
    "Use only non-synthetic threads for embroidery"
  ],
  revisions: [
    { date: "May 08, 2026", note: "Adjusted sleeve volume based on consultation", author: "Designer Elena" },
    { date: "May 10, 2026", note: "Finalized fabric selection with client", author: "Designer Elena" }
  ]
};

export default function DesignSpecSheet() {
  const [activeTab, setActiveTab] = useState('visuals');

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-outfit text-slate-900 pb-24">
      {/* Premium Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100/50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/designer/projects" className="p-2 hover:bg-orange-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-orange-400 bg-orange-50 px-2 py-0.5 rounded">Specification Sheet</span>
              <span className="text-[10px] font-bold text-slate-400">ID: {mockBlueprint.id}</span>
            </div>
            <h1 className="text-xl font-black tracking-tight">{mockBlueprint.garmentType}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95">
            <Send className="w-4 h-4" />
            Forward to Shop
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Visual Documentation */}
          <div className="lg:col-span-7 space-y-8">
            {/* Primary Sketch Card */}
            <div className="bg-white rounded-[32px] p-8 border border-orange-100/50 shadow-sm overflow-hidden group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black tracking-tight">Main Concept Sketch</h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Latest: {mockBlueprint.sketches[0].version}</span>
              </div>
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src={mockBlueprint.sketches[0].url} 
                  alt="Main Sketch"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:bg-white transition-colors">
                    <Layers className="w-5 h-5 text-slate-600" />
                  </button>
                  <button className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl hover:bg-white transition-colors">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Inspiration Board */}
            <div className="grid grid-cols-2 gap-4">
              {mockBlueprint.inspirationImages.map((img, idx) => (
                <div key={idx} className="bg-white p-4 rounded-3xl border border-orange-100/50 shadow-sm">
                  <img src={img.url} alt="Inspiration" className="w-full aspect-square object-cover rounded-2xl mb-3" />
                  <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{img.note}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Technical Specifications */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Customer Brief Info */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Client & Timeline</span>
                <h3 className="text-2xl font-black mb-1">{mockBlueprint.customerName}</h3>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-400" /> {mockBlueprint.targetDate}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Consultation Complete</span>
                </div>
              </div>
            </div>

            {/* Scalable Spec Modules */}
            <div className="grid gap-6">
              
              {/* Fabrics & Colors */}
              <div className="bg-white rounded-[32px] p-8 border border-orange-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-5 h-5 text-orange-500" />
                  <h4 className="font-black">Materials & Palette</h4>
                </div>
                
                <div className="space-y-4 mb-6">
                  {mockBlueprint.fabricSuggestions.map((fabric, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div>
                        <div className="text-sm font-black text-slate-900">{fabric.name}</div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{fabric.type}</div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">{fabric.color}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {mockBlueprint.colorPalette.map((color, i) => (
                    <div key={i} className="group relative">
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-help" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {color.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style & Measurements */}
              <div className="bg-white rounded-[32px] p-8 border border-orange-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Ruler className="w-5 h-5 text-orange-500" />
                  <h4 className="font-black">Technical Specs</h4>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Style Details</span>
                    <ul className="space-y-2">
                      {mockBlueprint.styleNotes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-600">
                          <ChevronRight className="w-4 h-4 text-orange-300 mt-0.5 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Special Instructions</span>
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                      <ul className="space-y-2">
                        {mockBlueprint.specialInstructions.map((note, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm font-bold text-orange-800">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revision History */}
              <div className="bg-white rounded-[32px] p-8 border border-orange-100/50 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-orange-500" />
                  <h4 className="font-black">Revision Log</h4>
                </div>
                <div className="space-y-4">
                  {mockBlueprint.revisions.map((rev, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-orange-300 rounded-full" />
                        <div className="w-0.5 h-full bg-orange-50" />
                      </div>
                      <div className="pb-4">
                        <div className="text-xs font-black text-slate-900">{rev.date}</div>
                        <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">{rev.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Sticky Handover Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-orange-100/50 p-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8">
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
              <Scissors className="w-5 h-5 text-slate-400" />
            </div>
            <div className="text-sm font-medium text-slate-500">
              Handover status: <span className="text-slate-900 font-black">Not yet sent to Shop</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-3.5 bg-white border-2 border-slate-100 text-slate-900 text-sm font-black rounded-2xl hover:border-slate-900 transition-all flex items-center justify-center gap-2">
              <Layers className="w-4 h-4" />
              Save as Draft
            </button>
            <button className="flex-1 md:flex-none px-12 py-3.5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 group">
              Confirm & Forward to Shop
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
