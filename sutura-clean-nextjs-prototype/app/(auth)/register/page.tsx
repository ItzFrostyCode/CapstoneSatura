'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Package, FileText, FileCheck, Building2, MapPin, Camera, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert("Registration submitted! Your shop is now pending verification by our Admin team. You will receive an email once approved.");
      router.push('/');
    }, 1500);
  };

  return (
    <div className="flex w-full min-h-screen bg-white font-outfit">
      <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden fixed h-screen">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center transition-transform duration-[12s] hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80 flex flex-col justify-end p-16 text-white">
          <h1 className="text-[56px] font-bold leading-[1.1] mb-5 tracking-[-1.5px]">Start your journey.</h1>
          <p className="text-lg font-light opacity-90 max-w-[500px] leading-relaxed">
            Join thousands of tailoring shops worldwide running their operations smoothly with Sutura.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-white lg:ml-[50%]">
        <div className="w-full max-w-[460px] mx-auto py-8">
          <Link href="/" className="flex items-center gap-3 mb-10 text-gray-900 hover:opacity-80 transition-opacity w-fit">
            <div className="bg-gray-900 text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-sm">
              <Scissors className="w-6 h-6" />
            </div>
            <div className="text-[28px] font-bold tracking-tight">Sutura</div>
          </Link>
          
          <div className="mb-8">
            <h2 className="text-4xl font-semibold mb-2 tracking-tight text-gray-900">Register Business</h2>
            <p className="text-gray-500 text-base">Provide your shop&apos;s legal details to get started.</p>
          </div>

          <div className="bg-gray-50 border-[1.5px] border-gray-200 p-3 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                <Package className="w-[18px] h-[18px]" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Premium Shop</div>
                <div className="text-[11px] text-gray-500">₱499.00 / month</div>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline px-2">Change</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Business Name</label>
                <input type="text" placeholder="Bankerohan Tailorshop" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Owner Full Name</label>
                <input type="text" placeholder="Juan Dela Cruz" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Business Address</label>
              <input type="text" placeholder="123 Fashion St., Quezon City" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Number</label>
                <input type="tel" placeholder="0912 345 6789" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Business Email</label>
                <input type="email" placeholder="contact@satura.com" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">BIR / Tax ID</label>
                <input type="text" placeholder="000-123-456-000" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Permit Number</label>
                <input type="text" placeholder="BP-2024-XXXXX" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-extrabold text-gray-900">Business Permit Stack (Philippine Standards)</label>
              <p className="text-[13px] text-gray-500 mb-5">Provide clear photos of your active permits for platform verification.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <FileText className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">DTI / SEC Cert</div>
                  <span className="text-[10px] text-gray-500">PDF or Image</span>
                </div>
                <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <FileCheck className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">BIR Form 2303</div>
                  <span className="text-[10px] text-gray-500">Tax Compliance</span>
                </div>
                <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <Building2 className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">Mayor&apos;s Permit</div>
                  <span className="text-[10px] text-gray-500">Current Year</span>
                </div>
                <div className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <MapPin className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">Barangay Clearance</div>
                  <span className="text-[10px] text-gray-500">Local Proof</span>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <label className="block font-extrabold text-gray-900 mb-2">Operational Verification</label>
              <div className="flex gap-4">
                <div className="flex-1 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <Camera className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">Shop Signage</div>
                </div>
                <div className="flex-1 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center cursor-pointer transition-all bg-gray-50 hover:border-gray-900 flex flex-col items-center gap-2">
                  <Settings className="text-gray-500 w-5 h-5" />
                  <div className="text-xs font-bold text-gray-900">Equipment Proof</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Account Password</label>
                <input type="password" placeholder="••••••••" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                <input type="password" placeholder="••••••••" required className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white hover:border-gray-300" />
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 text-left">
              <input type="checkbox" id="terms" required className="w-[18px] h-[18px] mt-0.5 cursor-pointer accent-gray-900 shrink-0" />
              <label htmlFor="terms" className="text-[13px] text-gray-500 leading-snug cursor-pointer">
                I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-blue-600 font-bold hover:underline">Terms of Service</button> and <span className="text-blue-600 font-bold cursor-pointer hover:underline">Privacy Policy</span>, and consent to account verification.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[52px] bg-gray-900 text-white rounded-xl text-base font-semibold mt-2 transition-all hover:bg-gray-800 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Verifying...' : 'Create Business Account'}
            </button>
          </form>

          <div className="bg-blue-50 p-4 rounded-xl text-center mt-6 border border-blue-600/20">
            <div className="text-sm text-gray-500 mb-2">Are you a Fashion Designer?</div>
            <Link href="/register/designer" className="text-blue-600 font-bold flex items-center justify-center gap-2 hover:underline">
              Register as Designer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="text-center mt-6 text-[15px] font-medium text-gray-900">
            <span className="text-gray-500">Already registered?</span> <Link href="/login-gateway" className="font-bold hover:underline">Sign in</Link>
          </div>

        </div>
      </div>

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-[540px] rounded-[24px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <FileText className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 tracking-tight text-gray-900">User Agreement & Conditions</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              By joining Sutura, you agree to provide 100% accurate business verification details. Our team will review your BIR and Permit uploads within 24 hours. Failure to provide legitimate documents will result in account suspension.<br/><br/>
              You agree to the Sutura <b>Privacy Policy</b> and consent to the secure processing of your tailoring business data.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="flex-1 p-3.5 border-[1.5px] border-gray-200 bg-white rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowTerms(false)} className="flex-1 p-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">I Agree</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
