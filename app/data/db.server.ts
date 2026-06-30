import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS, type Product } from "./catalog";

const DATA_DIR = path.join(process.cwd(), "app", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directory exists
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export function getProducts(): Product[] {
  ensureDir(DATA_DIR);
  
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), "utf-8");
    return INITIAL_PRODUCTS;
  }
  
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products database", error);
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  ensureDir(DATA_DIR);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export interface OrderSummary {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  zone: string;
  items: { name: string; qty: number; weight: string; price: number }[];
  subtotal: number;
  happyHourDiscount: number;
  loyaltyDiscount: number;
  referralDiscount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  status?: string;
}

export function getOrders(): OrderSummary[] {
  ensureDir(DATA_DIR);
  
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
  
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders database", error);
    return [];
  }
}

export function saveOrders(orders: OrderSummary[]): void {
  ensureDir(DATA_DIR);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

/**
 * Saves a base64 encoded image to the public/uploads directory.
 * @param base64String The raw base64 string (can include metadata prefix e.g., data:image/png;base64,)
 * @returns The public URL path to the saved image (e.g. /uploads/image-1625098342.png)
 */
export function saveUploadedImage(base64String: string): string {
  ensureDir(UPLOADS_DIR);

  // Match the standard pattern: data:image/png;base64,iVBORw0KGgo...
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  
  // Determine file extension
  let extension = "png";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
    extension = "jpg";
  } else if (mimeType.includes("webp")) {
    extension = "webp";
  } else if (mimeType.includes("gif")) {
    extension = "gif";
  }

  const filename = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  
  // Write the file buffer
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);

  // Return the public relative URL
  return `/uploads/${filename}`;
}
