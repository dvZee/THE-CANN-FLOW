import React, { useState, useEffect, createContext, useContext } from "react";
import { type Product } from "../data/catalog";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeight: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (productId: string, weight: string) => void;
  updateQuantity: (productId: string, weight: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  happyHourActive: boolean;
  referralApplied: boolean;
  applyReferral: (code: string | null) => boolean;
  getCartCalculations: () => {
    subtotal: number;
    happyHourDiscount: number;
    loyaltyDiscount: number;
    referralDiscount: number;
    total: number;
  };
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: Notification["type"]) => void;
  dismissNotification: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: Notification["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      dismissNotification(id);
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [happyHourActive, setHappyHourActive] = useState(false);
  const [referralApplied, setReferralApplied] = useState(false);
  
  const { showNotification } = useNotifications();

  // Poll for Happy Hour (Toronto Timezone)
  useEffect(() => {
    const checkHappyHour = () => {
      const date = new Date();
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        hour: "numeric",
        hour12: false,
      }).format(date);
      const hour = parseInt(hourStr, 10);
      setHappyHourActive(hour >= 15 && hour < 17); // 3pm - 5pm
    };

    checkHappyHour();
    const interval = setInterval(checkHappyHour, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("thecannflow_cart");
      if (stored) {
        try {
          setCart(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("thecannflow_cart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number, weight: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedWeight === weight
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedWeight: weight });
    }
    
    saveCart(newCart);
    showNotification(`Added ${quantity}x ${product.name} (${weight}) to cart`);
  };

  const removeFromCart = (productId: string, weight: string) => {
    const newCart = cart.filter(
      (item) => !(item.product.id === productId && item.selectedWeight === weight)
    );
    saveCart(newCart);
    showNotification("Item removed from cart", "info");
  };

  const updateQuantity = (productId: string, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }

    const newCart = cart.map((item) => {
      if (item.product.id === productId && item.selectedWeight === weight) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setReferralApplied(false);
  };

  const applyReferral = (code: string | null): boolean => {
    if (!code) {
      setReferralApplied(false);
      return false;
    }
    
    if (code.trim().length >= 4) {
      setReferralApplied(true);
      showNotification("Referral discount 20.00 applied!", "success");
      return true;
    }
    showNotification("Invalid referral code. Minimum 4 characters.", "error");
    return false;
  };

  const getCartCalculations = () => {
    const subtotal = cart.reduce((acc, item) => {
      let priceFactor = 1;
      if (item.selectedWeight === "14g") priceFactor = 1.8;
      if (item.selectedWeight === "28g") priceFactor = 3.2;
      if (item.selectedWeight === "3.5g") priceFactor = 0.55;
      
      const itemPrice = item.product.price * priceFactor;
      return acc + (itemPrice * item.quantity);
    }, 0);

    const happyHourDiscount = happyHourActive ? subtotal * 0.10 : 0;
    const runningSubtotal = subtotal - happyHourDiscount;
    const loyaltyDiscount = Math.floor(runningSubtotal / 50) * 5;
    const referralDiscount = referralApplied ? Math.min(20, runningSubtotal - loyaltyDiscount) : 0;
    const total = Math.max(0, subtotal - happyHourDiscount - loyaltyDiscount - referralDiscount);

    return {
      subtotal: Number(subtotal.toFixed(2)),
      happyHourDiscount: Number(happyHourDiscount.toFixed(2)),
      loyaltyDiscount: Number(loyaltyDiscount.toFixed(2)),
      referralDiscount: Number(referralDiscount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        happyHourActive,
        referralApplied,
        applyReferral,
        getCartCalculations,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
