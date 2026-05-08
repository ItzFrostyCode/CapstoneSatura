'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { StockMovementModal, StockMovementData } from './components/InventoryModals/StockMovementModal';
import { BatchReleaseModal } from './components/InventoryModals/BatchReleaseModal';
import { StockTransferModal } from './components/InventoryModals/StockTransferModal';

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
        className="rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <div 
      className="rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-sm bg-slate-900"
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
    addMovement, updateInventoryItem, addInventoryItem, saveRecipe, recordBatchRelease
  } = useERPStore();

  // Active JOs = orders that are still being made
  const activeJobOrders = orders.filter((o: Order) =>
    o.status === 'IN_PRODUCTION' || o.status === 'ALTERATIONS'
  );

  const [activeTab, setActiveTab] = useState<'materials' | 'finished' | 'assembly' | 'history' | 'low_stock'>('materials');
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
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isBatchReleaseModalOpen, setIsBatchReleaseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [movementMode, setMovementMode] = useState<'in' | 'out'>('in');
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);

  // BOM State
  const [bomProductId, setBomProductId] = useState('');
  const [bomMaterials, setBomMaterials] = useState<Array<{ sku: string; qty: number }>>([]);

  // Batch Release State
  const [batchReleaseStep, setBatchReleaseStep] = useState(1);
  const [batchReleaseJobOrder, setBatchReleaseJobOrder] = useState('');
  const [batchReleaseCustomerId, setBatchReleaseCustomerId] = useState('');
  const [batchReleasePayment, setBatchReleasePayment] = useState('Paid');
  const [batchCart, setBatchCart] = useState<InventoryItem[]>([]);

  // Assembly State
  const [assemblyStep, setAssemblyStep] = useState(1);
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

  // Initialize default product if none selected (Done during render to avoid cascading effects)
  if (!assemblyProductId && recipes.length > 0) {
    setAssemblyProductId(recipes[0].productId);
  }

  const handleMovementConfirm = (data: StockMovementData) => {
    const item = inventory.find(i => i.sku === data.itemSku);
    if (!item) return;

    const qtyChange = (data.type === 'RECEIVE' || data.type === 'ADJUSTMENT_IN') ? data.qty : -data.qty;
    const newStock = Math.max(0, (item.stock || 0) + qtyChange);

    updateInventoryItem(item.sku, { 
      stock: newStock,
      // Update unit cost if receiving
      ...(data.type === 'RECEIVE' && data.unitCost ? { unit_cost: data.unitCost, cost: data.unitCost } : {})
    });

    addMovement({
      inventory_item_id: data.itemSku,
      qty: qtyChange,
      movement_type: data.type as 'RECEIVE' | 'ISSUE' | 'PRODUCTION' | 'RELEASE' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT', 
      reference_id: `${data.referenceType}: ${data.referenceId || 'Manual'}`,
      performed_by_user_id: 'STF-001', // Mock admin
    });
  };


  // FIX 1: Bulk Production — uses summed sizes for real material deduction
  const handleExecuteAssembly = () => {
    const recipe = recipes.find(r => r.productId === assemblyProductId);
    if (!recipe) return;

    // Sum all sizes for total qty
    const totalQty = Object.values(assemblySizes).reduce((a, b) => a + b, 0);
    if (totalQty === 0) return;

    // Deduct raw materials based on total qty (only for Fabrics)
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

    // Add to finished goods stock
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

  // FIX 2: Job Order Fulfillment — marks real order as COMPLETED, deducts materials
  const handleFulfillJO = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const items = jobOrderItems.filter(i => i.job_order_id === orderId);
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    // Deduct from any matched finished goods or raw materials via recipe
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

    // Mark the order as COMPLETED
    updateOrderStatus(orderId, 'RELEASED');

    addMovement({ 
      inventory_item_id: 'N/A', 
      qty: totalQty, 
      movement_type: 'PRODUCTION', 
      reference_id: `JO Completed: ${orderId} — ${items.map(i => i.garment_name).join(', ')}`, 
      performed_by_user_id: 'STF-001' 
    });

    setSelectedJoId(null);
    setAssemblySuccess(true);
    setTimeout(() => { setAssemblySuccess(false); setActiveTab('finished'); }, 2000);
  };

  // FIX 3: Quick Sale — deducts stock from finished goods, logs sale
  const handleQuickSale = (itemSku: string) => {
    const item = inventory.find(i => i.sku === itemSku);
    if (!item || (item.stock || 0) < quickSaleQty) return;

    updateInventoryItem(itemSku, { stock: (item.stock || 0) - quickSaleQty });
    addMovement({ 
      inventory_item_id: itemSku, 
      qty: -quickSaleQty, 
      movement_type: 'RELEASE', 
      reference_id: `Sale: ${quickSaleCustomer || 'Walk-in'}`, 
      performed_by_user_id: 'STF-001' 
    });

    setQuickSaleQty(1);
    setQuickSaleCustomer('');
    setAssemblySuccess(true);
    setTimeout(() => { setAssemblySuccess(false); }, 2000);
  };

  const handleBatchReleaseConfirm = () => {
    recordBatchRelease(batchReleaseCustomerId, batchReleaseJobOrder, batchCart, batchReleasePayment);
    setIsBatchReleaseModalOpen(false);
    setBatchReleaseStep(1);
    setBatchCart([]); // Clear cart after release
  };

  const handleToggleBatchItem = (item: InventoryItem) => {
    setBatchCart(prev => {
      const exists = prev.find(i => i.sku === item.sku);
      if (exists) return prev.filter(i => i.sku !== item.sku);
      return [...prev, item];
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="space-y-3 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight flex items-center gap-3">
              Inventory
            </h1>
            <p className="text-[12px] text-slate-500 font-medium">Buy materials → Produce garments → Store finished goods → Release to customer.</p>
          </div>
          <div className="relative flex-1 max-w-md ml-0 md:ml-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search SKU, name, or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-600/20 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsNewItemModalOpen(true)}
            className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[13px] font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> New Item
          </button>

          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-[13px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <ArrowRightLeft size={16} /> Internal Transfer
          </button>
          <button 
            onClick={() => { setSelectedItem(null); setIsMovementModalOpen(true); }}
            className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[13px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <History size={16} /> Stock Movement
          </button>
        </div>
      </div>

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
          { label: 'Low', value: inventory.filter(i => getStatus(i) === 'Low Stock').length.toString(), color: 'amber', sub: 'Watch List', filter: 'Low Stock' },
          { label: 'Out', value: inventory.filter(i => getStatus(i) === 'Out of Stock').length.toString(), color: 'rose', sub: 'Critical', filter: 'Out of Stock' },
        ]}
      />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden mx-4">
        {/* INTEGRATED NAVIGATION TABS */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-wrap bg-slate-200/50 p-1 rounded-xl w-max gap-1 border border-slate-200/50">
            {( [
              { id: 'materials', name: 'Raw Materials', icon: <Database size={14} /> },
              { id: 'finished', name: 'Finished Goods', icon: <Package size={14} /> },
              { id: 'assembly', name: 'Production', icon: <Zap size={14} /> },
              { id: 'history', name: 'Stock History', icon: <History size={14} /> },
              { id: 'low_stock', name: 'Low Stock', icon: <TrendingDown size={14} /> },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-8 px-4 rounded-lg text-[11px] font-black transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.icon} 
                <span className="whitespace-nowrap uppercase tracking-widest">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

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
            />
        )}

        {activeTab === 'history' && (
          <MovementHistory movements={movements} staff={staff} inventory={inventory} />
        )}

        {activeTab === 'low_stock' && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-[12px] text-slate-500 italic font-medium">Items running low across all categories. Restock immediately to avoid production delays.</p>
            </div>
            <MaterialsTable 
              materials={lowStockItems.filter(i => i.item_type !== 'FINISHED_GOOD' && i.cat !== 'Finished Goods')}
              suppliers={suppliers}
              onViewItem={setViewingItem}
              onMovement={(item, mode) => { setSelectedItem(item); setMovementMode(mode); setIsMovementModalOpen(true); }}
              activeActionRow={activeActionRow}
              setActiveActionRow={setActiveActionRow}
            />
            {lowStockItems.filter(i => i.item_type === 'FINISHED_GOOD' || i.cat === 'Finished Goods').length > 0 && (
              <>
                <div className="px-6 py-3 border-t border-b border-amber-100 bg-amber-50/50">
                  <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">Finished Goods — Low or Out of Stock</p>
                </div>
                <FinishedGoodsTable
                  finishedGoods={lowStockItems.filter(i => i.item_type === 'FINISHED_GOOD' || i.cat === 'Finished Goods')}
                  onViewItem={setViewingItem}
                  onOpenBatchRelease={() => setIsBatchReleaseModalOpen(true)}
                  onMovement={(item, mode) => { setSelectedItem(item); setMovementMode(mode); setIsMovementModalOpen(true); }}
                  onToggleBatchItem={handleToggleBatchItem}
                  batchCart={batchCart}
                  batchCartCount={batchCart.length}
                  activeActionRow={activeActionRow}
                  setActiveActionRow={setActiveActionRow}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      <NewItemModal 
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onSave={handleNewItemSave}
        defaultCategory={itemModalCategory}
      />

      <StockMovementModal 
        key={`movement-${isMovementModalOpen}-${selectedItem?.sku || 'none'}`}
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
          key={viewingItem.id || viewingItem.sku}
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
