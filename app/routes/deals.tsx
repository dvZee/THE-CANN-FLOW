import type { Route } from "./+types/deals";
import { useCart, useNotifications } from "../context/CartContext";
import type { Product } from "../data/catalog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Offers & Loyalty | The Cann Flow - Cannabis Deals" },
    { name: "description", content: "Explore exclusive cannabis discounts, Happy Hour specials, loyalty rewards, and Mix & Match weed flower deals." },
    { name: "keywords", content: "cannabis deals, weed discount North York, happy hour weed, mix and match flower, loyalty rewards weed" },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: "https://thecannflow.com/deals" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Offers & Loyalty | The Cann Flow - Cannabis Deals" },
    { property: "og:description", content: "Explore exclusive discounts, Happy Hour specials, loyalty rewards, and Mix & Match flower deals." },
    { property: "og:url", content: "https://thecannflow.com/deals" },
    { property: "og:image", content: "https://thecannflow.com/favicon.svg" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Offers & Loyalty | The Cann Flow" },
    { name: "twitter:description", content: "Get the best weed flower deals, daily happy hour savings, and stackable loyalty discounts." }
  ];
}

export function clientLoader() {
  return {};
}

export default function Deals() {
  const { happyHourActive } = useCart();
  const { showNotification } = useNotifications();

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
        
        {/* Section 1: Mix & Match Info Banner */}
        <section className="glass-panel" style={{ padding: "2.5rem", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1rem", border: "1px solid var(--border-color)", background: "rgba(255,255,255,0.01)" }}>
          <div>
            <span className="slide-tag" style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>Flower Deal</span>
            <h2 style={{ fontSize: "1.75rem", color: "var(--text-main)", fontWeight: 800, marginTop: "0.5rem", marginBottom: "0.5rem" }}>1. MIX & MATCH FLOWER DEALS</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Choose multiple strains and customize your order. More choice, more control. You can mix and match different strains to create your perfect package.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "8px" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1rem" }}>14g Half-Ounce Deal</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  Choose up to 2 different strains (7g per strain).
                </p>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary)", marginTop: "0.75rem", fontFamily: "var(--font-heading)" }}>60.00</div>
              </div>
              
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "8px" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "1rem" }}>28g Ounce Deal</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  Choose up to 4 different strains (7g per strain).
                </p>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary)", marginTop: "0.75rem", fontFamily: "var(--font-heading)" }}>110.00</div>
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
              Spend and save on your next order! The more you spend, the more you save. Earn stacking discount rewards to be applied on your next purchase.
            </p>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 50</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>5 OFF NEXT ORDER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 100</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>10 OFF NEXT ORDER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 150</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>15 OFF NEXT ORDER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 200</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>20 OFF NEXT ORDER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 250</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>25 OFF NEXT ORDER</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>Spend 300</span>
                <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>30 OFF NEXT ORDER</span>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem", textAlign: "center" }}>
              Discount scales indefinitely (+5 off on next order for every additional 50 spent).
            </p>
          </section>

          {/* Happy Hour & Referral Program */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Happy Hour Panel */}
            <section className="glass-panel" style={{ padding: "2rem", flexGrow: 1 }}>
              <span className="slide-tag" style={{ border: "1px solid var(--color-accent-gold)", color: "var(--color-accent-gold)" }}>Save daily</span>
              <h2 style={{ fontSize: "1.5rem", color: "var(--text-main)", fontWeight: 700, marginTop: "0.5rem", marginBottom: "0.75rem" }}>HAPPY HOUR</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                Order during happy hour and save 10 on your order!
                Active daily from 15:00 to 17:00 (3 PM - 5 PM) Eastern Standard Time.
              </p>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Current Status:</span>
                <span className={`badge-status ${happyHourActive ? "open" : "closed"}`} style={{ borderColor: happyHourActive ? "var(--color-primary)" : "var(--color-danger)" }}>
                  {happyHourActive ? "ACTIVE (10 OFF)" : "INACTIVE"}
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
