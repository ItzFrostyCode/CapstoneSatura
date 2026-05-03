import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const INIT_FILES = [
  'users.json',
  'staff.json',
  'customers.json',
  'measurements.json',
  'orders.json',
  'inventory.json',
  'billing.json',
  'premade.json',
  'appointments.json',
  'customer_orders.json'
];

export async function initDb() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    for (const file of INIT_FILES) {
      const filePath = path.join(DATA_DIR, file);
      try {
        await fs.access(filePath);
      } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(filePath, '[]', 'utf-8');
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

export async function readData(collection: string) {
  await initDb();
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeData(collection: string, data: Record<string, unknown>[]) {
  await initDb();
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
