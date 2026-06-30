import { useState } from "react";
import type { Route } from "./+types/checkout";
import { useCart, useNotifications } from "../context/CartContext";
import { NavLink } from "react-router";
import { getOrders, saveOrders } from "../data/db.client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout | The Cann Flow" },
    { name: "description", content: "Complete your cannabis order with self-checkout. Same-day delivery in North York and GTA. No credit card required." },
  ];
}

interface OrderSummary {
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
}

export default function Checkout() {
  const { cart, clearCart, getCartCalculations, happyHourActive, referralApplied, applyReferral } = useCart();
  const { showNotification } = useNotifications();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zone, setZone] = useState<"north-york" | "gta" | "mail">("north-york");
  const [referralCode, setReferralCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  
  // Checkout submission states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<OrderSummary | null>(null);

  const cartCalcs = getCartCalculations();

  // Calculate Delivery Fee & Thresholds
  // North York: free delivery above 50, else 5 fee
  // GTA: free delivery above 60, else 10 fee
  // Mail Order (Canada): flat 15 fee
  const getDeliveryDetails = () => {
    switch (zone) {
      case "north-york":
        return {
          fee: cartCalcs.subtotal >= 50 ? 0 : 5.0,
          freeThreshold: 50,
          name: "North York Delivery"
        };
      case "gta":
        return {
          fee: cartCalcs.subtotal >= 60 ? 0 : 10.0,
          freeThreshold: 60,
          name: "GTA Delivery"
        };
      case "mail":
        return {
          fee: 15.0,
          freeThreshold: null,
          name: "Mail Order (Canada-wide)"
        };
    }
  };

  const delivery = getDeliveryDetails();
  const finalTotal = Number((cartCalcs.total + delivery.fee).toFixed(2));

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode.trim()) {
      showNotification("Please enter a referral code first", "warning");
      return;
    }
    applyReferral(referralCode);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showNotification("Your cart is empty!", "error");
      return;
    }

    if (!name.trim() || !phone.trim()) {
      showNotification("Please fill in your Name and Phone Number", "error");
      return;
    }

    if (zone !== "mail" && !address.trim()) {
      showNotification("Please provide a Delivery Address", "error");
      return;
    }

    // Generate Order
    const orderId = `TCF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderSummary = {
      orderId,
      name: name.trim(),
      phone: phone.trim(),
      address: zone === "mail" ? address.trim() || "Mail Order (Canada)" : address.trim(),
      zone: delivery.name,
      items: cart.map(item => {
        let priceFactor = 1;
        if (item.selectedWeight === "14g") priceFactor = 1.8;
        if (item.selectedWeight === "28g") priceFactor = 3.2;
        if (item.selectedWeight === "3.5g") priceFactor = 0.55;
        
        return {
          name: item.product.name,
          qty: item.quantity,
          weight: item.selectedWeight,
          price: Number((item.product.price * priceFactor).toFixed(2))
        };
      }),
      subtotal: cartCalcs.subtotal,
      happyHourDiscount: cartCalcs.happyHourDiscount,
      loyaltyDiscount: cartCalcs.loyaltyDiscount,
      referralDiscount: cartCalcs.referralDiscount,
      deliveryFee: delivery.fee,
      total: finalTotal,
      paymentMethod,
      timestamp: new Date().toLocaleString()
    };

    // Save locally
    try {
      const orders = getOrders();
      orders.unshift(newOrder);
      saveOrders(orders);
      
      setPlacedOrder(newOrder);
      setIsSubmitted(true);
      clearCart();
      showNotification("Order self-checked out successfully!", "success");
    } catch (err) {
      console.error("Error submitting order", err);
      showNotification("Error saving order details", "error");
    }
  };

  const getSmsText = (order: OrderSummary) => {
    const itemsText = order.items
      .map(item => `- ${item.name} (${item.weight}) x${item.qty}`)
      .join("\n");

    return `THE CANN FLOW ORDER: ${order.orderId}
Name: ${order.name}
Phone: ${order.phone}
Address: ${order.address}
Zone: ${order.zone}
Payment: ${order.paymentMethod}

Items:
${itemsText}

Subtotal: ${order.subtotal.toFixed(2)}
Happy Hour: -${order.happyHourDiscount.toFixed(2)}
Loyalty: -${order.loyaltyDiscount.toFixed(2)}
Referral: -${order.referralDiscount.toFixed(2)}
Delivery: ${order.deliveryFee.toFixed(2)}
Total: ${order.total.toFixed(2)}

Please confirm my delivery, thank you!`;
  };

  const handleCopyText = () => {
    if (placedOrder && typeof navigator !== "undefined") {
      const text = getSmsText(placedOrder);
      navigator.clipboard.writeText(text);
      showNotification("Text summary copied to clipboard!", "success");
    }
  };

  if (isSubmitted && placedOrder) {
    const smsText = getSmsText(placedOrder);
    const encodedSms = encodeURIComponent(smsText);

    return (
      <div className="container-custom" style={{ marginTop: "2rem", maxWidth: "680px" }}>
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-primary)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyItems: "center", margin: "0 auto 1.5rem" }}>
            <svg style={{ width: "36px", height: "36px", margin: "auto" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>ORDER PLACED</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
            Order {placedOrder.orderId} has been registered. Follow the instructions below to complete your checkout.
          </p>

          <div style={{ textAlign: "left", background: "var(--bg-input)", border: "1px solid var(--border-color)", padding: "1.5rem", borderRadius: "10px", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--color-primary)" }}>TEXT US TO CONFIRM</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
              Since we are a cash/EMT self-checkout shop, please text your order summary to <strong>+1 (416) 456-7559</strong>. Click below to auto-open your text messages, or copy the template to text manually.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a 
                href={`sms:+14164567559?body=${encodedSms}`} 
                style={{ flex: 1, textAlign: "center" }}
              >
                <button className="btn-age-verify" style={{ width: "100%" }}>OPEN MESSAGES</button>
              </a>
              <button 
                className="btn-age-decline" 
                style={{ flex: 1 }}
                onClick={handleCopyText}
              >
                COPY SUMMARY
              </button>
            </div>
          </div>

          <div style={{ textAlign: "left", fontSize: "0.9rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Order details</h4>
            <div style={{ display: "grid", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              <div>Client: {placedOrder.name}</div>
              <div>Phone: {placedOrder.phone}</div>
              <div>Address: {placedOrder.address}</div>
              <div>Zone: {placedOrder.zone}</div>
            </div>

            {placedOrder.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "0.25rem 0", color: "var(--text-muted)" }}>
                <span>{item.name} ({item.weight}) x{item.qty}</span>
                <span>{item.price.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", borderTop: "1px dashed var(--border-color)", paddingTop: "0.5rem", fontWeight: 700, color: "var(--text-main)" }}>
              <span>Total value:</span>
              <span>{placedOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <NavLink to="/">
            <button className="qty-btn" style={{ width: "auto", margin: "2rem auto 0", padding: "0.5rem 1.5rem" }}>
              Return to Menu
            </button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.5rem" }}>CHECKOUT</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Secure your order details. Pay cash or e-Transfer upon arrival. No online fees.</p>

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          <svg style={{ width: "64px", height: "64px", opacity: 0.3, marginBottom: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
          </svg>
          <h3>Your Basket is Empty</h3>
          <p style={{ margin: "0.5rem 0 1.5rem" }}>Add items to your cart from our menu to initiate checkout.</p>
          <NavLink to="/">
            <button className="btn-age-verify" style={{ width: "auto", padding: "0.6rem 2rem" }}>Browse Products</button>
          </NavLink>
        </div>
      ) : (
        <div className="checkout-grid">
          
          {/* Checkout Details Form */}
          <form className="glass-panel" style={{ padding: "2rem" }} onSubmit={handleCheckoutSubmit}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>DELIVERY INFORMATION</h2>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone & Text Number (For verification)</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +1 (416) 456-7559"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Zone</label>
              <div className="zone-selector-grid">
                <div 
                  className={`zone-card ${zone === "north-york" ? "selected" : ""}`}
                  onClick={() => setZone("north-york")}
                >
                  <div className="zone-card-title">North York</div>
                  <div className="zone-card-info">Free on 50+<br />Else 5.00 fee</div>
                </div>
                <div 
                  className={`zone-card ${zone === "gta" ? "selected" : ""}`}
                  onClick={() => setZone("gta")}
                >
                  <div className="zone-card-title">GTA</div>
                  <div className="zone-card-info">Free on 60+<br />Else 10.00 fee</div>
                </div>
                <div 
                  className={`zone-card ${zone === "mail" ? "selected" : ""}`}
                  onClick={() => setZone("mail")}
                >
                  <div className="zone-card-title">Mail Order</div>
                  <div className="zone-card-info">Canada-wide<br />Flat 15.00 fee</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{zone === "mail" ? "Mailing Address (Canada)" : "Delivery Address"}</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder={zone === "mail" ? "Unit/Apt, Street address, City, Province, Postal Code" : "Apt/Suite, street address, intersection details..."}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select 
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery / Drop</option>
                <option value="Interac e-Transfer">Interac e-Transfer (EMT)</option>
              </select>
            </div>

            {zone !== "mail" && delivery.freeThreshold && cartCalcs.subtotal < delivery.freeThreshold && (
              <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid var(--color-accent-gold)", padding: "1rem", borderRadius: "8px", color: "var(--color-accent-gold)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Notice: You are {(delivery.freeThreshold - cartCalcs.subtotal).toFixed(2)} away from qualifying for free delivery! Add more items to waive the {delivery.fee.toFixed(2)} delivery fee.
              </div>
            )}

            <button type="submit" className="cart-checkout-btn" style={{ padding: "1.1rem" }}>
              SUBMIT ORDER DETAILS
            </button>
          </form>

          {/* Cart Sidebar Breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Promo Code Application */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem" }}>PROMO / REFERRAL CODE</h3>
              <form style={{ display: "flex", gap: "0.5rem" }} onSubmit={handleApplyReferral}>
                <input
                  type="text"
                  placeholder="Enter code"
                  className="form-input"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                />
                <button
                  type="submit"
                  className="qty-btn"
                  style={{ width: "auto", padding: "0.5rem 1.25rem", background: "var(--color-primary)", color: "var(--text-dark)", borderRadius: "6px", fontWeight: 700 }}
                >
                  APPLY
                </button>
              </form>
              {referralApplied && (
                <div style={{ color: "var(--color-primary)", fontSize: "0.8rem", marginTop: "0.5rem", fontWeight: 600 }}>
                  Active Referral Code applied: 20.00 discount.
                </div>
              )}
            </div>

            {/* Order Review panel */}
            <div className="glass-panel" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>ORDER SUMMARY</h3>
              
              <div style={{ maxHeight: "250px", overflowY: "auto", display: "grid", gap: "0.75rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                {cart.map((item, idx) => {
                  let priceFactor = 1;
                  if (item.selectedWeight === "14g") priceFactor = 1.8;
                  if (item.selectedWeight === "28g") priceFactor = 3.2;
                  if (item.selectedWeight === "3.5g") priceFactor = 0.55;
                  
                  const itemPrice = item.product.price * priceFactor;
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                      <div>
                        <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{item.product.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Qty {item.quantity} &bull; {item.selectedWeight}</div>
                      </div>
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>{itemTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span>{cartCalcs.subtotal.toFixed(2)}</span>
                </div>
                {happyHourActive && (
                  <div style={{ display: "flex", justifyContent: "space-between" }} className="discount">
                    <span>Happy Hour 10% Off</span>
                    <span>-{cartCalcs.happyHourDiscount.toFixed(2)}</span>
                  </div>
                )}
                {cartCalcs.loyaltyDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }} className="discount">
                    <span>Loyalty Savings</span>
                    <span>-{cartCalcs.loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                {referralApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between" }} className="discount">
                    <span>Referral Discount</span>
                    <span>-{cartCalcs.referralDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Delivery Zone Fee ({delivery.name})</span>
                  <span>{delivery.fee.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "0.75rem", marginTop: "0.5rem", fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)" }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "var(--font-heading)" }}>{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
