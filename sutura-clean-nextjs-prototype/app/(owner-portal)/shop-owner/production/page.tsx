"use client";
import { useMemo, useState } from "react";
import { LayoutGrid, Clock, Scissors, Shirt, CheckCircle, AlertCircle, User, ChevronRight, Activity, Zap, Layers } from "lucide-react";
import { useERPStore, Order, OrderStatus } from "@/store/useERPStore";

type ProductionStage =
  | "ORDER_INTAKE" | "MEASURING" | "MATERIAL_SOURCING"
  | "CUTTING" | "SEWING" | "FIRST_FITTING"
  | "ALTERATIONS" | "FINISHING" | "READY_FOR_PICKUP";

const STAGES: Array<{ key: string; label: string; color: string; bg: string; orderStatus: OrderStatus }> = [
  { key: "INTAKE",            label: "Agreement",        color: "#1C1917",  bg: "#F0EDE8",    orderStatus: "INTAKE" },
  { key: "MEASUREMENT",       label: "Measuring",        color: "#1E3A1F",   bg: "#FAF8F5",     orderStatus: "MEASUREMENT" },
  { key: "MATERIAL_PREP",     label: "Materials",        color: "#C9A84C",  bg: "#FAF8F5",    orderStatus: "MATERIAL_PREP" },
  { key: "CUTTING",           label: "Cutting",          color: "#1E3A1F", bg: "#FAF8F5",   orderStatus: "CUTTING" },
  { key: "SEWING",            label: "Sewing",           color: "#1E3A1F", bg: "#FAF8F5",   orderStatus: "SEWING" },
  { key: "FITTING",           label: "Fitting",          color: "#C9A84C", bg: "#FAF8F5",   orderStatus: "FITTING" },
  { key: "ALTERATIONS",       label: "Alterations",      color: "#B45309",   bg: "#FAF8F5",     orderStatus: "ALTERATIONS" },
  { key: "FINISHING",         label: "Finishing",        color: "#1E3A1F",   bg: "#FAF8F5",     orderStatus: "FINISHING" },
  { key: "QUALITY_CHECK",     label: "Quality Check",    color: "#1E3A1F",   bg: "#FAF8F5",     orderStatus: "QUALITY_CHECK" },
  { key: "READY_FOR_PICKUP",  label: "Ready",            color: "#1E3A1F",   bg: "#1E3A1F/5",  orderStatus: "READY_FOR_PICKUP" },
];

const PRIORITY_COLOR: Record<string, string> = {
  Normal: "bg-[#F0EDE8] text-[#78716C]",
  High:   "bg-indigo-600/10 text-white",
  Urgent: "bg-[#DC2626]/10 text-[#DC2626]",
};

export default function ProductionPage() {
  const { orders, getEnrichedOrders, updateOrderStatus, staff } = useERPStore();
  const enrichedOrders = useMemo(() => getEnrichedOrders(), [orders, getEnrichedOrders]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedCard = useMemo(() => 
    enrichedOrders.find(o => o.id === selectedOrderId),
    [enrichedOrders, selectedOrderId]
  );

  const advanceCard = (orderId: string) => {
    const order = enrichedOrders.find(o => o.id === orderId);
    if (!order) return;

    const currentStageIdx = STAGES.findIndex(s => s.orderStatus === order.status);
    const nextStage = STAGES[currentStageIdx + 1];
    
    if (nextStage) {
      updateOrderStatus(orderId, nextStage.orderStatus, `Advanced production to ${nextStage.label}`);
    }
    
    setSelectedOrderId(null);
  };

  const isOverdue = (dueDate?: string) => dueDate ? new Date(dueDate) < new Date() : false;

  const getStaffName = (id?: string) => {
    if (!id) return "Unassigned";
    return staff.find(s => s.id === id)?.name || "Unknown Staff";
  };

  return (
    <div className="relative min-h-full pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-6 px-2">
        <div>
          <h1 className="text-[36px] font-bold font-sans text-[#1C1917] tracking-tight leading-none">Workshop Pulse</h1>
          <p className="text-[14px] text-[#78716C] mt-3">Orchestrating the lifecycle of every bespoke creation.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest">Total Active</span>
              <span className="text-[24px] font-bold text-[#1C1917]">{enrichedOrders.length}</span>
           </div>
           <div className="w-px h-10 bg-[#E2DDD7]" />
           <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-widest">Overdue</span>
              <span className="text-[24px] font-bold text-[#DC2626]">{enrichedOrders.filter(o => isOverdue(o.dueDate) && o.status !== "RELEASED").length}</span>
           </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-10 scrollbar-hide">
        <div className="flex gap-6 min-w-max px-2">
          {STAGES.map((stage) => {
            const stageOrders = enrichedOrders.filter(o => o.status === stage.orderStatus);

            return (
              <div key={stage.key} className="w-[300px] flex-shrink-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-6 px-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                     <span className="text-[13px] font-bold text-[#1C1917] uppercase tracking-widest">{stage.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#78716C] bg-[#F0EDE8] px-2.5 py-1 rounded-full">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-4 min-h-[500px] bg-[#FAF8F5]/30 rounded-[32px] p-3 border border-dashed border-[#E2DDD7]">
                  {stageOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full text-left bg-white rounded-[24px] border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
                        isOverdue(order.dueDate) && order.status !== "RELEASED"
                          ? "border-[#DC2626]/20 shadow-lg shadow-[#DC2626]/5"
                          : "border-[#E2DDD7]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-[10px] font-bold text-[#78716C] uppercase">{order.id}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${PRIORITY_COLOR[order.priority || "Normal"]}`}>
                          {order.priority || "Normal"}
                        </span>
                      </div>
                      <div className="text-[16px] font-bold font-sans text-[#1C1917] mb-2 leading-tight">
                        {(order as any).items?.[0]?.garment_name || "Bespoke Garment"}
                      </div>
                      <div className="text-[12px] text-[#78716C] mb-5">{(order as any).customer_name || "Client #" + order.customer_id}</div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
                        <div className="flex items-center gap-2 text-[11px] font-bold">
                          <Clock size={14} className={isOverdue((order as any).dueDate) ? "text-[#DC2626]" : "text-[#78716C]"} />
                          <span className={isOverdue((order as any).dueDate) ? "text-[#DC2626]" : "text-[#78716C]"}>
                            {(order as any).dueDate ? new Date((order as any).dueDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) : "N/A"}
                          </span>
                        </div>
                        <div className="flex -space-x-2">
                           <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                              {getStaffName(order.assigned_staff_id).charAt(0)}
                           </div>
                        </div>
                      </div>
                    </button>
                  ))}

                  {stageOrders.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center text-[#78716C] opacity-30">
                       <Layers size={24} className="mb-2" />
                       <span className="text-[11px] font-bold uppercase">Station Empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-[#1C1917]/60 backdrop-blur-md z-50 flex items-center justify-center p-6" onClick={() => setSelectedOrderId(null)}>
          <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="text-[12px] font-bold text-white uppercase tracking-widest">{selectedCard.id}</span>
                <h2 className="text-[28px] font-bold font-sans text-[#1C1917] mt-2">{(selectedCard as any).items?.[0]?.garment_name || "Custom Garment"}</h2>
                <p className="text-[14px] text-[#78716C] mt-1">{(selectedCard as any).customer_name || "Client Reference"}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${PRIORITY_COLOR[selectedCard.priority || "Normal"]}`}>
                {selectedCard.priority || "Normal"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
               <div className="p-5 bg-[#FAF8F5] rounded-3xl">
                  <div className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest mb-1">Current Station</div>
                  <div className="text-[15px] font-bold text-[#1C1917]">{selectedCard.status.replace("_", " ")}</div>
               </div>
               <div className="p-5 bg-[#FAF8F5] rounded-3xl">
                  <div className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest mb-1">Lead Tailor</div>
                  <div className="text-[15px] font-bold text-[#1C1917]">{getStaffName(selectedCard.assigned_staff_id)}</div>
               </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setSelectedOrderId(null)} className="flex-1 h-14 rounded-2xl border border-[#E2DDD7] text-[#78716C] text-[14px] font-bold hover:bg-[#FAF8F5] transition-all">
                Close Profile
              </button>
              {selectedCard.status !== "RELEASED" && (
                <button
                  onClick={() => advanceCard(selectedCard.id)}
                  className="flex-1 h-14 rounded-2xl bg-slate-900 text-white text-[14px] font-bold shadow-lg hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                >
                  Move to Next Stage <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
