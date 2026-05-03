export default function Appointment() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full">

        {/* Stepper UI */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">✓</div>
          <div className="w-16 h-1 bg-black"></div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
        </div>

        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Booking</h2>
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">Book In-Store Appointment</h1>
        <p className="text-center text-gray-500 mb-8">Select a date for your initial fitting or final pickup at the boutique.</p>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href='/portal/product/123/confirm'; }}>
          <div>
            <label className="block text-sm font-semibold mb-2">Select Date</label>
            <input type="date" defaultValue="2026-06-01" className="w-full border p-4 rounded-xl" />
          </div>
          <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-semibold mt-4">Review Final Order</button>
        </form>
      </div>
    </main>
  );
}
