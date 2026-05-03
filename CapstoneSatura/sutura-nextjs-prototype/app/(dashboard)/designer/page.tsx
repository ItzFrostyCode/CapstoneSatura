export default function DesignerStudio() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif">Designer Studio</h1>
          <p className="text-gray-500">Create portfolio posts and publish designs to the catalog.</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">Create New Post</button>
      </header>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        
        {/* Post 1 */}
        <div className="break-inside-avoid relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1539109132314-3477524c8959?auto=format&fit=crop&q=80&w=800" alt="Design 1" className="w-full rounded-2xl object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-200">Publish to Shop</button>
            </div>
            <h3 className="text-white font-serif text-xl font-bold">Midnight Silk Gala</h3>
          </div>
        </div>

        {/* Post 2 */}
        <div className="break-inside-avoid relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1550614000-4b95d466f108?auto=format&fit=crop&q=80&w=800" alt="Design 2" className="w-full rounded-2xl object-cover h-[400px]" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Published</button>
            </div>
            <h3 className="text-white font-serif text-xl font-bold">Summer Linen Suite</h3>
          </div>
        </div>

        {/* Post 3 */}
        <div className="break-inside-avoid relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1583391733958-d25e07fac044?auto=format&fit=crop&q=80&w=800" alt="Design 3" className="w-full rounded-2xl object-cover h-[300px]" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-200">Publish to Shop</button>
            </div>
            <h3 className="text-white font-serif text-xl font-bold">Urban Streetwear Prep</h3>
          </div>
        </div>

      </div>
    </div>
  );
}
