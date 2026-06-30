import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { CategoryScroll } from "../components/CategoryScroll";
import type { Product } from "../data/catalog";
import { NavLink, useLoaderData } from "react-router";
import { getProducts } from "../data/db.client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Menu | The Cann Flow - Cannabis Delivery North York & GTA" },
    { name: "description", content: "Order cannabis online with same-day discreet delivery in North York & GTA. Flowers, pre-rolls, vapes, and topicals. No dollar sign pricing." },
  ];
}

export function clientLoader() {
  const products = getProducts();
  return { products };
}

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  image: string;
}

export default function Home() {
  const { products } = useLoaderData<typeof clientLoader>();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);


  // Promo Slider slides data
  const slides: Slide[] = [
    {
      id: 0,
      tag: "Mix & Match Deal",
      title: "Customize Your Flow",
      description: "Choose multiple strains and create your perfect package. Get up to 4 different strains at an exclusive discount.",
      link: "/deals",
      buttonText: "BUILD YOUR DEAL",
      image: "/slider/mix_match.png"
    },
    {
      id: 1,
      tag: "Happy Hour",
      title: "Daily 15:00 - 17:00",
      description: "Order during happy hour and save 10% off all products. Instant discount applied automatically at checkout.",
      link: "/deals",
      buttonText: "SEE OFFERS",
      image: "/slider/happy_hour.png"
    },
    {
      id: 2,
      tag: "Loyalty Program",
      title: "Spend More, Save More",
      description: "Instant discounts on your order: 5 off every 50 spent. No points, no wait time. Start stacking your savings today.",
      link: "/deals",
      buttonText: "LOYALTY TIERS",
      image: "/slider/loyalty.png"
    },
    {
      id: 3,
      tag: "Same-Day Delivery",
      title: "North York & GTA Delivery",
      description: "North York: free delivery above 50. GTA: free delivery above 60. Fast, discreet same-day premium delivery right to your door.",
      link: "/contact",
      buttonText: "COVERAGE MAP",
      image: "/slider/delivery.png"
    }
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Filter products by query
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredProducts = filteredProducts.filter((p) => p.isFeatured);

  // Group by categories
  const categories = ["Hybrid", "Indica", "Sativa", "Pre-rolls", "Vapes", "Topicals"];

  return (
    <div className="container-custom" style={{ marginTop: "1rem" }}>
      
      {/* Search Bar */}
      <div style={{ margin: "1.5rem 0", display: "flex", gap: "1rem", position: "relative" }}>
        <input
          type="text"
          placeholder="Search strains, pre-rolls, vapes..."
          className="form-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: "3rem",
            fontSize: "1.05rem",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
          }}
        />
        <svg
          style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)",
            width: "20px",
            height: "20px",
            pointerEvents: "none"
          }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Promo Banner Carousel / Slider */}
      {searchQuery === "" && (
        <div className="hero-slider-container">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`hero-slide ${idx === activeSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <span className="slide-tag">{slide.tag}</span>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-desc">{slide.description}</p>
                <NavLink to={slide.link}>
                  <button className="slide-btn">{slide.buttonText}</button>
                </NavLink>
              </div>
            </div>
          ))}
          <div className="slider-dots">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`slider-dot ${idx === activeSlide ? "active" : ""}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <CategoryScroll title="Featured Products">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CategoryScroll>
      )}

      {/* Product categories lists (horizontal scrolls) */}
      {categories.map((category) => {
        const categoryProducts = filteredProducts.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );

        if (categoryProducts.length === 0) return null;

        return (
          <CategoryScroll key={category} title={category}>
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CategoryScroll>
        );
      })}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
          <svg style={{ width: "64px", height: "64px", opacity: 0.4, marginBottom: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h2 style={{ color: "var(--text-main)", marginBottom: "0.5rem" }}>No Products Found</h2>
          <p>We couldn't find any products matching your search term "{searchQuery}". Try something else.</p>
        </div>
      )}
    </div>
  );
}
