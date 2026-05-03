'use client';
export default function Login() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Shop Owner Login</h1>
        <p className="text-gray-500 mb-8 text-sm">Access your SUTURA tailoring dashboard.</p>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); window.location.href='/owner/dashboard'; }}>
          <input type="email" placeholder="Email" defaultValue="test@example.com" className="border p-3 rounded-lg" />
          <input type="password" placeholder="Password" defaultValue="password123" className="border p-3 rounded-lg" />
          <button type="submit" className="bg-black text-white p-4 rounded-lg font-semibold mt-4">Login to Dashboard</button>
        </form>
      </div>
    </main>
  );
}
