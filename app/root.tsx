import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "react-router";
import { useState, useEffect } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { INITIAL_PRODUCTS } from "./data/catalog";
import { CartProvider, NotificationProvider, useCart, useNotifications } from "./context/CartContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
  },
];

// Providers & Global Layout wrapper
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </NotificationProvider>
  );
}

function AppContent() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    happyHourActive,
    getCartCalculations,
    updateQuantity,
    removeFromCart,
    referralApplied,
  } = useCart();
  
  const { notifications, dismissNotification, showNotification } = useNotifications();

  const [ageVerified, setAgeVerified] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [nextOpeningTime, setNextOpeningTime] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Seed product catalog in localStorage if empty
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("thecannflow_products");
      if (!stored) {
        localStorage.setItem("thecannflow_products", JSON.stringify(INITIAL_PRODUCTS));
      }
    }
  }, []);

  // Check Age Gate from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const verified = sessionStorage.getItem("thecannflow_age_verified");
      if (verified === "true") {
        setAgeVerified(true);
      }
    }
  }, []);

  // Poll for Business Open Status (Toronto Timezone)
  useEffect(() => {
    const checkTimeStatus = () => {
      const date = new Date();
      
      // Get hour and day in Toronto (Eastern Time)
      const hourStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        hour: "numeric",
        hour12: false,
      }).format(date);
      
      const dayStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        weekday: "long",
      }).format(date);

      const minutesStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        minute: "numeric",
      }).format(date);

      const hour = parseInt(hourStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const decimalTime = hour + minutes / 60;

      // Business Hours check
      let open = false;
      let nextTime = "";

      if (dayStr === "Sunday") {
        if (decimalTime >= 12 && decimalTime < 21) {
          open = true;
        } else if (decimalTime < 12) {
          nextTime = "Today at 12:00";
        } else {
          nextTime = "Monday at 10:00";
        }
      } else if (["Monday", "Tuesday", "Wednesday", "Thursday"].includes(dayStr)) {
        if (decimalTime >= 10 && decimalTime < 21) {
          open = true;
        } else if (decimalTime < 10) {
          nextTime = "Today at 10:00";
        } else {
          nextTime = dayStr === "Thursday" ? "Friday at 10:00" : "Tomorrow at 10:00";
        }
      } else if (["Friday", "Saturday"].includes(dayStr)) {
        if (decimalTime >= 10 && decimalTime < 22) {
          open = true;
        } else if (decimalTime < 10) {
          nextTime = "Today at 10:00";
        } else {
          nextTime = dayStr === "Saturday" ? "Sunday at 12:00" : "Tomorrow at 10:00";
        }
      }

      setIsStoreOpen(open);
      setNextOpeningTime(nextTime);
    };

    checkTimeStatus();
    const interval = setInterval(checkTimeStatus, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const cartCalculated = getCartCalculations();
  const cartTotalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Age Gate Handler
  const verifyAge = () => {
    sessionStorage.setItem("thecannflow_age_verified", "true");
    setAgeVerified(true);
    showNotification("Access granted. Welcome to The Cann Flow!", "success");
  };

  const declineAge = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="app-container">
          {/* Age Verification Gate */}
          {!ageVerified && (
            <div className="age-gate-container">
              <div className="age-gate-box">
                <img src="/logo.png" alt="The Cann Flow" style={{ width: "180px", height: "180px", objectFit: "contain", marginBottom: "1rem" }} />
                <h1 className="age-gate-title">19+ AGE VERIFICATION</h1>
                <p className="age-gate-text">
                  You must be 19 years of age or older to enter. We deliver to North York & the GTA same-day.
                </p>
                <div className="age-gate-buttons">
                  <button className="btn-age-verify" onClick={verifyAge}>I AM 19 OR OLDER</button>
                  <button className="btn-age-decline" onClick={declineAge}>EXIT</button>
                </div>
              </div>
            </div>
          )}

          {/* Site Header */}
          <header className="site-header">
            <div className="container-custom nav-wrapper">
              <NavLink to="/" className="logo-link">
                <img src="/logo.png" alt="The Cann Flow Logo" style={{ width: "42px", height: "42px", objectFit: "contain" }} />
                <span>THE CANN FLOW</span>
              </NavLink>

              <ul className="nav-menu">
                <li><NavLink to="/" end className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}>MENU</NavLink></li>
                <li><NavLink to="/deals" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}>OFFERS & LOYALTY</NavLink></li>
                <li>
                  <NavLink to="/delivery" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: '-1px', display: 'inline-block' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1-1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v-4h3l3.293 3.293a1 1 0 01.171.344l.536 2.144a1 1 0 01-.97 1.242H13" />
                    </svg>
                    DELIVERY INFO
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: '-1px', display: 'inline-block' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    CONTACT
                  </NavLink>
                </li>
                <li><NavLink to="/checkout" className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}>CHECKOUT</NavLink></li>
              </ul>

              <div className="nav-actions">
                <span className={`badge-status ${isStoreOpen ? "open" : "closed"} hide-on-mobile`}>
                  {isStoreOpen ? "OPEN NOW" : `CLOSED - OPENS ${nextOpeningTime}`}
                </span>
                <button className="cart-trigger-btn" onClick={() => setIsCartOpen(true)}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <span className="hide-on-mobile">CART</span>
                  {cartTotalItemsCount > 0 && <span className="cart-count-badge">{cartTotalItemsCount}</span>}
                </button>
                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              <div className={`mobile-nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
                <NavLink to="/" end className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>MENU</NavLink>
                <NavLink to="/deals" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>OFFERS & LOYALTY</NavLink>
                <NavLink to="/delivery" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v-4h3l3.293 3.293a1 1 0 01.171.344l.536 2.144a1 1 0 01-.97 1.242H13" />
                  </svg>
                  DELIVERY INFO
                </NavLink>
                <NavLink to="/contact" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  CONTACT
                </NavLink>
                <NavLink to="/checkout" className="mobile-nav-item" onClick={() => setIsMobileMenuOpen(false)}>CHECKOUT</NavLink>
                <div className="mobile-status-badge">
                  <span className={`badge-status ${isStoreOpen ? "open" : "closed"}`}>
                    {isStoreOpen ? "OPEN NOW" : `CLOSED - OPENS ${nextOpeningTime}`}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Happy Hour Status Banner */}
          {happyHourActive && (
            <div className="container-custom">
              <div className="happy-hour-panel">
                <div className="hh-left">
                  <div className="hh-icon">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="hh-text">
                    <h3>HAPPY HOUR ACTIVE!</h3>
                    <p>Get 10 off all orders from 3 PM to 5 PM daily. Applied automatically in your cart.</p>
                  </div>
                </div>
                <div className="hh-timer">10 OFF ACTIVE</div>
              </div>
            </div>
          )}

          {/* Main App Content Outlet */}
          <main className="main-content">
            <Outlet />
          </main>

          {/* Slide-out Cart Drawer */}
          <div className={`cart-drawer-overlay ${isCartOpen ? "active" : ""}`} onClick={() => setIsCartOpen(false)} />
          <div className={`cart-drawer ${isCartOpen ? "active" : ""}`}>
            <div className="cart-header">
              <div className="cart-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>YOUR BASKET</span>
              </div>
              <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
            </div>

            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="cart-empty-state">
                  <svg className="cart-empty-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                  </svg>
                  <p>Your shopping cart is empty.</p>
                  <button className="btn-age-verify" style={{ width: "auto", padding: "0.6rem 1.5rem" }} onClick={() => setIsCartOpen(false)}>START SHOPPING</button>
                </div>
              ) : (
                cart.map((item, idx) => {
                  let priceFactor = 1;
                  if (item.selectedWeight === "14g") priceFactor = 1.8;
                  if (item.selectedWeight === "28g") priceFactor = 3.2;
                  if (item.selectedWeight === "3.5g") priceFactor = 0.55;
                  
                  const itemPrice = Number((item.product.price * priceFactor).toFixed(2));
                  const itemTotal = Number((itemPrice * item.quantity).toFixed(2));

                  return (
                    <div key={`${item.product.id}-${item.selectedWeight}-${idx}`} className="cart-item">
                      <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                      <div className="cart-item-details">
                        <div className="cart-item-name">{item.product.name}</div>
                        <div className="cart-item-meta">
                          {item.product.brand} &bull; {item.selectedWeight}
                        </div>
                        <div className="cart-item-qty-row">
                          <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}>-</button>
                          <span className="qty-val">{item.quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <div className="cart-item-price-box">
                        <div className="cart-item-price">{itemTotal.toFixed(2)}</div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.product.id, item.selectedWeight)}>Remove</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{cartCalculated.subtotal.toFixed(2)}</span>
                </div>
                {happyHourActive && (
                  <div className="summary-row discount">
                    <span>Happy Hour 10 Off</span>
                    <span>-{cartCalculated.happyHourDiscount.toFixed(2)}</span>
                  </div>
                )}
                {cartCalculated.loyaltyDiscount > 0 && (
                  <div className="summary-row discount">
                    <span>Loyalty Savings</span>
                    <span>-{cartCalculated.loyaltyDiscount.toFixed(2)}</span>
                  </div>
                )}
                {referralApplied && (
                  <div className="summary-row discount">
                    <span>Referral Discount</span>
                    <span>-{cartCalculated.referralDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{cartCalculated.total.toFixed(2)}</span>
                </div>
                
                <NavLink to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <button className="cart-checkout-btn">
                    <span>PROCEED TO CHECKOUT</span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Toast Notifications */}
          <div className="notification-container">
            {notifications.map((n) => (
              <div key={n.id} className={`notification-toast ${n.type}`}>
                <span>{n.message}</span>
                <button className="notification-close" onClick={() => dismissNotification(n.id)}>&times;</button>
              </div>
            ))}
          </div>

          {/* Footer Section */}
          <footer style={{ background: "var(--bg-surface-hover)", borderTop: "1px solid var(--border-color)", padding: "2rem 0", marginTop: "auto" }}>
            <div className="container-custom" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              <span>&copy; {new Date().getFullYear()} thecannflow.com</span>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <a 
                  href="#top" 
                  aria-label="Back to Top"
                  style={{ 
                    color: "var(--text-muted)", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    background: "var(--bg-input)", 
                    border: "1px solid var(--border-color)", 
                    width: "36px", 
                    height: "36px", 
                    borderRadius: "50%", 
                    transition: "var(--transition-fast)" 
                  }}
                  className="back-to-top-btn"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </footer>

          {showBackToTop && (
            <a 
              href="#top" 
              aria-label="Back to Top"
              style={{ 
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 99,
                color: "var(--text-main)", 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center", 
                background: "var(--bg-surface)", 
                border: "1px solid var(--border-color)", 
                width: "44px", 
                height: "44px", 
                borderRadius: "50%", 
                boxShadow: "var(--shadow-lg)",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              className="back-to-top-sticky"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
              </svg>
            </a>
          )}
        </div>
      );
}

// React Router Layout ErrorBoundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Not Found" : "Error";
    details =
      error.status === 404
        ? "The page you are looking for does not exist on The Cann Flow."
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ padding: "4rem 2rem", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "3rem", color: "var(--color-danger)", marginBottom: "1rem" }}>{message}</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>{details}</p>
      <a href="/" style={{ background: "var(--color-primary)", color: "var(--text-dark)", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "700" }}>Return Home</a>
      {stack && (
        <pre style={{ textAlign: "left", background: "#111", padding: "1rem", marginTop: "2rem", overflowX: "auto", borderRadius: "4px", fontSize: "0.8rem" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
