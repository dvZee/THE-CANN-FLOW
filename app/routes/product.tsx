import { useState } from "react";
import type { Route } from "./+types/product";
import { getProducts } from "../data/db.client";
import { type Product, getWeightFactor } from "../data/catalog";
import { useCart, useNotifications } from "../context/CartContext";
import { NavLink } from "react-router";

export function meta({ data }: { data?: { product: Product } }) {
  if (!data || !data.product) {
    return [{ title: "Product Not Found | The Cann Flow" }];
  }
  const { product } = data;
  return [
    { title: `${product.name} | ${product.brand} - The Cann Flow` },
    { name: "description", content: `${product.name} by ${product.brand}. THC: ${product.thc}. Category: ${product.category}. ${product.description}` },
    { name: "keywords", content: `${product.name}, ${product.brand}, ${product.category}, cannabis, weed` },
    { tagName: "link", rel: "canonical", href: `https://thecannflow.com/product/${product.id}` }
  ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const products = await getProducts();
  const product = products.find((p) => p.id === params.id);
  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }
  return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const { addToCart } = useCart();
  const { showNotification } = useNotifications();

  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [qty, setQty] = useState(1);

  const factor = getWeightFactor(selectedWeight);
  const currentPrice = Number((product.price * factor).toFixed(2));
  const originalPrice = product.originalPrice ? Number((product.originalPrice * factor).toFixed(2)) : undefined;
  
  // Calculate discount percentage if original price is present
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const handleAdd = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      showNotification("Please select an option/flavor first", "error");
      return;
    }
    addToCart(product, qty, selectedWeight, selectedVariant || undefined);
  };

  const getCategoryClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "hybrid": return "type-hybrid";
      case "indica": return "type-indica";
      case "sativa": return "type-sativa";
      default: return "type-hybrid";
    }
  };

  return (
    <div className="container-custom" style={{ marginTop: "2.5rem", marginBottom: "4rem" }}>
      
      {/* Back Link */}
      <div style={{ marginBottom: "1.5rem" }}>
        <NavLink 
          to="/" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            color: "var(--text-muted)", 
            fontWeight: 600, 
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "color 0.2s ease" 
          }}
          className="back-link-hover"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Menu
        </NavLink>
      </div>

      {/* Main Grid Wrapper */}
      <div className="glass-panel" style={{ padding: "2.5rem" }}>
        <div className="product-detail-grid">
          
          {/* Left Column: Image wrapper */}
          <div className="product-detail-img-wrapper" style={{ position: "relative" }}>
            {discountPercent > 0 && (
              <span className="product-badge" style={{ top: "1rem", left: "1rem" }}>
                {discountPercent}% OFF
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-detail-img" 
              style={{ maxHeight: "420px", objectFit: "contain", width: "100%" }} 
            />
          </div>
          
          {/* Right Column: Info & selection details */}
          <div className="product-detail-info">
            <span className="product-detail-brand">{product.brand}</span>
            <h1 className="product-detail-name" style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0.25rem 0 0.75rem" }}>
              {product.name}
            </h1>
            
            {/* Meta Row: THC, Category, Ratings */}
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", margin: "0.75rem 0 1.5rem", flexWrap: "wrap" }}>
              <span className="thc-tag" style={{ background: "rgba(16, 185, 129, 0.08)", color: "var(--color-primary)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.25rem 0.6rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                Total THC {product.thc}
              </span>
              {product.category && (
                <span className={`product-type-badge ${getCategoryClass(product.category)}`} style={{ position: "static", transform: "none" }}>
                  {product.category}
                </span>
              )}
              
              <div className="product-rating" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <svg className="star-icon" viewBox="0 0 20 20" style={{ width: "16px", height: "16px", fill: "var(--color-accent-gold)" }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "0.9rem" }}>{product.rating}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="product-detail-price-box" style={{ marginBottom: "1.5rem" }}>
              {originalPrice && (
                <span className="price-original" style={{ fontSize: "1.2rem", textDecoration: "line-through", color: "var(--text-muted)", marginRight: "0.75rem" }}>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="price-main" style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-main)" }}>
                ${currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div className="product-detail-desc-title" style={{ fontWeight: 700, fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Description
            </div>
            <p className="product-detail-desc" style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
              {product.description || "No description available for this product."}
            </p>

            {/* Variant / Option Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ margin: "1.5rem 0", maxWidth: "420px" }}>
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Select Option / Flavor *
                </label>
                <select
                  className="form-select"
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    outline: "none"
                  }}
                >
                  <option value="">-- Choose Option --</option>
                  {product.variants.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Weight selector */}
            {product.weights && product.weights.length > 0 && (
              <div style={{ margin: "1.5rem 0 2rem" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Select Weight
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {product.weights.map((w) => (
                    <button
                      key={w}
                      className={`qty-btn ${selectedWeight === w ? "active" : ""}`}
                      onClick={() => setSelectedWeight(w)}
                      style={{
                        width: "auto",
                        padding: "0.6rem 1.25rem",
                        borderRadius: "var(--radius-sm)",
                        background: selectedWeight === w ? "var(--color-primary-light)" : "var(--bg-surface)",
                        borderColor: selectedWeight === w ? "var(--color-primary)" : "var(--border-color)",
                        color: selectedWeight === w ? "var(--color-primary)" : "var(--text-main)",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart Row */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "2rem", flexWrap: "wrap", maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "0.3rem 0.75rem", height: "46px" }}>
                <button className="qty-btn" style={{ background: "transparent", border: "none", width: "28px", height: "28px", fontSize: "1.1rem", cursor: "pointer", color: "var(--text-main)" }} onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                <span className="qty-val" style={{ minWidth: "24px", textAlign: "center", fontSize: "1.1rem", fontWeight: 600 }}>{qty}</span>
                <button className="qty-btn" style={{ background: "transparent", border: "none", width: "28px", height: "28px", fontSize: "1.1rem", cursor: "pointer", color: "var(--text-main)" }} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              
              <button 
                className="cart-checkout-btn" 
                onClick={handleAdd}
                style={{ 
                  marginTop: 0, 
                  height: "46px", 
                  padding: "0 1.75rem", 
                  flex: 1, 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  fontWeight: "700",
                  fontSize: "1rem",
                  letterSpacing: "0.02em",
                  opacity: (product.variants && product.variants.length > 0 && !selectedVariant) ? 0.6 : 1 
                }}
              >
                <span>ADD TO BASKET</span>
                <span>${(currentPrice * qty).toFixed(2)}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
