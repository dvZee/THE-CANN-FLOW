import { useState } from "react";
import type { Product } from "../data/catalog";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [selectedWeight, setSelectedWeight] = useState(product.weight);

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
    setSelectedWeight(e.target.value);
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedWeight);
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
    <div className="product-card">
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
  );
}
