import { INITIAL_PRODUCTS, type Product } from "./catalog";

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

export function getProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  const stored = localStorage.getItem("tcf_products");
  if (!stored) {
    localStorage.setItem("tcf_products", JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("tcf_products", JSON.stringify(products));
  }
}

export function getOrders(): OrderSummary[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("tcf_orders");
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveOrders(orders: OrderSummary[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("tcf_orders", JSON.stringify(orders));
  }
}

export function saveUploadedImage(base64String: string): string {
  // Return the base64 string directly so it is stored inline in localStorage
  return base64String;
}
