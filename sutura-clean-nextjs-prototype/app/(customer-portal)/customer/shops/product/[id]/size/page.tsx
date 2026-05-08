import Link from 'next/link';

export default function SizeSelection() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl w-full text-center">
        
        {/* Stepper UI */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
          <div className="w-16 h-1 bg-gray-200"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
        </div>

        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Sizing</h2>
        <h1 className="text-3xl font-serif font-bold mb-8">Select Sizing Model</h1>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Link href="/customer/shops/product/123/appointment" className="border-2 border-gray-200 hover:border-black p-8 rounded-xl flex flex-col items-center transition">
            <h3 className="font-bold text-xl mb-2">Standard Size</h3>
            <p className="text-sm text-gray-500">Pick from S, M, L, XL sizing profiles.</p>
          </Link>
          <Link href="/customer/shops/product/123/custom" className="border-2 border-gray-200 hover:border-black p-8 rounded-xl flex flex-col items-center transition">
            <h3 className="font-bold text-xl mb-2">Custom Fit</h3>
            <p className="text-sm text-gray-500">Enter your exact body measurements.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
