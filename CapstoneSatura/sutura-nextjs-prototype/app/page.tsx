export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold text-gray-900 mb-8 font-serif">SUTURA</h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
        Subscription-Based Tailoring Business Management System. <br/>
        Centralize your shop, staff, customers, and supply chain.
      </p>
      
      <div className="flex gap-4">
        <a href="/register" className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Register Business
        </a>
        <a href="/login-gateway" className="bg-white text-black px-8 py-4 rounded-lg font-semibold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
          Shop Owner Login
        </a>
        <a href="/admin/login" className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold border border-gray-700 hover:bg-gray-800 transition-colors">
          Admin Portal
        </a>
        <a href="/customer/designs" className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
          Customer Portal
        </a>
      </div>
    </main>
  );
}
