export default function ProductDetails() {
  return (
    <main className="min-h-screen bg-white flex flex-col p-12 max-w-5xl mx-auto">
      <div className="flex gap-12">
        <div className="w-1/2 bg-gray-100 rounded-2xl h-[500px] flex items-center justify-center text-gray-400">Image Placeholder</div>
        <div className="w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Midnight Silk Gala</h1>
          <p className="text-gray-600 mb-8 text-lg">An exquisite evening wear piece featuring fine silk and bespoke tailoring.</p>
          <a href="/portal/product/123/size" className="bg-black text-white text-center py-4 rounded-xl font-semibold w-full hover:bg-gray-800 transition">
            Start Sizing Process
          </a>
        </div>
      </div>
    </main>
  );
}
