// Shared Supplier Data Management for Sutura Prototype

const DEFAULT_SUPPLIERS = [
  {
    id: 1,
    name: "Premium Fabrics Inc.",
    email: "orders@premiumfabrics.com",
    contactPerson: "Elena Cruz",
    phone: "+63 917 555 8888",
    category: "Wholesale Fabrics",
    rating: 4.9,
    address: "123 Textile Ave, Makati, Metro Manila"
  },
  {
    id: 2,
    name: "QC Garment Supplies",
    email: "wholesale@qcgarments.com",
    contactPerson: "Ricardo Santos",
    phone: "+63 920 123 4567",
    category: "Buttons & Zippers",
    rating: 4.5,
    address: "456 Fashion St, Quezon City"
  },
  {
    id: 3,
    name: "Textile World Manila",
    email: "sales@textileworld.ph",
    contactPerson: "Maria Clara",
    phone: "+63 918 765 4321",
    category: "Premium Fabrics",
    rating: 4.9,
    address: "789 Weaver Lane, Manila"
  },
  {
    id: 4,
    name: "Sewing Essentials Co.",
    email: "hello@sewingessentials.com",
    contactPerson: "Juan Dela Cruz",
    phone: "+63 905 111 2222",
    category: "Threads & Needles",
    rating: 4.7,
    address: "101 Stitch Road, Pasig"
  }
];

function getSuppliers() {
  const stored = localStorage.getItem('sutura_suppliers');
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with defaults if empty
  localStorage.setItem('sutura_suppliers', JSON.stringify(DEFAULT_SUPPLIERS));
  return DEFAULT_SUPPLIERS;
}

function saveSupplier(supplier) {
  const suppliers = getSuppliers();
  // Generate ID if it doesn't exist
  if (!supplier.id) {
    supplier.id = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
  }
  
  // Update or Add
  const index = suppliers.findIndex(s => s.id === supplier.id);
  if (index !== -1) {
    suppliers[index] = supplier;
  } else {
    suppliers.push(supplier);
  }
  
  localStorage.setItem('sutura_suppliers', JSON.stringify(suppliers));
  return supplier;
}

function deleteSupplier(id) {
  let suppliers = getSuppliers();
  suppliers = suppliers.filter(s => s.id !== id);
  localStorage.setItem('sutura_suppliers', JSON.stringify(suppliers));
}
