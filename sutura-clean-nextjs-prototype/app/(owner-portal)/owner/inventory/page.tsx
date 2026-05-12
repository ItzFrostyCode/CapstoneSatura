'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Database,
  Layers,
  Zap,
  History,
  Package,
  TrendingDown,
  ArrowRightLeft,
  Truck,
  ChevronDown,
} from 'lucide-react';

import { useERPStore } from '@/store/useERPStore';
import { 
  InventoryItem, 
  InventoryMovement,
  Order, 
  JobOrderItem, 
  Customer, 
  Staff, 
  Supplier, 
  PurchaseOrder,
  Appointment
} from '@/types/erp';

declare global {
  interface Window {
    openNewItemModal?: (category?: string) => void;
  }
}

// Modular Components
import { InventoryStats } from './components/InventoryStats';
import { MaterialsTable } from './components/MaterialsTable';
import { FinishedGoodsTable } from './components/FinishedGoodsTable';
import { ProductionAssembly, BOMRecipe } from './components/ProductionAssembly';
import { MovementHistory } from './components/MovementHistory';
import { InventoryWorkflowGuide } from './components/InventoryWorkflowGuide';
import { InventoryItemDetail } from './components/InventoryItemDetail';
import { InventoryCommandCenter } from './components/InventoryCommandCenter';

// Modals
import { NewItemModal } from './components/InventoryModals/NewItemModal';
import { BOMModal } from './components/InventoryModals/BOMModal';
import { StockMovementModal, StockMovementData } from '@/components/shared/StockMovementModal';
import { BatchReleaseModal } from './components/InventoryModals/BatchReleaseModal';
import { StockTransferModal } from '@/components/shared/StockTransferModal';

// ── HELPER FUNCTIONS ──
function getStatus(item: InventoryItem) {
  const stock = item.stock || 0;
  const minStock = item.reorder_level || 0;
  if (stock <= 0) return 'Out of Stock';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
}

const renderAvatar = (name: string, size: number = 40, imageUrl?: string) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt=""
        className="rounded-[18px] object-cover shrink-0 shadow-sm border border-slate-100"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <div 
      className="rounded-[18px] flex items-center justify-center font-black text-white shrink-0 shadow-sm bg-slate-900"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        fontSize: `${size * 0.4}px`
      }}
    >
      {initial}
    </div>
  );
};

export default function InventoryPage() {
  const {
    inventory, movements, recipes, staff, suppliers, customers,
    orders, jobOrderItems, updateOrderStatus,
    purchaseOrders, appointments,
    addMovement, updateInventoryItem, addInventoryItem, saveRecipe, recordBatchRelease, recordPayment
  } = useERPStore();

  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'materials' | 'finished' | 'assembly' | 'history' | 'low_stock'>('materials');
  
  useEffect(() => {
    if (urlTab && ['materials', 'finished', 'assembly', 'history', 'low_stock'].includes(urlTab)) {
      setActiveTab(urlTab as any);
    }
  }, [urlTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Low Stock' | 'Out of Stock'>('All');
  
  // Modal States
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [itemModalCategory, setItemModalCategory] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    window.openNewItemModal = (category?: string) => {
      setItemModalCategory(category);
      setIsNewItemModalOpen(true);
    };
    return () => {
      delete window.openNewItemModal;
    };
  }, []);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isBatchReleaseModalOpen, setIsBatchReleaseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [movementMode, setMovementMode] = useState<'in' | 'out'>('in');
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);

  // Batch Release State
  const [batchReleaseStep, setBatchReleaseStep] = useState(1);
  const [batchReleaseJobOrder, setBatchReleaseJobOrder] = useState('');
  const [batchReleaseCustomerId, setBatchReleaseCustomerId] = useState('');
  const [batchReleasePayment, setBatchReleasePayment] = useState('Paid');
  const [batchCart, setBatchCart] = useState<InventoryItem[]>([]);

  // Assembly State
  const [assemblyProductId, setAssemblyProductId] = useState('');
  const [assemblyQty, setAssemblyQty] = useState(1);
  const [assemblySizes, setAssemblySizes] = useState<Record<string, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const [selectedJoId, setSelectedJoId] = useState<string | null>(null);
  const [quickSaleQty, setQuickSaleQty] = useState(1);
  const [quickSaleCustomer, setQuickSaleCustomer] = useState('');
  const [assemblySuccess, setAssemblySuccess] = useState(false);

  // Filtered Data
  const materials = useMemo(() => inventory.filter(i => i.cat !== 'Finished Goods' && i.item_type !== 'FINISHED_GOOD'), [inventory]);
  const finishedGoods = useMemo(() => inventory.filter(i => i.cat === 'Finished Goods' || i.item_type === 'FINISHED_GOOD'), [inventory]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(i => {
      const matchesSearch = (i.item || i.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || getStatus(i) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [materials, searchQuery, statusFilter]);

  const filteredFinished = useMemo(() => {
    return finishedGoods.filter(i => 
      (i.item || i.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || i.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [finishedGoods, searchQuery]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(i => getStatus(i) === 'Low Stock' || getStatus(i) === 'Out of Stock');
  }, [inventory]);

  // Handlers
  const handleNewItemSave = (itemData: Partial<InventoryItem>) => {
    addInventoryItem(itemData);
  };

  const handleMovementConfirm = (data: StockMovementData) => {
    const item = inventory.find(i => i.sku === data.itemSku);
    if (!item) return;

    const qtyChange = (data.type === 'RECEIVE' || data.type === 'ADJUSTMENT_IN') ? data.qty : -data.qty;
    const newStock = Math.max(0, (item.stock || 0) + qtyChange);

    updateInventoryItem(item.sku, { 
      stock: newStock,
      ...(data.type === 'RECEIVE' && data.unitCost ? { unit_cost: data.unitCost, cost: data.unitCost } : {})
    });

    addMovement({
      inventory_item_id: data.itemSku,
      qty: qtyChange,
      movement_type: data.type as any, 
      reference_id: `${data.referenceType}: ${data.referenceId || 'Manual'}`,
      performed_by_user_id: 'STF-001',
    });
  };

  const handleExecuteAssembly = () => {
    const recipe = recipes.find(r => r.productId === assemblyProductId);
    if (!recipe) return;

    const totalQty = Object.values(assemblySizes).reduce((a, b) => a + b, 0);
    if (totalQty === 0) return;

    recipe.materials.forEach((mat: { sku: string; qty: number }) => {
      const invItem = inventory.find(i => i.sku === mat.sku);
      if (invItem) {
        const isFabric = invItem.category?.toLowerCase() === 'fabric' || invItem.cat?.toLowerCase() === 'fabric';
        if (isFabric) {
          updateInventoryItem(mat.sku, { stock: Math.max(0, (invItem.stock || 0) - (mat.qty * totalQty)) });
          addMovement({ 
            inventory_item_id: mat.sku, 
            qty: -(mat.qty * totalQty), 
            movement_type: 'PRODUCTION', 
            reference_id: `Bulk: ${assemblyProductId}`, 
            performed_by_user_id: 'STF-001' 
          });
        }
      }
    });

    const targetProduct = inventory.find(i => i.sku === assemblyProductId);
    if (targetProduct) {
      updateInventoryItem(assemblyProductId, { stock: (targetProduct.stock || 0) + totalQty });
      addMovement({ 
        inventory_item_id: assemblyProductId, 
        qty: totalQty, 
        movement_type: 'PRODUCTION', 
        reference_id: `Produced: ${Object.entries(assemblySizes).filter(([,v]) => v > 0).map(([k,v]) => `${v}${k}`).join(', ')}`, 
        performed_by_user_id: 'STF-001' 
      });
    }

    setAssemblySizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
    setAssemblySuccess(true);
    setTimeout(() => { setAssemblySuccess(false); setActiveTab('finished'); }, 2000);
  };

  const handleFulfillJO = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const items = jobOrderItems.filter(i => i.job_order_id === orderId);
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    items.forEach(item => {
      const matchedFG = inventory.find(i =>
        (i.item_name || i.item || '').toLowerCase().includes(item.garment_name.toLowerCase().split(' ')[0])
        && (i.cat === 'Finished Goods' || i.item_type === 'FINISHED_GOOD')
      );
      if (matchedFG && (matchedFG.stock || 0) > 0) {
        updateInventoryItem(matchedFG.sku, { stock: Math.max(0, (matchedFG.stock || 0) - item.quantity) });
        addMovement({ 
          inventory_item_id: matchedFG.sku, 
          qty: -item.quantity, 
          movement_type: 'ISSUE', 
          reference_id: `JO Fulfilled: ${orderId}`, 
          performed_by_user_id: 'STF-001' 
        });
      }
    });

    updateOrderStatus(orderId, 'RELEASED');

    addMovement({ 
      inventory_item_id: 'N/A', 
      qty: totalQty, 
      movement_type: 'PRODUCTION', 
      reference_id: `JO Completed: ${orderId}`, 
      performed_by_user_id: 'STF-001' 
    });

    setSelectedJoId(null);
    setAssemblySuccess(true);
    setTimeout(() => { setAssemblySuccess(false); setActiveTab('finished'); }, 2000);
  };

  const handleQuickSale = (itemSku: string) => {
    const item = inventory.find(i => i.sku === itemSku);
    if (!item || (item.stock || 0) < quickSaleQty) return;

    const itemPrice = item.unit_price || item.price || 0;
    const totalAmount = itemPrice * quickSaleQty;

    updateInventoryItem(itemSku, { stock: (item.stock || 0) - quickSaleQty });
    
    addMovement({ 
      inventory_item_id: itemSku, 
      qty: -quickSaleQty, 
      movement_type: 'RELEASE', 
      reference_id: `Sale: ${quickSaleCustomer || 'Walk-in'}`, 
      performed_by_user_id: 'STF-001' 
    });

    // Record the payment in the financial ledger
    recordPayment(
      'DIRECT-SALE', // Flag for non-JO sales
      totalAmount,
      'STF-001',
      'CASH',
      `SALE-${Date.now().toString().slice(-4)}`,
      undefined // No receipt image for quick sale
    );

    setQuickSaleQty(1);
    setQuickSaleCustomer('');
    setAssemblySuccess(true);
    setTimeout(() => { setAssemblySuccess(false); }, 2000);
  };

  const handleBatchReleaseConfirm = () => {
    recordBatchRelease(batchReleaseCustomerId, batchReleaseJobOrder, batchCart, batchReleasePayment);
    setIsBatchReleaseModalOpen(false);
    setBatchReleaseStep(1);
    setBatchCart([]);
  };

  const handleToggleBatchItem = (item: InventoryItem) => {
    setBatchCart(prev => {
      const exists = prev.find(i => i.sku === item.sku);
      if (exists) return prev.filter(i => i.sku !== item.sku);
      return [...prev, item];
    });
  };

  const assemblyValidation = useMemo(() => {
    const recipe = recipes.find(r => r.productId === assemblyProductId);
    if (!recipe) return { canAssemble: false, missing: [] };

    const missing: { name: string, needed: number, avail: number, unit: string }[] = [];
    recipe.materials.forEach((req: { sku: string, qty: number }) => {
      const item = inventory.find(inv => inv.sku === req.sku);
      const isFabric = item?.category?.toLowerCase() === 'fabric' || item?.cat?.toLowerCase() === 'fabric';
      const needed = req.qty * assemblyQty;
      
      if (isFabric && (!item || (item.stock || 0) < needed)) {
        missing.push({ name: item?.item || req.sku, needed, avail: item?.stock || 0, unit: item?.unit || '' });
      }
    });
    return { canAssemble: missing.length === 0, missing };
  }, [assemblyProductId, assemblyQty, inventory, recipes]);

  const activeJobOrders = orders.filter((o: Order) =>
    o.status === 'IN_PRODUCTION' || o.status === 'ALTERATIONS'
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] animate-in fade-in duration-500 pb-20 font-outfit">
      {/* HEADER */}
      <div className="bg-transparent px-10 py-10">
        <div className="max-w-[1450px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">Stock & Production</span>
            </div>
            <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">Inventory Management</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsNewItemModalOpen(true)}
               className="h-11 px-6 bg-white border border-slate-200 rounded-2xl text-[12px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm active:scale-95"
             >
                <Plus size={16} /> New Stock Item
             </button>
             <button 
               onClick={() => setIsTransferModalOpen(true)}
               className="h-11 px-6 bg-indigo-600 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
             >
                <ArrowRightLeft size={16} /> Internal Transfer
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1450px] mx-auto px-10 space-y-10">
        {/* Connected Intelligence Bar */}
        <InventoryCommandCenter
          inventory={inventory}
          orders={orders}
          jobOrderItems={jobOrderItems}
          customers={customers}
          appointments={appointments || []}
          suppliers={suppliers}
          purchaseOrders={purchaseOrders}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {/* Stats Section */}
        <InventoryStats 
          stats={[
            { label: 'Raw Materials', value: materials.length.toString(), color: 'indigo', sub: 'Available SKUs', filter: 'All' },
            { label: 'Finished Units', value: finishedGoods.reduce((sum, i) => sum + (i.stock || 0), 0).toString(), color: 'emerald', sub: 'Ready for Release', filter: 'All' },
            { label: 'Low Stock', value: inventory.filter(i => getStatus(i) === 'Low Stock').length.toString(), color: 'amber', sub: 'Watch List', filter: 'Low Stock' },
            { label: 'Out of Stock', value: inventory.filter(i => getStatus(i) === 'Out of Stock').length.toString(), color: 'rose', sub: 'Critical', filter: 'Out of Stock' },
          ]}
        />

        {/* Main Content Area */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1 p-1 bg-slate-100/50 border border-slate-200/60 rounded-full shadow-sm overflow-x-auto max-w-full">
              {[
                { id: 'materials', name: 'Raw Materials', icon: <Database size={14} /> },
                { id: 'finished', name: 'Finished Goods', icon: <Package size={14} /> },
                { id: 'assembly', name: 'Production', icon: <Zap size={14} /> },
                { id: 'history', name: 'Stock History', icon: <History size={14} /> },
                { id: 'low_stock', name: 'Low Stock', icon: <TrendingDown size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2.5 text-[13px] font-bold transition-all rounded-full flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-[340px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Quick search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-full text-[13px] font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden">
            {activeTab === 'materials' && (
              <MaterialsTable 
                materials={filteredMaterials}
                suppliers={suppliers}
                onViewItem={setViewingItem}
                onMovement={(item, mode) => { setSelectedItem(item); setMovementMode(mode); setIsMovementModalOpen(true); }}
                activeActionRow={activeActionRow}
                setActiveActionRow={setActiveActionRow}
              />
            )}

            {activeTab === 'finished' && (
              <FinishedGoodsTable 
                finishedGoods={filteredFinished}
                onViewItem={setViewingItem}
                onOpenBatchRelease={() => setIsBatchReleaseModalOpen(true)}
                onMovement={(item, mode) => { setSelectedItem(item); setMovementMode(mode); setIsMovementModalOpen(true); }}
                onToggleBatchItem={handleToggleBatchItem}
                batchCart={batchCart}
                batchCartCount={batchCart.length}
                activeActionRow={activeActionRow}
                setActiveActionRow={setActiveActionRow}
              />
            )}

            {activeTab === 'assembly' && (
                <ProductionAssembly 
                  assemblyProductId={assemblyProductId}
                  setAssemblyProductId={setAssemblyProductId}
                  assemblyQty={assemblyQty}
                  setAssemblyQty={setAssemblyQty}
                  assemblySizes={assemblySizes}
                  setAssemblySizes={setAssemblySizes}
                  assemblySuccess={assemblySuccess}
                  inventory={inventory}
                  recipes={recipes}
                  activeJobOrders={activeJobOrders}
                  jobOrderItems={jobOrderItems}
                  customers={customers}
                  selectedJoId={selectedJoId}
                  setSelectedJoId={setSelectedJoId}
                  quickSaleQty={quickSaleQty}
                  setQuickSaleQty={setQuickSaleQty}
                  quickSaleCustomer={quickSaleCustomer}
                  setQuickSaleCustomer={setQuickSaleCustomer}
                  onExecute={handleExecuteAssembly}
                  onFulfillJO={handleFulfillJO}
                  onQuickSale={handleQuickSale}
                  updateInventoryItem={updateInventoryItem}
                  onSaveRecipe={saveRecipe}
                  assemblyValidation={assemblyValidation}
                  movements={movements}
                  staff={staff}
                />
            )}

            {activeTab === 'history' && (
              <MovementHistory movements={movements} staff={staff} inventory={inventory} />
            )}

            {activeTab === 'low_stock' && (
              <div className="animate-in slide-in-from-bottom-2 duration-500">
                <div className="px-10 py-6 border-b border-slate-100 bg-amber-50/20">
                  <p className="text-[12px] text-amber-600 font-bold flex items-center gap-2 italic">
                    <TrendingDown size={14} /> Items running low across all categories. Restock immediately to avoid production delays.
                  </p>
                </div>
                <MaterialsTable 
                  materials={lowStockItems.filter(i => i.item_type !== 'FINISHED_GOOD' && i.cat !== 'Finished Goods')}
                  suppliers={suppliers}
                  onViewItem={setViewingItem}
                  onMovement={(item, mode) => { setSelectedItem(item); setMovementMode(mode); setIsMovementModalOpen(true); }}
                  activeActionRow={activeActionRow}
                  setActiveActionRow={setActiveActionRow}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <NewItemModal 
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onSave={handleNewItemSave}
        defaultCategory={itemModalCategory}
      />

      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        inventory={inventory}
        onConfirm={handleMovementConfirm}
        initialItem={selectedItem}
        mode={movementMode}
        renderAvatar={renderAvatar}
      />

      <BatchReleaseModal 
        isOpen={isBatchReleaseModalOpen}
        onClose={() => setIsBatchReleaseModalOpen(false)}
        batchReleaseStep={batchReleaseStep}
        setBatchReleaseStep={setBatchReleaseStep}
        batchReleaseJobOrder={batchReleaseJobOrder}
        setBatchReleaseJobOrder={setBatchReleaseJobOrder}
        batchReleaseCustomerId={batchReleaseCustomerId}
        setBatchReleaseCustomerId={setBatchReleaseCustomerId}
        batchReleasePayment={batchReleasePayment}
        setBatchReleasePayment={setBatchReleasePayment}
        batchCart={batchCart}
        customers={customers}
        onConfirm={handleBatchReleaseConfirm}
        renderAvatar={renderAvatar}
      />
      <StockTransferModal 
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        renderAvatar={renderAvatar}
      />

      {viewingItem && (
        <InventoryItemDetail 
          item={viewingItem}
          onClose={() => setViewingItem(null)}
          movements={movements}
          staff={staff}
          renderAvatar={renderAvatar}
        />
      )}
    </div>
  );
}
