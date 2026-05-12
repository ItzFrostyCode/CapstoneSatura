'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Heart, SlidersHorizontal, ShoppingBag, Calendar as CalendarIcon, Map } from 'lucide-react';
import { MapModal } from '@/components/shared/MapModal';

const DESIGNS = [
  {
    id: 'DS-001',
    name: 'Midnight Silk Gala',
    category: 'Evening Wear',
    description: 'A flowing midnight blue silk gown with elegant hand-draped detailing.',
    price: '₱24,500',
    type: 'BESPOKE',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviews: 12
  },
  {
    id: 'DS-002',
    name: 'Crimson Velvet Tuxedo',
    category: 'Formal Wear',
    description: 'Sharp tailored crimson velvet blazer with satin peak lapels.',
    price: '₱18,200',
    type: 'MADE-TO-MEASURE',
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 8
  },
  {
    id: 'DS-003',
    name: 'Ivory Linen Summer Set',
    category: 'Casual Luxury',
    description: 'Breathable ivory linen shirt and trouser set, perfect for garden events.',
    price: '₱9,500',
    type: 'READY-TO-WEAR',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviews: 15
  },
  {
    id: 'DS-004',
    name: 'Emerald Silk Filipiniana',
    category: 'Traditional',
    description: 'Modernized butterfly sleeves in emerald silk with minimal floral embroidery.',
    price: '₱15,000',
    type: 'BESPOKE',
    image: '/mockups/emerald-filipiniana.png',
    rating: 5.0,
    reviews: 5
  },
  {
    id: 'DS-005',
    name: 'Charcoal Herringbone Suit',
    category: 'Business',
    description: 'Classic charcoal herringbone wool suit, double-breasted for a powerful silhouette.',
    price: '₱22,000',
    type: 'MADE-TO-MEASURE',
    image: '/mockups/charcoal-suit.png',
    rating: 4.9,
    reviews: 21
  },
  {
    id: 'DS-006',
    name: 'Obsidian Leather Biker',
    category: 'Outerwear',
    description: 'Hand-crafted obsidian leather jacket with premium silver hardware.',
    price: '₱28,000',
    type: 'BESPOKE',
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviews: 9
  }
];

const DESIGNERS = [
  { id: 'D-001', name: 'Edgar Buyan', location: 'Davao City', rating: 5.0, type: 'Couture', reviews: 45, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', isVerified: true },
  { id: 'D-002', name: 'Francis Libiran', location: 'Manila (Remote)', rating: 4.9, type: 'Avant Garde', reviews: 120, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', isVerified: true },
  { id: 'D-003', name: 'Michael Cinco', location: 'Dubai / Davao', rating: 5.0, type: 'High Fashion', reviews: 340, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', isVerified: true },
];

export default function PremadeDesigns() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      {/* Premium Header */}
      <section className="bg-slate-50 pt-32 pb-20 px-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-indigo-600 font-black tracking-widest text-[12px] uppercase mb-4 block">Designer Collective</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
                Premade Designs <span className="text-slate-400">&</span> Blueprints.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Browse our curated selection of bespoke-ready designs. Select a blueprint to start your custom tailoring journey with our master shops.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMapModalOpen(true)}
                className="h-12 px-6 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 font-black flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
              >
                <Map size={18} />
                View Map
              </button>
              <button className="h-12 px-6 rounded-full border border-slate-200 bg-white text-slate-900 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                <SlidersHorizontal size={18} />
                Filters
              </button>
              <div className="h-12 w-px bg-slate-200 mx-2 hidden md:block"></div>
              <p className="text-[14px] font-bold text-slate-400">
                <span className="text-slate-900 font-black">60+</span> Designs Available
              </p>
            </div>
          </div>
        </div>
      </section>

      <MapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        shops={DESIGNERS}
        title="Designer Studio Network"
        type="designer"
      />

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DESIGNS.map((design) => (
            <div key={design.id} className="group relative">
              {/* Image Container */}
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-6 bg-slate-100 shadow-sm border border-slate-50">
                <Image 
                  src={design.image} 
                  alt={design.name} 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black tracking-widest uppercase text-slate-900 shadow-sm border border-white/20">
                    {design.type}
                  </span>
                </div>

                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all shadow-xl">
                  <Heart size={20} />
                </button>

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex flex-col gap-3">
                    <Link 
                      href="/customer/profile/edgar-buyan"
                      className="w-full h-12 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-white hover:text-slate-900 transition-all"
                    >
                      View Portfolio
                    </Link>
                    <Link 
                      href="/customer/book"
                      className="w-full h-12 bg-white text-slate-900 rounded-xl font-black text-[14px] flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-2xl"
                    >
                      <CalendarIcon size={18} /> Book Appointment
                    </Link>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{design.name}</h3>
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{design.category}</p>
                  </div>
                  <p className="text-lg font-black text-indigo-600">{design.price}</p>
                </div>
                
                <p className="text-[14px] text-slate-500 font-medium mb-4 line-clamp-2">
                  {design.description}
                </p>

                <div className="flex items-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-[12px] font-black text-slate-900">{design.rating}</span>
                  </div>
                  <div className="hidden lg:block w-px h-10 bg-slate-200"></div>
                  <span className="text-[12px] font-bold uppercase tracking-widest">{design.reviews} Reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-slate-900 rounded-[48px] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
          </div>
          
          <div className="max-w-2xl relative z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
              Dont see your vision? <br />
              <span className="text-slate-400">Commission a designer.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium mb-12 leading-relaxed">
              Connect with our master designers to create a one-of-a-kind blueprint tailored exclusively to your measurements and aesthetic.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto h-16 px-10 bg-indigo-600 text-white rounded-full font-black text-[16px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                Find a Designer
              </button>
              <button className="w-full sm:w-auto h-16 px-10 bg-white/10 text-white border border-white/20 rounded-full font-black text-[16px] hover:bg-white/20 transition-all">
                How it Works
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
