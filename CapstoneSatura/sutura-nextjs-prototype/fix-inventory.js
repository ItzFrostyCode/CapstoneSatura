const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const inventoryPath = path.join(dataDir, 'inventory.json');

const rawInventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const inventory = rawInventory.map(i => {
  let parsedCost = i.cost;
  if (typeof parsedCost === 'string') {
    parsedCost = parseFloat(parsedCost.replace(/[^0-9.]/g, '')) || 0;
  }
  
  return {
    ...i,
    cost: parsedCost,
    minStock: i.minStock !== undefined ? i.minStock : 10,
    reserved: i.reserved !== undefined ? i.reserved : 0,
  };
});

fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
console.log("Fixed inventory.json");
