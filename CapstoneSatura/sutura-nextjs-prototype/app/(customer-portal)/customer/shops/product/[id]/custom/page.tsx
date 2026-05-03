export default function CustomMeasurement() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Custom Sizing</h2>
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">Enter Measurements</h1>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); window.location.href='/portal/product/123/appointment'; }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Chest (inches)</label>
              <input type="number" defaultValue="38" className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Waist (inches)</label>
              <input type="number" defaultValue="32" className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Hips (inches)</label>
              <input type="number" defaultValue="40" className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Inseam (inches)</label>
              <input type="number" defaultValue="30" className="w-full border p-3 rounded-lg" />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white p-4 rounded-xl font-semibold mt-4">Continue to Booking</button>
        </form>
      </div>
    </main>
  );
}
