'use client';

import { useState } from 'react';
import { useERPStore } from '@/store/useERPStore';
import {
  User,
  Bell,
  Ticket,
  Save,
} from 'lucide-react';

export default function CustomerProfilePortalPage() {
  const { currentUser, pushNotification } = useERPStore();

  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', name: 'My Account', icon: <User size={16} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={16} /> },
    { id: 'vouchers', name: 'My Vouchers', icon: <Ticket size={16} /> },
  ];

  const handleSave = () => {
    pushNotification('Profile updated successfully', 'success');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[32px] font-bold font-serif text-[#1E3A1F] tracking-tight leading-none">
            Profile Settings
          </h1>
          <p className="text-[14px] text-[#78716C] mt-2">
            Manage your personal details, order updates, and exclusive vouchers.
          </p>
        </div>
        <button
          className="h-11 px-7 bg-[#1E3A1F] text-[#C9A84C] rounded-xl flex items-center gap-3 text-[13px] font-bold shadow-md hover:bg-[#163018] transition-all active:scale-95 group"
          onClick={handleSave}
        >
          <Save size={16} className="group-hover:scale-110 transition-transform" />
          Save Changes
        </button>
      </div>

      {/* Capsule Tabs */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-[8px] w-fit border border-[#E2DDD7] shadow-sm mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-[13px] font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#1E3A1F] text-[#C9A84C] shadow-md'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── ACCOUNT TAB ── */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2DDD7] animate-in fade-in slide-in-from-bottom-2">
          <div className="p-6 border-b border-[#F0EDE8]">
            <h2 className="text-xl font-bold text-[#1C1917]">My Profile</h2>
            <p className="text-[14px] text-[#78716C] mt-1">Manage and protect your account</p>
          </div>

          <div className="p-8 flex flex-col-reverse md:flex-row gap-12">
            {/* Left Column – Form */}
            <div className="flex-1 space-y-6">
              {/* Username */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right">
                  Username
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    defaultValue="johnclock_25"
                    className="w-full h-10 px-4 border border-[#E2DDD7] rounded-md text-[14px] text-[#1C1917] focus:border-[#1E3A1F] focus:ring-1 focus:ring-[#1E3A1F] outline-none transition-all"
                  />
                  <p className="text-[12px] text-[#78716C] mt-1.5">Username can only be changed once.</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right">Name</label>
                <div className="flex-1">
                  <input
                    type="text"
                    defaultValue={currentUser?.name || ''}
                    className="w-full h-10 px-4 border border-[#E2DDD7] rounded-md text-[14px] text-[#1C1917] focus:border-[#1E3A1F] focus:ring-1 focus:ring-[#1E3A1F] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right">Email</label>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[14px] text-[#1C1917]">jo*************@gmail.com</span>
                  <button className="text-[13px] text-[#1E3A1F] font-semibold hover:underline">Change</button>
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right">
                  Phone Number
                </label>
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-[14px] text-[#1C1917]">********83</span>
                  <button className="text-[13px] text-[#1E3A1F] font-semibold hover:underline">Change</button>
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right">Gender</label>
                <div className="flex-1 flex items-center gap-6">
                  {['Male', 'Female', 'Other'].map((g, i) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          i === 0
                            ? 'border-[#1E3A1F]'
                            : 'border-[#E2DDD7] group-hover:border-[#1E3A1F]'
                        }`}
                      >
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-[#1E3A1F]" />}
                      </div>
                      <span className="text-[14px] text-[#1C1917]">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pt-2">
                <label className="text-[14px] font-medium text-[#78716C] sm:w-32 sm:text-right sm:pt-1">
                  Date of birth
                </label>
                <div className="flex-1">
                  <span className="text-[14px] text-[#1C1917]">**/**/1990</span>
                  <p className="text-[12px] text-[#78716C] mt-1.5">
                    You have already done KYC. Changing your birthday is not permitted.
                  </p>
                  <div className="mt-8">
                    <button
                      onClick={handleSave}
                      className="h-10 px-6 bg-[#1E3A1F] hover:bg-[#163018] text-[#C9A84C] text-[14px] font-bold rounded-lg shadow-sm transition-colors active:scale-95"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column – Avatar */}
            <div className="md:w-[260px] flex flex-col items-center md:border-l border-[#F0EDE8] md:pl-12 pt-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-[#FAF8F5] border border-[#E2DDD7] mb-5">
                <img
                  src={
                    currentUser?.avatar ||
                    'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffdfbf'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="h-10 px-6 border border-[#E2DDD7] rounded-lg text-[14px] font-medium text-[#1C1917] hover:bg-[#FAF8F5] transition-colors mb-4">
                Select Image
              </button>
              <p className="text-[12px] text-[#78716C] text-center">File size: maximum 1 MB</p>
              <p className="text-[12px] text-[#78716C] text-center">File extension: .JPEG, .PNG</p>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-8 border border-[#E2DDD7] shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <h2 className="text-xl font-bold text-[#1C1917] mb-6 flex items-center gap-2">
            <Bell size={20} className="text-[#1E3A1F]" /> Order &amp; System Updates
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Measurements Approved', desc: 'Your tailored suit measurements have been verified by the Artisan.', time: '2 hours ago', read: false },
              { title: 'Consultation Reminder', desc: 'You have an upcoming fitting consultation tomorrow at 2:00 PM.', time: '1 day ago', read: false },
              { title: 'Order Shipped', desc: 'Your bespoke Barong has been shipped via standard delivery.', time: '3 days ago', read: true },
              { title: 'Welcome to Sutura', desc: 'Your customer account has been successfully created. Explore our premium Tailoring Shops.', time: '1 week ago', read: true },
            ].map((notif, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex gap-4 items-start transition-all hover:shadow-md ${
                  notif.read ? 'bg-[#FAF8F5] border-[#E2DDD7]' : 'bg-[#1E3A1F]/5 border-[#1E3A1F]/10'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.read ? 'bg-[#E2DDD7] text-[#78716C]' : 'bg-[#1E3A1F] text-[#C9A84C]'
                  }`}
                >
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-[14px] ${notif.read ? 'font-semibold text-[#78716C]' : 'font-bold text-[#1C1917]'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-[13px] text-[#78716C] mt-1">{notif.desc}</p>
                  <span className="text-[11px] font-bold text-[#78716C]/60 uppercase tracking-widest mt-2 block">
                    {notif.time}
                  </span>
                </div>
                {!notif.read && <div className="w-2.5 h-2.5 bg-[#1E3A1F] rounded-full mt-2" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VOUCHERS TAB ── */}
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-2xl p-8 border border-[#E2DDD7] shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <h2 className="text-xl font-bold text-[#1C1917] mb-6 flex items-center gap-2">
            <Ticket size={20} className="text-[#1E3A1F]" /> My Exclusive Vouchers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'First Bespoke Suit', discount: '₱2,000 OFF', code: 'WELCOME2K', min: 'Min. spend ₱15,000', expiry: 'Valid until Dec 2026', type: 'welcome' },
              { title: 'Bridal Consultation', discount: '100% FREE', code: 'BRIDE100', min: 'No minimum spend', expiry: 'Valid until Aug 2026', type: 'promo' },
              { title: 'Premium Alterations', discount: '15% OFF', code: 'ALTER15', min: 'Min. spend ₱1,500', expiry: 'Valid for 30 days', type: 'loyalty' },
            ].map((voucher, i) => (
              <div
                key={i}
                className="relative border border-[#1E3A1F]/10 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#1E3A1F]" />
                <div className="p-5 pl-8">
                  <div className="inline-block px-2 py-1 bg-[#1E3A1F]/5 text-[#1E3A1F] text-[10px] font-black uppercase tracking-widest rounded mb-3">
                    {voucher.type}
                  </div>
                  <h3 className="text-[18px] font-black text-[#1C1917] mb-1">{voucher.discount}</h3>
                  <p className="text-[14px] font-bold text-[#1C1917] mb-2">{voucher.title}</p>
                  <p className="text-[12px] text-[#78716C]">{voucher.min}</p>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
                    <span className="text-[11px] font-bold text-[#78716C]">{voucher.expiry}</span>
                    <button className="text-[12px] font-black text-[#1E3A1F] group-hover:text-[#C9A84C] transition-colors">
                      Use Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
