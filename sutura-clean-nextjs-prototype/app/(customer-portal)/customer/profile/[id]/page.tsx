'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, MapPin, Scissors, Globe, 
  Camera, Share2, Mail, Phone, Calendar,
  CheckCircle2, Sparkles, Image as ImageIcon,
  ChevronRight, Award, ShieldCheck, Zap
} from 'lucide-react';

interface PartnerProfileData {
  name: string;
  type: string;
  rating: number;
  reviews: number;
  loc: string;
  bio: string;
  expert: string[];
  portfolio: string[];
  coverImage: string;
}

const MOCK_DATA: Record<string, PartnerProfileData> = {
  'davao-famous': {
    name: 'Davao Famous Tailoring',
    type: 'Master Shop',
    rating: 4.9,
    reviews: 128,
    loc: 'San Pedro St., Davao City',
    bio: 'Established in 1978, Davao Famous Tailoring has been the cornerstone of bespoke formal wear in Mindanao. Specializing in barongs, suits, and military uniforms.',
    expert: ['Bespoke Suits', 'Barong Tagalog', 'Uniforms', 'Corporate Attire'],
    portfolio: [
      '/portfolio-suit.png',
      '/portfolio-gown.png',
      '/portfolio-barong.png',
      '/portfolio-detail.png'
    ],
    coverImage: '/hero-tailor.png'
  },
  'chard': {
    name: "Chard's Tailoring",
    type: 'Boutique Shop',
    rating: 4.8,
    reviews: 112,
    loc: 'Ponciano St., Davao City',
    bio: 'Modern tailoring for the contemporary gentleman and lady. Chard\'s focuses on slim-fit silhouettes and premium imported fabrics for high-end events.',
    expert: ['Modern Slim Fit', 'Evening Gowns', 'Wedding Suits'],
    portfolio: [
      '/portfolio-suit.png',
      '/portfolio-gown.png',
      '/portfolio-barong.png',
      '/portfolio-detail.png'
    ],
    coverImage: '/hero-tailor.png'
  },
  'edgar-buyan': {
    name: 'Edgar Buyan',
    type: 'Fashion Designer',
    rating: 5.0,
    reviews: 45,
    loc: 'Davao City',
    bio: 'Edgar Buyan is a multi-awarded fashion designer known for his avant-garde approach to traditional Filipino textiles. His work has been featured in major fashion weeks nationwide.',
    expert: ['Avant Garde', 'Traditional Filipino', 'Gala Gowns'],
    portfolio: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&q=80&w=1200'
  }
};

export default function PartnerProfile() {
  const params = useParams();
  const id = (params.id as string) || 'davao-famous';
  const data = MOCK_DATA[id] || MOCK_DATA['davao-famous'];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section with Glassmorphism */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden bg-slate-900">
        <Image 
          src={data.coverImage} 
          fill
          priority
          className="object-cover scale-105 animate-pulse-slow"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-slate-900/60" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-16">
          <Link 
            href="/customer/shops" 
            className="inline-flex items-center gap-2 text-slate-900 font-black text-sm mb-12 hover:gap-4 transition-all bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl"
          >
            <ArrowLeft size={18} /> Back to Explorer
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30">
                  {data.type}
                </span>
                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest shadow-xl border border-slate-100">
                  <ShieldCheck size={14} className="text-indigo-600" /> Verified Partner
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                {data.name}
              </h1>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={18} className={i <= Math.floor(data.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <span className="text-[16px] font-black text-slate-900">{data.rating}</span>
                  <span className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">({data.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                  <MapPin size={18} className="text-indigo-600" /> {data.loc}
                </div>
              </div>
            </div>

            <Link 
              href={`/customer/book?provider=${encodeURIComponent(data.name)}`}
              className="h-20 px-12 bg-slate-900 text-white rounded-[32px] font-black text-xl flex items-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
            >
              <Calendar size={24} /> Book Session <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: Brand Story & Portfolio */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Story */}
            <div className="relative">
              <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-full" />
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Our Legacy</h2>
              <p className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                &quot;{data.bio}&quot;
              </p>
            </div>

            {/* Specialties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 group hover:bg-white hover:shadow-2xl transition-all">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Award size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Core Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.expert.map(e => (
                      <span key={e} className="px-4 py-2 bg-white rounded-xl text-[13px] font-bold text-slate-600 shadow-sm border border-slate-100">{e}</span>
                    ))}
                  </div>
               </div>

               <div className="p-10 bg-indigo-600 rounded-[48px] text-white shadow-2xl shadow-indigo-600/30 group">
                  <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-4">SUTURA Promise</h3>
                  <p className="text-indigo-100 font-medium leading-relaxed">
                    This partner is fully integrated with our network, ensuring real-time updates and perfect measurement synchronization.
                  </p>
               </div>
            </div>

            {/* Portfolio Showcase */}
            <div>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Portfolio Showcase.</h2>
                <div className="text-[14px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:gap-4 transition-all">
                  View All Projects <ChevronRight size={18} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.portfolio.map((img, i) => (
                  <div 
                    key={i} 
                    className={`relative rounded-[40px] overflow-hidden bg-slate-100 group ${i === 1 || i === 2 ? 'aspect-square' : 'aspect-[4/5]'}`}
                  >
                    <Image 
                      src={img} 
                      alt="Work"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10">
                      <div className="text-white">
                        <p className="text-[12px] font-black uppercase tracking-widest text-indigo-300 mb-2">Collection 2024</p>
                        <h4 className="text-2xl font-black tracking-tight">Master Blueprint Piece</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Social */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              <div className="p-10 bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-12">
                
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Contact Channels</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Mail size={20} />
                      </div>
                      <div className="text-[15px] font-black text-slate-900">Email Business</div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Phone size={20} />
                      </div>
                      <div className="text-[15px] font-black text-slate-900">Call Workshop</div>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Socials</h3>
                  <div className="flex gap-4">
                    <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                      <Camera size={24} />
                    </button>
                    <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                      <Share2 size={24} />
                    </button>
                    <button className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                      <Globe size={24} />
                    </button>
                  </div>
                </div>

                <div className="pt-12">
                  <button className="w-full h-16 bg-slate-50 text-slate-900 rounded-3xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95">
                    Share Profile
                  </button>
                </div>
              </div>

              {/* Status Card */}
              <div className="mt-8 p-10 bg-slate-900 rounded-[48px] text-white overflow-hidden relative group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
                 <div className="relative z-10">
                    <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Booking Availability</div>
                    <div className="text-4xl font-black mb-2 tracking-tighter">High Demand</div>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      This master tailor currently has a 2-week lead time for new bespoke projects.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
