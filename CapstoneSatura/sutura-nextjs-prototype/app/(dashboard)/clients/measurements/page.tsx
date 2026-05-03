export default function Measurements() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Body Measurements</h1>
          <p className="text-gray-500">Record and update client sizing profiles.</p>
        </div>
      </header>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Upper Body (Inches)</h3>
            <div className="space-y-4">
              <input type="number" placeholder="Chest" className="w-full border p-2 rounded" />
              <input type="number" placeholder="Shoulders" className="w-full border p-2 rounded" />
              <input type="number" placeholder="Sleeve" className="w-full border p-2 rounded" />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Lower Body (Inches)</h3>
            <div className="space-y-4">
              <input type="number" placeholder="Waist" className="w-full border p-2 rounded" />
              <input type="number" placeholder="Hips" className="w-full border p-2 rounded" />
              <input type="number" placeholder="Inseam" className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>
        <button className="mt-8 bg-black text-white px-6 py-3 rounded-lg font-semibold">Save Measurements</button>
      </div>
    </div>
  );
}
