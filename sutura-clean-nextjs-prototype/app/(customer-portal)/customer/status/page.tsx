export default function OrderStatus() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        Your order for the <strong>Midnight Silk Gala</strong> has been received and is currently processing.
      </p>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 w-full max-w-md text-left mb-8">
        <h3 className="font-bold mb-4 border-b pb-2">Next Steps</h3>
        <p className="text-sm text-gray-600 mb-2"><strong>Appointment:</strong> Scheduled for In-Store Pickup/Fitting.</p>
        <p className="text-sm text-gray-600">Please visit the SUTURA Boutique on your selected date. You can check this portal anytime for status updates.</p>
      </div>
      <a href="/customer/dashboard" className="text-black font-semibold hover:underline">← Back to Dashboard</a>
    </main>
  );
}
