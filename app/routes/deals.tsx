import { useState, useEffect } from "react";
import type { Route } from "./+types/deals";
import { useCart, useNotifications } from "../context/CartContext";
import type { Product } from "../data/catalog";
import { useLoaderData } from "react-router";
import { getProducts } from "../data/db.client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Offers & Loyalty | The Cann Flow" },
    { name: "description", content: "Explore cannabis discounts, Happy Hour specials, Loyalty tiers, and build your custom Mix & Match flower deal." },
  ];
}

export function clientLoader() {
  const allProducts = getProducts();
  // Only show flowers (Hybrid, Indica, Sativa) for Mix & Match
  const products = allProducts.filter(p => 
    ["hybrid", "indica", "sativa"].includes(p.category.toLowerCase())
  );
  return { products };
}

interface DealConfig {
  name: string;
  weight: string;
  slotsCount: number;
  price: number;
}

export default function Deals() {
  const { addToCart, happyHourActive } = useCart();
  const { showNotification } = useNotifications();
  const { products } = useLoaderData<typeof clientLoader>();
  
  // Deal Builder state
  const [dealType, setDealType] = useState<"half" | "full">("full");
  const [slots, setSlots] = useState<(Product | null)[]>(Array(4).fill(null));

  const deals: Record<string, DealConfig> = {
    half: {
      name: "Mix & Match Half-Ounce Deal",
      weight: "14g",
      slotsCount: 2,
      price: 60.00
    },
    full: {
      name: "Mix & Match Ounce Deal",
      weight: "28g",
      slotsCount: 4,
      price: 110.00
    }
  };

  const activeDeal = deals[dealType];

  // Adjust slots size when deal type changes
  useEffect(() => {
    setSlots(Array(activeDeal.slotsCount).fill(null));
  }, [dealType, activeDeal.slotsCount]);


  const addStrainToSlot = (product: Product) => {
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) {
      showNotification("All slots are full! Remove one to add a different strain.", "warning");
      return;
    }
    const newSlots = [...slots];
    newSlots[emptyIndex] = product;
    setSlots(newSlots);
    showNotification(`Added ${product.name} to slot ${emptyIndex + 1}`);
  };

  const removeStrainFromSlot = (idx: number) => {
    if (slots[idx] === null) return;
    const newSlots = [...slots];
    newSlots[idx] = null;
    setSlots(newSlots);
  };

  const clearSlots = () => {
    setSlots(Array(activeDeal.slotsCount).fill(null));
  };

  const handleAddDealToCart = () => {
    const filledSlots = slots.filter(s => s !== null) as Product[];
    if (filledSlots.length < activeDeal.slotsCount) {
      showNotification(`Please fill all ${activeDeal.slotsCount} slots to build your bundle!`, "error");
      return;
    }

    // Count strains for description
    const strainCounts: Record<string, number> = {};
    filledSlots.forEach(p => {
      strainCounts[p.name] = (strainCounts[p.name] || 0) + 1;
    });

    const description = Object.entries(strainCounts)
      .map(([name, count]) => `${name} (7g) x ${count}`)
      .join(", ");

    // Build custom product representation
    const bundleProduct: Product = {
      id: `bundle-${dealType}-${Math.random().toString(36).substring(2, 7)}`,
      name: activeDeal.name,
      brand: "The Cann Flow Deal",
      description: `Custom bundle: ${description}`,
      category: "Hybrid", // treats as hybrid bundle
      price: activeDeal.price,
      thc: "Mixed Strains",
      rating: 5.0,
      reviewsCount: 1,
      image: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&q=80",
      isFeatured: false,
      weight: activeDeal.weight,
      weights: [activeDeal.weight]
    };

    addToCart(bundleProduct, 1, activeDeal.weight);
    clearSlots();
    showNotification("Custom Mix & Match deal added to cart!");
  };

  const copyReferralCode = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText("FLOW20");
      showNotification("Referral code 'FLOW20' copied to clipboard!", "success");
    }
  };

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      {/* Page Heading */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.5rem" }}>DEALS & REWARDS</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>Save big with automatic discounts, instant rewards, and custom strain bundles.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
        
        {/* Section 1: Mix & Match Builder */}
        <section className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem", marginBottom: "1.5rem", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700 }}>1. MIX & MATCH FLOWER DEALS</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Choose multiple strains and customize your order. More choice, more control.</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-input)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <button
                className="qty-btn"
                style={{ width: "auto", padding: "0.5rem 1rem", borderRadius: "6px", background: dealType === "half" ? "var(--color-primary)" : "transparent", color: dealType === "half" ? "var(--text-dark)" : "var(--text-muted)", fontWeight: 600 }}
                onClick={() => setDealType("half")}
              >
                14g Bundle (60.00)
              </button>
              <button
                className="qty-btn"
                style={{ width: "auto", padding: "0.5rem 1rem", borderRadius: "6px", background: dealType === "full" ? "var(--color-primary)" : "transparent", color: dealType === "full" ? "var(--text-dark)" : "var(--text-muted)", fontWeight: 600 }}
                onClick={() => setDealType("full")}
              >
                28g Bundle (110.00)
              </button>
            </div>
          </div>

          <div className="builder-layout">
            
            {/* Strains selection grid */}
            <div>
              <h4 style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>SELECT STRAINS (7g per item)</h4>
              <div className="builder-strains-grid">
                {products.map((product) => {
                  // Count how many times this strain is in the slots
                  const countInSlots = slots.filter(s => s?.id === product.id).length;

                  return (
                    <div
                      key={product.id}
                      className={`strain-card ${countInSlots > 0 ? "selected" : ""}`}
                      onClick={() => addStrainToSlot(product)}
                    >
                      {countInSlots > 0 && (
                        <span className="strain-selection-badge">{countInSlots}</span>
                      )}
                      <img src={product.image} alt={product.name} className="strain-card-img" />
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{product.brand}</div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", margin: "0.25rem 0" }}>{product.name}</h4>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem" }}>
                        <span style={{ color: "var(--color-primary)" }}>THC {product.thc}</span>
                        <span style={{ color: "var(--text-muted)" }}>&bull;</span>
                        <span style={{ color: "var(--color-accent-gold)" }}>{product.rating} &starf;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slots sidebar */}
            <div className="builder-sidebar glass-panel" style={{ background: "rgba(0,0,0,0.2)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>YOUR BUNDLE</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Select {activeDeal.slotsCount} strains above to customize your pack.</p>
              
              <div className="slots-grid">
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`slot-box ${slot ? "filled" : ""}`}
                    onClick={() => removeStrainFromSlot(idx)}
                    title={slot ? `Click to remove ${slot.name}` : "Empty Slot"}
                  >
                    {slot ? (
                      <img src={slot.image} alt={slot.name} className="slot-img" />
                    ) : (
                      <span>+</span>
                    )}
                  </div>
                ))}
              </div>

              {slots.filter(s => s !== null).length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Selections:</span>
                  {slots.map((slot, idx) => slot && (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.25rem" }}>
                      <span style={{ color: "var(--text-main)", fontWeight: 500 }}>{idx + 1}. {slot.name}</span>
                      <button style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }} onClick={() => removeStrainFromSlot(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Bundle Price:</span>
                  <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>{activeDeal.price.toFixed(2)}</span>
                </div>
                <button
                  className="cart-checkout-btn"
                  onClick={handleAddDealToCart}
                  disabled={slots.filter(s => s !== null).length < activeDeal.slotsCount}
                  style={{
                    opacity: slots.filter(s => s !== null).length < activeDeal.slotsCount ? 0.5 : 1,
                    cursor: slots.filter(s => s !== null).length < activeDeal.slotsCount ? "not-allowed" : "pointer"
                  }}
                >
                  ADD BUNDLE TO CART
                </button>
                {slots.filter(s => s !== null).length > 0 && (
                  <button
                    onClick={clearSlots}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", display: "block", margin: "1rem auto 0", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Reset Bundle
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Loyalty & Happy Hour Side-by-Side */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          
          {/* Loyalty Program */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <span className="slide-tag" style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>Loyalty pays</span>
            <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700, marginTop: "0.5rem", marginBottom: "1rem" }}>LOYALTY PROGRAM</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Spend and save instantly on your current order! The more you spend, the more you save. Instant stacking discounts — no points to track, no waiting.
            </p>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 50</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>5 OFF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 100</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>10 OFF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 150</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>15 OFF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 200</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>20 OFF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 250</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>25 OFF</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 300</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>30 OFF</span>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem", textAlign: "center" }}>
              Discount scales indefinitely (+5 off for every additional 50 spent).
            </p>
          </section>

          {/* Happy Hour & Referral Program */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Happy Hour Panel */}
            <section className="glass-panel" style={{ padding: "2rem", flexGrow: 1 }}>
              <span className="slide-tag" style={{ border: "1px solid var(--color-accent-gold)", color: "var(--color-accent-gold)" }}>Save daily</span>
              <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700, marginTop: "0.5rem", marginBottom: "0.75rem" }}>HAPPY HOUR</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                Order during happy hour and save 10% on all products!
                Active daily from 15:00 to 17:00 (3 PM - 5 PM) Eastern Standard Time.
              </p>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Current Status:</span>
                <span className={`badge-status ${happyHourActive ? "open" : "closed"}`} style={{ borderColor: happyHourActive ? "var(--color-primary)" : "var(--color-danger)" }}>
                  {happyHourActive ? "ACTIVE (10% OFF)" : "INACTIVE"}
                </span>
              </div>
            </section>

            {/* Referral Program */}
            <section className="glass-panel" style={{ padding: "2rem", flexGrow: 1 }}>
              <span className="slide-tag" style={{ border: "1px solid var(--color-secondary)", color: "var(--color-secondary)" }}>Refer & Earn</span>
              <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700, marginTop: "0.5rem", marginBottom: "0.75rem" }}>REFERRAL PROGRAM</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                Share the love. Refer a friend and you both receive a flat 20.00 discount on your orders!
              </p>

              <div style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Your Referral Code</span>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--text-main)", fontSize: "1.1rem" }}>FLOW20</span>
                </div>
                <button
                  onClick={copyReferralCode}
                  className="qty-btn"
                  style={{ width: "auto", padding: "0.5rem 1rem", background: "var(--color-primary)", color: "var(--text-dark)", borderRadius: "6px", fontWeight: 700 }}
                >
                  COPY CODE
                </button>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
