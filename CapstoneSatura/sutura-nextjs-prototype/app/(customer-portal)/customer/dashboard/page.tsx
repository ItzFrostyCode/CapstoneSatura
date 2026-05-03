'use client';
import { useState } from 'react';

export default function CustomerPortal() {
  const [sizeType, setSizeType] = useState('standard');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('2026-06-01');

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing...');
    
    // Simulating sequence: Input -> Validate -> Save -> Confirm
    const payload = {
      customerName: "Guest Customer",
      designId: "design_001",
      sizeType,
      bodyMeasurements: sizeType === 'custom' ? { chest: 38, waist: 32 } : null,
      appointmentDate: date
    };

    const res = await fetch('/api/customer-orders', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await res.json();
    if (res.ok) {
      setStatus(`Order Confirmed! Redirecting...`);
      setTimeout(() => { window.location.href = '/portal/status'; }, 800);
    }
    else setStatus(`Error: ${data.error}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold font-serif">SUTURA Boutique</h1>
        <span className="text-sm text-gray-500">Customer Portal</span>
      </header>

      <div className="max-w-6xl mx-auto p-12 grid grid-cols-2 gap-16">
        <div>
          <img src="https://images.unsplash.com/photo-1539109132314-3477524c8959?auto=format&fit=crop&q=80&w=800" alt="Midnight Silk Gala" className="w-full rounded-2xl shadow-sm object-cover h-[600px]"/>
        </div>
        
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Premade Design</span>
          <h2 className="text-4xl font-serif mb-4">Midnight Silk Gala</h2>
          <p className="text-gray-600 mb-8">An exquisite evening wear piece available for immediate standard sizing or bespoke custom tailoring.</p>
          
          <form onSubmit={handleOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Select Sizing Model</label>
              <select className="w-full border p-4 rounded-xl" value={sizeType} onChange={(e)=>setSizeType(e.target.value)}>
                <option value="standard">Standard Size (S, M, L)</option>
                <option value="custom">Custom Body Measurements</option>
              </select>
            </div>

            {sizeType === 'custom' && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-sm font-semibold mb-4">Enter Measurements (inches)</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Chest" defaultValue="38" className="border p-3 rounded-lg" />
                  <input type="number" placeholder="Waist" defaultValue="32" className="border p-3 rounded-lg" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Book In-Store Pickup/Fitting</label>
              <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border p-4 rounded-xl" />
            </div>

            <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors">
              Confirm Order & Pickup
            </button>
            {status && <p className="mt-4 text-center font-semibold text-emerald-600">{status}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
