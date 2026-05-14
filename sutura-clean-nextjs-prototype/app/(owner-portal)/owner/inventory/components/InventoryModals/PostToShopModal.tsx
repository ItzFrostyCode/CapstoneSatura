'use client';

import React, { useState } from 'react';
import { X, Globe, CheckCircle, ArrowRight, Package, Tag, ShieldCheck, Zap } from 'lucide-react';
import { InventoryItem } from '@/types/erp';

interface PostToShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onConfirm: (item: InventoryItem) => void;
}

export function PostToShopModal({ isOpen, onClose, item, onConfirm }: PostToShopModalProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm(item);
        setSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Post to Shop</h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Marketplace Sync</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!success ? (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Package size={32} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 italic text-lg">{item.item || item.item_name}</h3>
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.sku}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Retail Price</span>
                    <div className="text-lg font-black text-slate-900">₱{(item.price || item.unit_price || 0).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Available Stock</span>
                    <div className="text-lg font-black text-slate-900">{item.stock} Units</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Publishing Settings</h4>
                
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-500/30 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                       <ShieldCheck size={18} />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-slate-900">Show in Discover Map</div>
                       <div className="text-[10px] text-slate-500 font-medium">Highlight this item for nearby customers</div>
                     </div>
                   </div>
                   <div className="w-12 h-6 bg-emerald-600 rounded-full relative p-1 shadow-inner">
                     <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                   </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-500/30 hover:bg-indigo-50/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Zap size={18} />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-slate-900">Featured Placement</div>
                       <div className="text-[10px] text-slate-500 font-medium">Place at the top of your shop profile</div>
                     </div>
                   </div>
                   <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 transition-colors">
                     <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm" />
                   </div>
                </div>
              </div>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[13px] hover:bg-emerald-700 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isPublishing ? (
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    Publish to Storefront <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/10 border-4 border-white">
                <CheckCircle size={48} className="animate-in slide-in-from-bottom-2 duration-700" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 italic">Product Published!</h2>
              <p className="text-slate-500 font-medium max-w-[280px]">
                {item.item || item.item_name} is now live and visible to all customers on your public profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
