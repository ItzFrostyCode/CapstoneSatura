'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Check, ExternalLink, Globe,
  Scissors, Zap, Heart, Share2, MessageCircle, Award, ChevronRight
} from 'lucide-react';

// ── MOCK DESIGNER DATA ──────────────────────────────────────────────────────
const DESIGNER = {
  id: 1,
  name: 'Reyna Villanueva',
  brand: 'Reyna Couture Studio',
  specialization: 'Neo-Filipiniana & Haute Couture',
  location: 'Davao City, Philippines',
  bio: 'Award-winning fashion designer with over 12 years of experience crafting bespoke Filipiniana and high-fashion couture. My work blends the richness of traditional Philippine weaving traditions with contemporary silhouettes — creating garments that tell a story.',
  experience: '12 Years',
  rating: 5.0,
  reviews: 48,
  works: 24,
  instagram: '@reynacouture',
  website: 'reynacouture.ph',
  avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  coverImg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
  verified: true,
  badges: ['Portfolio Verified', 'Top Rated', 'Pro Designer'],
};

const PORTFOLIO = [
  { id: 1, title: 'Harvest Moon Filipiniana', img: 'https://images.unsplash.com/photo-1621784564114-6eea05b89863?w=600&q=80', likes: 142 },
  { id: 2, title: 'Midnight Barong Gown Fusion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', likes: 98 },
  { id: 3, title: 'Butterfly Sleeve Evening Wear', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', likes: 211 },
  { id: 4, title: 'Modern Kimona Silhouette', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', likes: 76 },
  { id: 5, title: 'Terno Reimagined', img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80', likes: 189 },
  { id: 6, title: 'Pineapple Fiber Bespoke', img: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=600&q=80', likes: 55 },
];

const DESIGN_POSTS = [
  { id: 1, title: 'The Art of Piña Weaving', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', date: 'May 10, 2026', tag: 'Design Post' },
  { id: 2, title: 'Custom Terno for Modern Brides', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', date: 'May 3, 2026', tag: 'Collection' },
  { id: 3, title: 'Blueprint: Couture Barong Fusion', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80', date: 'Apr 28, 2026', tag: 'Blueprint' },
];

const SERVICES = [
  { name: 'Custom Filipiniana Commission', desc: 'Full bespoke Filipiniana from sketch to final garment.', price: '₱12,000+', icon: <Scissors size={20} /> },
  { name: 'Couture Bridal Design', desc: 'Wedding gown & entourage design with full consultation.', price: '₱25,000+', icon: <Award size={20} /> },
  { name: 'Design Consultation', desc: '1-hour virtual or in-person design session with mood board.', price: '₱500', icon: <MessageCircle size={20} /> },
];

export default function DesignerProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'posts' | 'services'>('portfolio');
  const [likedItems, setLikedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-24">

      {/* ── BACK NAV ── */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Discover
        </button>
        <span className="text-slate-200">/</span>
        <span className="text-sm font-bold text-slate-900">{DESIGNER.brand}</span>
      </div>

      {/* ── COVER BANNER ── */}
      <div className="relative h-64 rounded-[32px] overflow-hidden mb-0 shadow-xl">
        <img src={DESIGNER.coverImg} alt="cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-5 right-5 flex gap-2">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* ── DESIGNER IDENTITY CARD ── */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-8 -mt-8 mx-4 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-[24px] overflow-hidden border-4 border-white shadow-lg shrink-0 -mt-16 md:-mt-0">
            <img src={DESIGNER.avatar} alt={DESIGNER.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{DESIGNER.name}</h1>
              {DESIGNER.verified && (
                <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                  <Check size={10} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-emerald-600 mb-1">{DESIGNER.brand}</p>
            <p className="text-sm text-slate-500 font-medium mb-3">{DESIGNER.specialization}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1"><MapPin size={13} />{DESIGNER.location}</span>
              <span className="flex items-center gap-1"><Star size={13} className="text-amber-400 fill-amber-400" />{DESIGNER.rating} ({DESIGNER.reviews} reviews)</span>
              <span className="flex items-center gap-1"><Scissors size={13} />{DESIGNER.experience} Experience</span>
              <span className="flex items-center gap-1"><Zap size={13} />{DESIGNER.works} Portfolio Works</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {DESIGNER.badges.map((b, i) => (
                <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => router.push('/customer/book')}
              className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Book Consultation
            </button>
            <div className="flex gap-2">
              <a href="#" className="flex-1 h-10 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <ExternalLink size={14} /> {DESIGNER.instagram}
              </a>
              <a href="#" className="flex-1 h-10 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Globe size={14} /> {DESIGNER.website}
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-slate-600 font-medium text-sm leading-relaxed">{DESIGNER.bio}</p>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl">
        {(['portfolio', 'posts', 'services'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 h-10 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab === 'portfolio' ? `Portfolio (${PORTFOLIO.length})` : tab === 'posts' ? `Design Posts` : 'Services'}
          </button>
        ))}
      </div>

      {/* ── PORTFOLIO GRID ── */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 animate-in fade-in duration-500">
          {PORTFOLIO.map(item => (
            <div key={item.id} className="group relative rounded-[28px] overflow-hidden aspect-[4/5] bg-slate-100 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white font-black text-sm">{item.title}</p>
              </div>
              <button
                onClick={() => toggleLike(item.id)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:bg-rose-500"
              >
                <Heart size={15} className={likedItems.includes(item.id) ? 'fill-white text-white' : 'text-white'} />
              </button>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                <Heart size={10} fill="currentColor" /> {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DESIGN POSTS ── */}
      {activeTab === 'posts' && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {DESIGN_POSTS.map(post => (
            <div key={post.id} className="group bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex gap-0">
              <div className="w-40 h-36 shrink-0 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full mb-2">{post.tag}</span>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{post.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">{post.date}</p>
                </div>
                <button className="self-start flex items-center gap-1 text-emerald-600 font-black text-xs uppercase tracking-widest hover:gap-2 transition-all">
                  Read More <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SERVICES ── */}
      {activeTab === 'services' && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {SERVICES.map((svc, i) => (
            <div key={i} className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-6 flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                {svc.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 mb-1">{svc.name}</h3>
                <p className="text-sm text-slate-500 font-medium">{svc.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-black text-slate-900">{svc.price}</div>
                <button
                  onClick={() => router.push('/customer/book')}
                  className="mt-2 h-9 px-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
