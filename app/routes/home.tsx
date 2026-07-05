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
    { title: "Menu | The Cann Flow - Delivery North York & GTA" },
    { name: "description", content: "Discreet same-day delivery in North York & GTA. Flowers, pre-rolls, vapes, and topicals." },
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
      title: "Mix & Match Flower Deals",
      description: "Choose multiple strains and customize your order. More choice. More control.",
      link: "/deals",
      buttonText: "Explore",
      image: "/slider/mix_match.png"
    },
    {
      id: 1,
      tag: "Happy Hour",
      title: "Daily 15:00 - 17:00",
      description: "Order during happy hour and save 10 off your order. Instant discount applied automatically at checkout.",
      link: "/deals",
      buttonText: "SEE OFFERS",
      image: "/slider/happy_hour.png"
    },
    {
      id: 2,
      tag: "Loyalty Program",
      title: "Spend More, Save More",
      description: "Instant discounts on your order: 5 off every 50 spent. Start stacking your savings today.",
      link: "/deals",
      buttonText: "LOYALTY TIERS",
      image: "/slider/loyalty.png"
    },
    {
      id: 3,
      tag: "FAST & DISCREET",
      title: "Premium Delivery to Your Door",
      description: "Serving North York and GTA. Free delivery on qualifying orders.",
      link: "/contact",
      buttonText: "CHECK DELIVERY AREA",
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
  const saleProducts = filteredProducts.filter((p) => p.originalPrice && p.originalPrice > p.price);

  // Group by categories
  const categories = ["Hybrid", "Indica", "Sativa", "Pre-rolls", "Vapes", "Topicals", "Edibles", "Concentrates"];

  const quickCategories = [
    { 
      id: "featured", 
      name: "Featured",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.198-.39.76-.39.958 0l2.259 4.45 4.903.704c.44.063.618.604.3.92l-3.555 3.47 1.021 4.883c.092.438-.39.788-.776.57l-4.39-2.284-4.39 2.284c-.387.218-.868-.132-.776-.57l1.021-4.883-3.556-3.47c-.318-.316-.14-.857.3-.92l4.897-.704 2.26-4.45z" />
        </svg>
      )
    },
    { 
      id: "sale", 
      name: "Sale",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.504 11.624L7.5 9.617m0 0l-2.004 2.007M7.5 9.617V17.5m5.339-12.793A1.992 1.992 0 0011.661 4H8.339a1.992 1.992 0 00-1.178.707L2.457 9.877c-.608.61-.608 1.6 0 2.21l5.339 5.34c.607.608 1.599.608 2.207 0l5.339-5.34a1.992 1.992 0 00.707-1.178V7.545a1.992 1.992 0 00-.707-1.178l-2.998-3.16z" />
        </svg>
      )
    },
    { 
      id: "hybrid", 
      name: "Hybrid",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3c-1.5 1.5-4 4-4 8s2.5 7 4 10M12 3c1.5 1.5 4 4 4 8s-2.5 7-4 10M6 12c1.5-1 3.5-1 5-1M18 12c-1.5-1-3.5-1-5-1" />
        </svg>
      )
    },
    { 
      id: "indica", 
      name: "Indica",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 5c-3 1-5 4-5 8s2 6 5 8M12 5c3 1 5 4 5 8s-2 6-5 8M4 14c2-1 5-1 8-1M20 14c-2-1-5-1-8-1" />
        </svg>
      )
    },
    { 
      id: "sativa", 
      name: "Sativa",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 4c-1.5 2-2.5 5-2.5 9s1 6 2.5 8M12 4c1.5 2 2.5 5 2.5 9s-1 6-2.5 8M8 12c1 0 2.5-.5 4-.5M16 12c-1 0-2.5-.5-4-.5" />
        </svg>
      )
    },
    { 
      id: "pre-rolls", 
      name: "Pre-rolls",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 18L18 4m-2 14l4-4M5 13l6 6M3 21l3-3" />
        </svg>
      )
    },
    { 
      id: "vapes", 
      name: "Vapes",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 22h6M12 2v4M10 6h4v12a2 2 0 01-2 2h0a2 2 0 01-2-2V6z" />
        </svg>
      )
    },
    { 
      id: "topicals", 
      name: "Topicals",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10M7 8h10M6 8a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8z" />
        </svg>
      )
    },
    { 
      id: "edibles", 
      name: "Edibles",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 10h.01M15 10h.01M9 15a3.5 3.5 0 006 0" />
        </svg>
      )
    },
    { 
      id: "concentrates", 
      name: "Concentrates",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5c0-3.464 3.062-6.422 7.5-10.5 4.438 4.078 7.5 7.036 7.5 10.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a2 2 0 00-2 2" />
        </svg>
      )
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const checkCategoryHasProducts = (id: string) => {
    if (id === "featured") return featuredProducts.length > 0;
    if (id === "sale") return saleProducts.length > 0;
    return filteredProducts.some(p => p.category.toLowerCase() === id.toLowerCase());
  };

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

      {/* Quick Category Selector */}
      <div className="quick-category-bar">
        {quickCategories.map((cat) => {
          const hasProducts = checkCategoryHasProducts(cat.id);
          if (!hasProducts) return null;

          return (
            <button
              key={cat.id}
              className="quick-category-card"
              onClick={() => scrollToSection(cat.id)}
            >
              <div className="quick-category-card-icon">
                {cat.icon}
              </div>
              <span className="quick-category-card-name">{cat.name}</span>
            </button>
          );
        })}
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
                <p className="slide-desc" style={{ marginBottom: (slide.id === 3 || slide.id === 0) ? "1rem" : "2rem" }}>{slide.description}</p>
                
                {slide.id === 0 && (
                  <div className="slide-features-grid">
                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Half-Ounce Bundle</div>
                        <div className="slide-feature-subtitle">14g for 60.00</div>
                      </div>
                    </div>
                    
                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Ounce Bundle</div>
                        <div className="slide-feature-subtitle">28g for 110.00</div>
                      </div>
                    </div>

                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.25" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Mix & Match</div>
                        <div className="slide-feature-subtitle">Select any strains</div>
                      </div>
                    </div>

                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Instant Savings</div>
                        <div className="slide-feature-subtitle">Save up to 40%</div>
                      </div>
                    </div>
                  </div>
                )}

                {slide.id === 3 && (
                  <div className="slide-features-grid">
                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v-4h3l3.293 3.293a1 1 0 01.171.344l.536 2.144a1 1 0 01-.97 1.242H13" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Fast Delivery</div>
                        <div className="slide-feature-subtitle">Same day service</div>
                      </div>
                    </div>
                    
                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Free Delivery</div>
                        <div className="slide-feature-subtitle">On qualifying orders</div>
                      </div>
                    </div>

                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">Discreet</div>
                        <div className="slide-feature-subtitle">Plain packaging</div>
                      </div>
                    </div>

                    <div className="slide-feature-item">
                      <div className="slide-feature-icon">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <div className="slide-feature-title">19+ Verified</div>
                        <div className="slide-feature-subtitle">Age verification</div>
                      </div>
                    </div>
                  </div>
                )}

                <NavLink to={slide.link}>
                  <button className="slide-btn" style={{ marginTop: (slide.id === 3 || slide.id === 0) ? "1.25rem" : "0" }}>
                    {(slide.id === 3 || slide.id === 0) && (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: "8px", verticalAlign: "middle", display: "inline-block" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v-4h3l3.293 3.293a1 1 0 01.171.344l.536 2.144a1 1 0 01-.97 1.242H13" />
                      </svg>
                    )}
                    {slide.buttonText}
                  </button>
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
        <div id="featured">
          <CategoryScroll title="Featured Products">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CategoryScroll>
        </div>
      )}

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <div id="sale">
          <CategoryScroll title="Sale">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CategoryScroll>
        </div>
      )}

      {/* Product categories lists (horizontal scrolls) */}
      {categories.map((category) => {
        const categoryProducts = filteredProducts.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );

        if (categoryProducts.length === 0) return null;

        return (
          <div key={category} id={category.toLowerCase()}>
            <CategoryScroll title={category}>
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </CategoryScroll>
          </div>
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
