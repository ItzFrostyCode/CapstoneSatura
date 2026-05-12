'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, UploadCloud, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export default function DesignerRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert("Portfolio submitted! Our Admin team will review your designs and verify your account within 24-48 hours. Check your email for updates.");
      router.push('/');
    }, 1500);
  };

  return (
    <div className="flex w-full h-screen bg-white font-outfit overflow-hidden">
      {/* Hero Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#1A1A1A] overflow-hidden h-full">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center transition-transform duration-[12s] hover:scale-110" 
          style={{ transitionTimingFunction: 'ease' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16 text-white">
          <div className="relative z-10">
            <h1 className="text-[42px] font-extrabold leading-[1.1] mb-3 tracking-[-1.5px]">Design the Future.</h1>
            <p className="text-lg font-light opacity-80 max-w-[500px] leading-relaxed">
              Create your designer profile and start collaborating with top-tier tailoring shops.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto h-full scroll-smooth">
        <div className="w-full max-w-[460px] mx-auto py-8">
          <Link href="/" className="flex items-center gap-3 mb-10 text-gray-900 hover:opacity-80 transition-opacity w-fit">
            <div className="bg-[#1A1A1A] text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-lg shadow-black/10">
              <Scissors className="w-6 h-6" />
            </div>
            <div className="text-[28px] font-bold tracking-tight">Sutura</div>
          </Link>
          
          <div className="mb-8">
            <div className="bg-[#F0F7FF] text-[#2C6BED] px-3 py-1 rounded-lg text-[11px] font-extrabold w-fit mb-3 uppercase tracking-wider">Designer Registration</div>
            <h2 className="text-[32px] font-extrabold mb-2 tracking-tight text-gray-900 leading-tight">Join as a Designer</h2>
            <p className="text-gray-500 text-base">Set up your professional portfolio account.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Juan Dela Cruz" 
                required 
                className="w-full h-[50px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Portfolio Website / Behance / Social Link</label>
              <input 
                type="url" 
                placeholder="https://behance.net/yourname" 
                required 
                className="w-full h-[50px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" 
              />
            </div>

            {/* Technical Mastery Section */}
            <div className="bg-[#F9FAFB] p-6 rounded-2xl border-[1.5px] border-gray-200 mb-2">
              <label className="block text-[13px] font-extrabold text-gray-900 uppercase mb-4 tracking-[0.05em]">Technical Proficiency Check</label>
              
              <div className="flex flex-col gap-3 mb-6">
                {[
                  'Pattern Making & Draping',
                  'Technical Packs (Tech Packs) Creation',
                  'Textile & Fabric Behavior Knowledge'
                ].map((skill, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-[18px] h-[18px] rounded-md accent-[#1A1A1A] cursor-pointer" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{skill}</span>
                  </label>
                ))}
              </div>

              <label className="block text-[11px] font-bold text-gray-500 mb-2">Upload Original Sketches / Tech Packs (Proof of Mastery)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer transition-all bg-white hover:border-[#2C6BED] group flex flex-col items-center">
                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#2C6BED] transition-colors mb-2" />
                <div className="text-xs font-semibold text-gray-900">Click to upload sample work</div>
                <div className="text-[10px] text-gray-500">PDF or Images (Max 10MB)</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Brand Identity / Signature Style</label>
              <textarea 
                placeholder="Briefly describe your unique design aesthetic and target audience..." 
                className="w-full h-[100px] p-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300 resize-none font-outfit"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input type="email" placeholder="juan@designer.com" required className="w-full h-[50px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] hover:border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <input type="password" placeholder="••••••••" required className="w-full h-[50px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] hover:border-gray-300" />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 text-left mb-2">
              <input type="checkbox" id="terms" required className="w-[18px] h-[18px] mt-0.5 cursor-pointer accent-[#1A1A1A] shrink-0" />
              <label htmlFor="terms" className="text-[13px] text-gray-500 leading-snug cursor-pointer">
                I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-[#2C6BED] font-bold hover:underline">Terms of Service</button> and <span className="text-[#2C6BED] font-bold cursor-pointer hover:underline">Privacy Policy</span>, and consent to account verification.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[54px] bg-[#1A1A1A] text-white rounded-xl text-base font-bold mt-2 transition-all hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Submitting Portfolio...' : 'Request Designer Access'}
            </button>
          </form>

          <div className="bg-[#F0F7FF] p-4 rounded-xl text-center mt-8 border border-[#2C6BED]/20">
            <div className="text-sm text-gray-500 mb-2 font-medium">Are you a Shop Owner?</div>
            <Link href="/register" className="text-[#2C6BED] font-bold flex items-center justify-center gap-2 hover:underline">
              Register as Shop Owner <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center mt-8 text-[14px] text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-gray-900 font-bold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-5 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[32px] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowTerms(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#2C6BED]">
              <Scissors className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 tracking-tight text-gray-900">User Agreement & Conditions</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              By joining Sutura, you agree to provide 100% accurate verification details. Our team will review your portfolio within 24-48 hours. Once verified, you can access the designer network and start collaborating with shops.
              <br/><br/>
              You agree to the Sutura <b>Privacy Policy</b> and consent to the secure processing of your data for account verification purposes.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowTerms(false)} className="flex-1 p-4 border-[1.5px] border-gray-200 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowTerms(false)} className="flex-1 p-4 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95">I Agree</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
