'use client';

import { useState, useMemo, useCallback } from 'react';
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
} from 'lucide-react';

import { useERPStore, InventoryItem } from '@/store/useERPStore';

// Modular Components
import { InventoryStats } from './components/InventoryStats';
import { MaterialsTable } from './components/MaterialsTable';
import { FinishedGoodsTable } from './components/FinishedGoodsTable';
import { ProductionAssembly, BOMRecipe } from './components/ProductionAssembly';
import { MovementHistory } from './components/MovementHistory';
import { InventoryItemDetail } from './components/InventoryItemDetail';

// Modals
import { NewItemModal } from './components/InventoryModals/NewItemModal';
import { BOMModal } from './components/InventoryModals/BOMModal';
import { StockMovementModal } from './components/InventoryModals/StockMovementModal';
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
    inventory,
    movements,
    recipes,
    staff,
    suppliers,
    customers,
    addMovement,
    updateInventoryItem,
    addInventoryItem,
    saveRecipe,
    recordBatchRelease
  } = useERPStore();

  const [activeTab, setActiveTab] = useState<'materials' | 'finished' | 'assembly' | 'history' | 'low_stock' | 'transfers'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Low Stock' | 'Out of Stock'>('All');
  
  // Modal States
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isBatchReleaseModalOpen, setIsBatchReleaseModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  
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

  // Assembly State
  const [assemblyStep, setAssemblyStep] = useState(1);
  const [assemblyProductId, setAssemblyProductId] = useState('');
  const [assemblyQty, setAssemblyQty] = useState(1);
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

  interface MovementData {
    itemSku: string;
    type: 'RECEIVE' | 'ISSUE' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT' | 'TRANSFER_IN' | 'TRANSFER_OUT';
    qty: number;
    unitCost?: number;
    referenceType: string;
    referenceId?: string;
  }

  const handleMovementConfirm = (data: MovementData) => {
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
      itemSku: data.itemSku,
      qty: qtyChange,
      type: data.type === 'RECEIVE' ? 'Stock In' : 
            data.type === 'ISSUE' ? 'Stock Out' : 
            data.type === 'ADJUSTMENT_IN' || data.type === 'ADJUSTMENT_OUT' ? 'Adjustment' : 'Production',
      ref: `${data.referenceType}: ${data.referenceId || 'Manual'}`,
      staff_id: 'STF-001', // Mock admin
    });
  };

  const handleSaveBOM = () => {
    saveRecipe({ productId: bomProductId, materials: bomMaterials });
    setIsBOMModalOpen(false);
  };

  const handleExecuteAssembly = () => {
    const recipe = recipes.find(r => r.productId === assemblyProductId);
    if (!recipe) return;

    recipe.materials.forEach((mat: { sku: string, qty: number }) => {
      const invItem = inventory.find(i => i.sku === mat.sku);
      if (invItem) {
        updateInventoryItem(mat.sku, { stock: (invItem.stock || 0) - (mat.qty * assemblyQty) });
        addMovement({
          itemSku: mat.sku,
          qty: -(mat.qty * assemblyQty),
          type: 'Production',
          ref: `Assembly: ${assemblyProductId}`,
          staff_id: 'STF-001',
        });
      }
    });

    const targetProduct = inventory.find(i => i.sku === assemblyProductId);
    if (targetProduct) {
      updateInventoryItem(assemblyProductId, { stock: (targetProduct.stock || 0) + assemblyQty });
      addMovement({
        itemSku: assemblyProductId,
        qty: assemblyQty,
        type: 'Production',
        ref: 'Assembly Completion',
        staff_id: 'STF-001',
      });
    }

    setAssemblySuccess(true);
    setTimeout(() => {
      setAssemblySuccess(false);
      setAssemblyStep(1);
    }, 2000);
  };

  const handleBatchReleaseConfirm = () => {
    recordBatchRelease(batchReleaseCustomerId, batchReleaseJobOrder, finishedGoods, batchReleasePayment);
    setIsBatchReleaseModalOpen(false);
    setBatchReleaseStep(1);
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
      const needed = req.qty * assemblyQty;
      if (!item || (item.stock || 0) < needed) {
        missing.push({ name: item?.item || req.sku, needed, avail: item?.stock || 0, unit: item?.unit || '' });
      }
    });
    return { canAssemble: missing.length === 0, missing };
  }, [assemblyProductId, assemblyQty, inventory, recipes]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight flex items-center gap-3">
            Inventory
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage raw materials, production recipes, and movements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewItemModalOpen(true)}
            className="h-12 px-6 bg-white border border-slate-200 rounded-xl text-[14px] font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} /> New Item
          </button>
          <button 
            onClick={() => setIsBOMModalOpen(true)}
            className="h-12 px-6 bg-white border border-slate-200 rounded-xl text-[14px] font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Layers size={18} /> BOM Setup
          </button>
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="h-12 px-6 bg-indigo-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <ArrowRightLeft size={18} /> Internal Transfer
          </button>
          <button 
            onClick={() => { setSelectedItem(null); setIsMovementModalOpen(true); }}
            className="h-12 px-6 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <History size={18} /> Stock Movement
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <InventoryStats 
        stats={[
          { label: 'Raw Materials', value: materials.length.toString(), color: 'indigo', sub: 'Available SKUs', filter: 'All' },
          { label: 'Finished Units', value: finishedGoods.reduce((sum, i) => sum + (i.stock || 0), 0).toString(), color: 'emerald', sub: 'Ready for Release', filter: 'All' },
          { label: 'Low Stock', value: inventory.filter(i => getStatus(i) === 'Low Stock').length.toString(), color: 'amber', sub: 'Watch List', filter: 'Low Stock' },
          { label: 'Out of Stock', value: inventory.filter(i => getStatus(i) === 'Out of Stock').length.toString(), color: 'rose', sub: 'Critical', filter: 'Out of Stock' },
        ]}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onTabChange={setActiveTab}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 mx-4 border border-slate-200/50">
        {( [
          { id: 'materials', name: 'Raw Materials', icon: <Database size={14} /> },
          { id: 'finished', name: 'Finished Goods', icon: <Package size={14} /> },
          { id: 'assembly', name: 'Production', icon: <Zap size={14} /> },
          { id: 'history', name: 'Movement History', icon: <History size={14} /> },
          { id: 'transfers', name: 'Internal Transfers', icon: <ArrowRightLeft size={14} /> },
          { id: 'low_stock', name: 'Low Stock', icon: <TrendingDown size={14} /> }
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-full text-[13px] font-black transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden mx-4">
        {activeTab === 'materials' && (
          <MaterialsTable 
            materials={filteredMaterials}
            suppliers={suppliers}
            onViewItem={setViewingItem}
            onMovement={(item) => { setSelectedItem(item); setIsMovementModalOpen(true); }}
            renderAvatar={renderAvatar}
            activeActionRow={activeActionRow}
            setActiveActionRow={setActiveActionRow}
          />
        )}

        {activeTab === 'finished' && (
          <FinishedGoodsTable 
            finishedGoods={filteredFinished}
            onViewItem={setViewingItem}
            onOpenBatchRelease={() => setIsBatchReleaseModalOpen(true)}
            onMovement={(item) => { setSelectedItem(item); setIsMovementModalOpen(true); }}
            batchCartCount={finishedGoods.filter(i => (i.stock || 0) > 0).length}
            renderAvatar={renderAvatar}
            activeActionRow={activeActionRow}
            setActiveActionRow={setActiveActionRow}
          />
        )}

        {activeTab === 'assembly' && (
          <ProductionAssembly 
            assemblyStep={assemblyStep}
            setAssemblyStep={setAssemblyStep}
            assemblyProductId={assemblyProductId}
            setAssemblyProductId={setAssemblyProductId}
            assemblyQty={assemblyQty}
            setAssemblyQty={setAssemblyQty}
            assemblySuccess={assemblySuccess}
            targetProduct={inventory.find(i => i.sku === assemblyProductId) || null}
            selectedRecipe={recipes.find(r => r.productId === assemblyProductId) || null}
            inventory={inventory}
            recipes={recipes}
            onExecute={handleExecuteAssembly}
            onImageUpload={handleImageUpload}
            updateInventoryItem={updateInventoryItem}
            assemblyValidation={assemblyValidation}
          />
        )}

        {activeTab === 'history' && (
          <MovementHistory movements={movements} staff={staff} inventory={inventory} />
        )}

        {activeTab === 'transfers' && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto"><ArrowRightLeft size={32} /></div>
            <div>
              <h3 className="text-[18px] font-black text-slate-900">Branch Logistics History</h3>
              <p className="text-[13px] text-slate-500 max-w-[400px] mx-auto mt-2">Internal stock movements between branches are logged here for cross-branch audit purposes.</p>
            </div>
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[13px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
            >
              <Plus size={16} /> New Internal Transfer
            </button>
          </div>
        )}

        {activeTab === 'low_stock' && (
          <MaterialsTable 
            materials={lowStockItems}
            suppliers={suppliers}
            onViewItem={setViewingItem}
            onMovement={(item) => { setSelectedItem(item); setIsMovementModalOpen(true); }}
            renderAvatar={renderAvatar}
            activeActionRow={activeActionRow}
            setActiveActionRow={setActiveActionRow}
          />
        )}
      </div>

      {/* Modals & Overlays */}
      <NewItemModal 
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onSave={handleNewItemSave}
      />

      <BOMModal 
        isOpen={isBOMModalOpen}
        onClose={() => setIsBOMModalOpen(false)}
        bomProductId={bomProductId}
        setBomProductId={setBomProductId}
        bomMaterials={bomMaterials}
        setBomMaterials={setBomMaterials}
        finishedGoods={finishedGoods}
        materials={materials}
        recipes={recipes}
        onSave={handleSaveBOM}
        renderAvatar={renderAvatar}
      />

      <StockMovementModal 
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        inventory={inventory}
        onConfirm={handleMovementConfirm}
        initialItem={selectedItem}
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
        batchCart={finishedGoods.filter(i => (i.stock || 0) > 0)}
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
