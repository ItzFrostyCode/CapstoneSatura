'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Scissors, Package, FileText, FileCheck, Building2, MapPin, Camera, Settings, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const plan = searchParams.get('plan') || 'basic';
  const plans: Record<string, { name: string; price: string }> = {
    basic: { name: 'Basic Shop', price: '₱149.00 / month' },
    pro: { name: 'Pro Shop', price: '₱299.00 / month' },
    premium: { name: 'Premium Shop', price: '₱499.00 / month' }
  };

  const selectedPlan = plans[plan] || plans.basic;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert("Registration submitted! Your shop is now pending verification by our Admin team. You will receive an email once approved.");
      router.push('/');
    }, 1500);
  };

  return (
    <div className="w-full max-w-[540px] mx-auto py-12">
      <Link href="/" className="flex items-center gap-3 mb-10 text-gray-900 hover:opacity-80 transition-opacity w-fit">
        <div className="bg-[#1A1A1A] text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-lg shadow-black/10">
          <Scissors className="w-6 h-6" />
        </div>
        <div className="text-[28px] font-bold tracking-tight">Sutura</div>
      </Link>
      
      <div className="mb-8">
        <h2 className="text-[36px] font-extrabold mb-2 tracking-tight text-gray-900 leading-tight">Register Business</h2>
        <p className="text-gray-500 text-base">Provide your shop&apos;s legal details to get started.</p>
      </div>

      <div className="bg-[#F9FAFB] border-[1.5px] border-gray-200 p-4 rounded-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-gray-900">{selectedPlan.name}</div>
            <div className="text-xs font-bold text-gray-500">{selectedPlan.price}</div>
          </div>
        </div>
        <Link href="/#pricing" className="text-xs font-extrabold text-[#2C6BED] hover:underline px-3 py-1.5 bg-blue-50 rounded-lg">Change</Link>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
            <input type="text" placeholder="Bankerohan Tailorshop" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Owner Full Name</label>
            <input type="text" placeholder="Juan Dela Cruz" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Business Address</label>
          <input type="text" placeholder="123 Fashion St., Quezon City" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
            <input type="tel" placeholder="0912 345 6789" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Business Email</label>
            <input type="email" placeholder="contact@satura.com" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">BIR / Tax ID</label>
            <input type="text" placeholder="000-123-456-000" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Permit Number</label>
            <input type="text" placeholder="BP-2024-XXXXX" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300" />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-black text-gray-900 uppercase text-[13px] tracking-wider mb-2">Business Permit Stack (Philippine Standards)</label>
          <p className="text-[13px] text-gray-500 mb-6 font-medium">Provide clear photos of your active permits for platform verification.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FileText, title: 'DTI / SEC Cert', subtitle: 'PDF or Image' },
              { icon: FileCheck, title: 'BIR Form 2303', subtitle: 'Tax Compliance' },
              { icon: Building2, title: "Mayor's Permit", subtitle: 'Current Year' },
              { icon: MapPin, title: 'Barangay Clearance', subtitle: 'Local Proof' }
            ].map((item, i) => (
              <div key={i} className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer transition-all bg-[#F9FAFB] hover:border-[#1A1A1A] hover:bg-white group flex flex-col items-center gap-2">
                <item.icon className="text-gray-400 group-hover:text-[#1A1A1A] w-6 h-6 transition-colors" />
                <div className="text-xs font-extrabold text-gray-900">{item.title}</div>
                <span className="text-[10px] font-bold text-gray-400">{item.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <label className="block font-black text-gray-900 uppercase text-[13px] tracking-wider mb-4">Operational Verification</label>
          <div className="flex gap-4">
            <div className="flex-1 p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer transition-all bg-[#F9FAFB] hover:border-[#1A1A1A] hover:bg-white group flex flex-col items-center gap-2">
              <Camera className="text-gray-400 group-hover:text-[#1A1A1A] w-6 h-6 transition-colors" />
              <div className="text-xs font-extrabold text-gray-900">Shop Signage</div>
            </div>
            <div className="flex-1 p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center cursor-pointer transition-all bg-[#F9FAFB] hover:border-[#1A1A1A] hover:bg-white group flex flex-col items-center gap-2">
              <Settings className="text-gray-400 group-hover:text-[#1A1A1A] w-6 h-6 transition-colors" />
              <div className="text-xs font-extrabold text-gray-900">Equipment Proof</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Account Password</label>
            <input type="password" placeholder="••••••••" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
            <input type="password" placeholder="••••••••" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] hover:border-gray-300" />
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
          className="w-full h-[56px] bg-[#1A1A1A] text-white rounded-xl text-base font-bold mt-2 transition-all hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0 active:scale-[0.98]"
        >
          {isLoading ? 'Verifying...' : 'Create Business Account'}
        </button>
      </form>

      <div className="bg-blue-50 p-6 rounded-2xl text-center mt-10 border border-[#2C6BED]/20">
        <div className="text-sm text-gray-500 mb-2 font-medium">Are you a Fashion Designer?</div>
        <Link href="/register/designer" className="text-[#2C6BED] font-bold flex items-center justify-center gap-2 hover:underline">
          Register as Designer <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="text-center mt-10 text-[15px] font-medium text-gray-500">
        Already registered? <Link href="/login" className="text-gray-900 font-extrabold hover:underline">Sign in</Link>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-5 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[32px] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowTerms(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-[#2C6BED]">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 tracking-tight text-gray-900">User Agreement & Conditions</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              By joining Sutura, you agree to provide 100% accurate business verification details. Our team will review your BIR and Permit uploads within 24 hours. Failure to provide legitimate documents will result in account suspension.
              <br/><br/>
              You agree to the Sutura <b>Privacy Policy</b> and consent to the secure processing of your tailoring business data for account verification purposes.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowTerms(false)} className="flex-1 p-4 border-[1.5px] border-gray-200 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowTerms(false)} className="flex-1 p-4 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95">I Agree & Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  return (
    <div className="flex w-full h-screen bg-white font-outfit overflow-hidden">
      {/* Hero Section */}
      <div className="hidden lg:block lg:w-2/5 relative bg-[#1A1A1A] overflow-hidden h-full">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center transition-transform duration-[12s] hover:scale-110" 
          style={{ transitionTimingFunction: 'ease' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16 text-white">
          <div className="relative z-10">
            <h1 className="text-[56px] font-extrabold leading-[1.1] mb-5 tracking-[-1.5px]">Start your journey.</h1>
            <p className="text-lg font-light opacity-90 max-w-[500px] leading-relaxed">
              Join thousands of tailoring shops worldwide running their operations smoothly with Sutura.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-3/5 flex flex-col items-center bg-white overflow-y-auto h-full scroll-smooth">
        <Suspense fallback={<div className="p-20 text-gray-500 font-bold">Loading Registration Form...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
