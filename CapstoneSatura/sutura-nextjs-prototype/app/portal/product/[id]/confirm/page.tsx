export default function Confirmation() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full">

        {/* Stepper UI */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">✓</div>
          <div className="w-16 h-1 bg-black"></div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">✓</div>
          <div className="w-16 h-1 bg-black"></div>
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">3</div>
        </div>

        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Review</h2>
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">Confirm Your Order</h1>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 space-y-4">
          <div className="flex justify-between border-b pb-4">
            <span className="text-gray-500">Design</span>
            <span className="font-bold">Midnight Silk Gala</span>
          </div>
          <div className="flex justify-between border-b pb-4">
            <span className="text-gray-500">Sizing</span>
            <span className="font-bold">Custom Measurements</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Appointment</span>
            <span className="font-bold">June 1, 2026</span>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href='/portal/status'; }}>
          <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition">Place Order & Book</button>
        </form>
      </div>
    </main>
  );
}
