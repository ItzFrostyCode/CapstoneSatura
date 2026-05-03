'use client';
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({ 
    businessName: 'Test Business', 
    ownerName: 'John Doe', 
    email: 'test_designer@example.com', 
    password: 'password123', 
    subscriptionPlan: 'basic' 
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (res.ok) {
      setStatus(`Success: Redirecting...`);
      setTimeout(() => { window.location.href = '/owner/dashboard'; }, 800);
    }
    else setStatus(`Error: ${data.error}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Business Registration</h1>
        <p className="text-gray-500 mb-8 text-sm">Create your multi-branch shop account.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Business Name" value={formData.businessName} className="border p-3 rounded-lg" onChange={(e)=>setFormData({...formData, businessName: e.target.value})} />
          <input type="text" placeholder="Owner Name" value={formData.ownerName} className="border p-3 rounded-lg" onChange={(e)=>setFormData({...formData, ownerName: e.target.value})} />
          <input type="email" placeholder="Email" value={formData.email} className="border p-3 rounded-lg" onChange={(e)=>setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" value={formData.password} className="border p-3 rounded-lg" onChange={(e)=>setFormData({...formData, password: e.target.value})} />
          
          <select className="border p-3 rounded-lg" onChange={(e)=>setFormData({...formData, subscriptionPlan: e.target.value})}>
            <option value="basic">Basic Plan (Single Branch)</option>
            <option value="premium">Premium Plan (Multi-Branch + Designers)</option>
          </select>

          <button type="submit" className="bg-black text-white p-4 rounded-lg font-semibold mt-4">Register Business</button>
        </form>
        {status && <p className="mt-4 text-sm font-semibold text-emerald-600">{status}</p>}
      </div>
    </main>
  );
}
