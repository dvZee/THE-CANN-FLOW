import { useState } from "react";
import type { Product } from "../data/catalog";
import { useCart, useNotifications } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { showNotification } = useNotifications();
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const getWeightFactor = (weight: string) => {
    switch (weight) {
      case "3.5g": return 0.55;
      case "7g": return 1.0;
      case "14g": return 1.8;
      case "28g": return 3.2;
      case "0.5g": return 0.6;
      case "1g": return 1.0;
      default: return 1.0;
    }
  };

  const factor = getWeightFactor(selectedWeight);
  const currentPrice = Number((product.price * factor).toFixed(2));
  const originalPrice = product.originalPrice ? Number((product.originalPrice * factor).toFixed(2)) : undefined;
  
  // Calculate discount percentage if original price is present
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const handleWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setSelectedWeight(e.target.value);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setIsDetailOpen(true);
      setQty(1);
      showNotification("Please select a variant/flavor option", "warning");
    } else {
      addToCart(product, 1, selectedWeight, selectedVariant || undefined);
    }
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
    <>
      <div className="product-card" onClick={() => { setIsDetailOpen(true); setQty(1); }}>
        {discountPercent > 0 && (
          <span className="product-badge">{discountPercent}% OFF</span>
        )}
        
        {["indica", "sativa", "hybrid"].includes(product.category.toLowerCase()) && (
          <span className={`product-type-badge ${getCategoryClass(product.category)}`}>
            {product.category}
          </span>
        )}

        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
        </div>

        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>

        <div className="product-meta-row">
          <span className="thc-tag">Total THC {product.thc}</span>
          <div className="product-rating">
            <svg className="star-icon" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{product.rating}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>({product.reviewsCount})</span>
          </div>
        </div>

        <div className="product-purchase-row">
          <div className="product-price-box">
            {originalPrice && (
              <span className="price-original">{originalPrice.toFixed(2)}</span>
            )}
            <span className="price-main">{currentPrice.toFixed(2)}</span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {product.weights && product.weights.length > 0 && (
              <select
                className="weight-selector"
                value={selectedWeight}
                onChange={handleWeightChange}
                onClick={(e) => e.stopPropagation()}
              >
                {product.weights.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            )}
            
            <button 
              className="btn-add-cart" 
              onClick={handleAddToCart}
              title="Add to cart"
              aria-label="Add to cart"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isDetailOpen && (
        <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="modal-content product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsDetailOpen(false)} aria-label="Close modal">&times;</button>
            
            <div className="product-detail-grid">
              <div className="product-detail-img-wrapper">
                <img src={product.image} alt={product.name} className="product-detail-img" />
              </div>
              
              <div className="product-detail-info">
                <span className="product-detail-brand">{product.brand}</span>
                <h2 className="product-detail-name">{product.name}</h2>
                
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", margin: "0.75rem 0 1.25rem", flexWrap: "wrap" }}>
                  <span className="thc-tag" style={{ background: "rgba(16, 185, 129, 0.08)", color: "var(--color-primary)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>Total THC {product.thc}</span>
                  {product.category && (
                    <span className={`badge-status open`} style={{ textTransform: "capitalize" }}>
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

                <div className="product-detail-price-box">
                  {originalPrice && (
                    <span className="price-original" style={{ fontSize: "1.1rem" }}>{originalPrice.toFixed(2)}</span>
                  )}
                  <span className="price-main" style={{ fontSize: "2rem" }}>{currentPrice.toFixed(2)}</span>
                </div>

                <div className="product-detail-desc-title">Description</div>
                <p className="product-detail-desc">{product.description || "No description available for this product."}</p>

                {/* Variant / Option Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div style={{ margin: "1rem 0" }}>
                    <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", display: "block", textTransform: "uppercase" }}>
                      Select Option / Flavor *
                    </label>
                    <select
                      className="form-select"
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-main)",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        cursor: "pointer"
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
                  <div style={{ margin: "1rem 0 1.5rem" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase" }}>Select Weight</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {product.weights.map((w) => (
                        <button
                          key={w}
                          className={`qty-btn ${selectedWeight === w ? "active" : ""}`}
                          onClick={() => setSelectedWeight(w)}
                          style={{
                            width: "auto",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-sm)",
                            background: selectedWeight === w ? "var(--color-primary-light)" : "var(--bg-surface)",
                            borderColor: selectedWeight === w ? "var(--color-primary)" : "var(--border-color)",
                            color: selectedWeight === w ? "var(--color-primary)" : "var(--text-main)",
                            fontWeight: 600
                          }}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-input)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", padding: "0.25rem 0.5rem", height: "42px" }}>
                    <button className="qty-btn" style={{ background: "transparent", border: "none", width: "24px", height: "24px" }} onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                    <span className="qty-val" style={{ minWidth: "20px", textAlign: "center", fontSize: "1rem" }}>{qty}</span>
                    <button className="qty-btn" style={{ background: "transparent", border: "none", width: "24px", height: "24px" }} onClick={() => setQty(q => q + 1)}>+</button>
                  </div>
                  
                  <button 
                    className="cart-checkout-btn" 
                    onClick={() => {
                      if (product.variants && product.variants.length > 0 && !selectedVariant) {
                        showNotification("Please select an option/flavor first", "error");
                        return;
                      }
                      addToCart(product, qty, selectedWeight, selectedVariant || undefined);
                      setIsDetailOpen(false);
                    }}
                    style={{ marginTop: 0, height: "42px", padding: "0 1.5rem", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", opacity: (product.variants && product.variants.length > 0 && !selectedVariant) ? 0.6 : 1 }}
                  >
                    <span>ADD TO BASKET</span>
                    <span>${(currentPrice * qty).toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
