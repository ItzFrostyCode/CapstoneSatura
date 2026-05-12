'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Database, 
  Zap, 
  ArrowRightLeft, 
  TrendingDown, 
  Package, 
  Scissors,
  ArrowUpRight,
  ArrowDownLeft,
  Filter
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { InventoryItem, InventoryMovement } from '@/types/erp';
import { StockMovementModal, StockMovementData } from '@/components/shared/StockMovementModal';
import { StockTransferModal } from '@/components/shared/StockTransferModal';

export default function StaffInventoryPage() {
  const { 
    inventory, 
    addMovement, 
    updateInventoryItem, 
    staff 
  } = useERPStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'fabric' | 'supplies'>('all');
  
  // Modal States
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [movementMode, setMovementMode] = useState<'in' | 'out'>('in');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = (item.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'fabric' && (item.category?.toLowerCase() === 'fabric' || item.cat?.toLowerCase() === 'fabric')) ||
                        (activeTab === 'supplies' && (item.category?.toLowerCase() !== 'fabric' && item.cat?.toLowerCase() !== 'fabric'));
      return matchesSearch && matchesTab;
    });
  }, [inventory, searchQuery, activeTab]);

  const handleMovementConfirm = (data: StockMovementData) => {
    const item = inventory.find(i => i.sku === data.itemSku);
    if (!item) return;

    const qtyChange = (data.type === 'RECEIVE' || data.type === 'ADJUSTMENT_IN') ? data.qty : -data.qty;
    const newStock = Math.max(0, (item.stock || 0) + qtyChange);

    updateInventoryItem(item.sku, { stock: newStock });

    addMovement({
      inventory_item_id: data.itemSku,
      qty: qtyChange,
      movement_type: data.type as any,
      reference_id: `${data.referenceType}: ${data.referenceId || 'Staff Action'}`,
      performed_by_user_id: 'STF-001', // Should be dynamic in real app
    });
  };

  const renderAvatar = (name: string, size: number = 40, imageUrl?: string) => {
    if (imageUrl) {
      return (
        <img src={imageUrl} alt="" className="rounded-xl object-cover shrink-0 shadow-sm" style={{ width: `${size}px`, height: `${size}px` }} />
      );
    }
    return (
      <div className="rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-sm bg-slate-900 uppercase" style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.4}px` }}>
        {name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Production Inventory</h1>
          <p className="text-[14px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Manage materials for active jobs</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => { setMovementMode('in'); setIsMovementModalOpen(true); }}
             className="h-12 px-6 bg-emerald-600 text-white rounded-2xl text-[13px] font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95"
           >
              <Plus size={18} /> Quick Stock-In
           </button>
           <button 
             onClick={() => setIsTransferModalOpen(true)}
             className="h-12 px-6 bg-indigo-600 text-white rounded-2xl text-[13px] font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
           >
              <ArrowRightLeft size={18} /> Internal Transfer
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by material name or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'fabric', 'supplies'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 h-12 rounded-xl text-[13px] font-black transition-all capitalize ${
                activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-8 py-5">Material / SKU</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right pr-8">Production Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInventory.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      {renderAvatar(item.item_name || '', 44, item.image)}
                      <div>
                        <div className="text-[14px] font-bold text-slate-900 leading-none mb-1">{item.item_name || item.item}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.category || item.cat}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[16px] font-black text-slate-900">{item.stock}</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      (item.stock || 0) <= (item.reorder_level || 5) 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {(item.stock || 0) <= (item.reorder_level || 5) ? 'Low Stock' : 'In Stock'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(item); setMovementMode('in'); setIsMovementModalOpen(true); }}
                        className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-[11px] font-black hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm"
                        title="Add Stock"
                      >
                        Add
                      </button>
                      <button 
                        onClick={() => { setSelectedItem(item); setMovementMode('out'); setIsMovementModalOpen(true); }}
                        className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-[11px] font-black hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all shadow-sm"
                        title="Deduct Stock"
                      >
                        Deduct
                      </button>
                      <button 
                        onClick={() => { setSelectedItem(item); setIsTransferModalOpen(true); }}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        title="Transfer"
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => { setIsMovementModalOpen(false); setSelectedItem(null); }}
        inventory={inventory}
        onConfirm={handleMovementConfirm}
        initialItem={selectedItem}
        mode={movementMode}
        renderAvatar={renderAvatar}
      />

      <StockTransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        renderAvatar={renderAvatar}
      />

    </div>
  );
}
