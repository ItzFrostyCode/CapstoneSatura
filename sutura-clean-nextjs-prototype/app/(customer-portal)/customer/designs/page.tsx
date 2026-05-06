export default function PremadeDesigns() {
  return (
    <main className="min-h-screen bg-gray-50 p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2">Premade Designs Catalog</h1>
        <p className="text-gray-600">Browse exclusive bespoke pieces ready for ordering.</p>
      </header>
      <div className="grid grid-cols-3 gap-8">
        {[1,2,3].map((item) => (
          <div key={item} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center text-gray-400">Image Placeholder</div>
            <h3 className="font-bold text-lg">Midnight Silk Gala</h3>
            <p className="text-sm text-gray-500 mb-4">Available in standard and custom sizing.</p>
            <a href="/customer/shops/product/123" className="block text-center w-full bg-black text-white py-2 rounded-lg font-semibold">View Details</a>
          </div>
        ))}
      </div>
    </main>
  );
}
