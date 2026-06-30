import { useState, useEffect } from "react";
import type { Route } from "./+types/contact";
import { useNotifications } from "../context/CartContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hours & Coverage | The Cann Flow" },
    { name: "description", content: "Check business hours and delivery coverage. We deliver same-day to North York and the Greater Toronto Area (GTA). Phone: +1 (416) 456-7559." },
  ];
}

export default function Contact() {
  const { showNotification } = useNotifications();
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openingStatusText, setOpeningStatusText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Check current time status in Toronto
  useEffect(() => {
    const updateTimeStatus = () => {
      const date = new Date();
      
      // Formatting options for Eastern Time
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const dayFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        weekday: "long",
      });

      const hour24Str = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        hour: "numeric",
        hour12: false,
      }).format(date);

      const minutesStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        minute: "numeric",
      }).format(date);

      const hour = parseInt(hour24Str, 10);
      const minutes = parseInt(minutesStr, 10);
      const decimalTime = hour + minutes / 60;
      
      const day = dayFormatter.format(date);
      setCurrentTimeStr(`${day}, ${timeFormatter.format(date)} (Toronto Time)`);

      // Determine open/closed status
      // Sunday: 12pm-8pm (12.0 - 20.0)
      // Monday-Thursday: 10am-9pm (10.0 - 21.0)
      // Friday-Saturday: 10am-10pm (10.0 - 22.0)
      let open = false;
      let statusText = "";

      if (day === "Sunday") {
        if (decimalTime >= 12 && decimalTime < 20) {
          open = true;
          statusText = "We are open until 8 PM (20:00) tonight.";
        } else if (decimalTime < 12) {
          statusText = "Closed. We open today at 12 PM (12:00).";
        } else {
          statusText = "Closed. We open Monday at 10 AM (10:00).";
        }
      } else if (["Monday", "Tuesday", "Wednesday", "Thursday"].includes(day)) {
        if (decimalTime >= 10 && decimalTime < 21) {
          open = true;
          statusText = "We are open until 9 PM (21:00) tonight.";
        } else if (decimalTime < 10) {
          statusText = "Closed. We open today at 10 AM (10:00).";
        } else {
          statusText = day === "Thursday" ? "Closed. We open Friday at 10 AM (10:00)." : "Closed. We open tomorrow at 10 AM (10:00).";
        }
      } else if (["Friday", "Saturday"].includes(day)) {
        if (decimalTime >= 10 && decimalTime < 22) {
          open = true;
          statusText = "We are open until 10 PM (22:00) tonight.";
        } else if (decimalTime < 10) {
          statusText = "Closed. We open today at 10 AM (10:00).";
        } else {
          statusText = day === "Saturday" ? "Closed. We open Sunday at 12 PM (12:00)." : "Closed. We open tomorrow at 10 AM (10:00).";
        }
      }

      setIsOpen(open);
      setOpeningStatusText(statusText);
    };

    updateTimeStatus();
    const timer = setInterval(updateTimeStatus, 30000); // update every 30s
    return () => clearInterval(timer);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      showNotification("Please fill in all fields.", "error");
      return;
    }
    
    // Simulate sending contact message
    showNotification("Message sent successfully! We will get in touch shortly.");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
  };

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.5rem" }}>CONTACT & COVERAGE</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>Get in touch, view delivery radius guidelines, or check our operating schedules.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Side: Contact Information & Hours */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Live Hours Status */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>STORE STATUS</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>{currentTimeStr}</div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-input)", border: "1px solid var(--border-color)", padding: "1.25rem", borderRadius: "10px", marginBottom: "1rem" }}>
              <span className={`badge-status ${isOpen ? "open" : "closed"}`} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-main)" }}>
                {openingStatusText}
              </span>
            </div>

            <table style={{ width: "100%", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.6rem 0", fontWeight: 600, color: "var(--text-main)" }}>Monday - Thursday</td>
                  <td style={{ padding: "0.6rem 0", textAlign: "right" }}>10:00 - 21:00</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "0.6rem 0", fontWeight: 600, color: "var(--text-main)" }}>Friday - Saturday</td>
                  <td style={{ padding: "0.6rem 0", textAlign: "right" }}>10:00 - 22:00</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.6rem 0", fontWeight: 600, color: "var(--text-main)" }}>Sunday</td>
                  <td style={{ padding: "0.6rem 0", textAlign: "right" }}>12:00 - 20:00</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Quick Contact Info */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1.25rem" }}>GET IN TOUCH</h2>
            
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-primary)", padding: "0.6rem", borderRadius: "8px" }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>PHONE & TEXT</span>
                  <a href="tel:+14164567559" style={{ fontWeight: 600, color: "var(--text-main)" }}>+1 (416) 456-7559</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-primary)", padding: "0.6rem", borderRadius: "8px" }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>EMAIL INQUIRIES</span>
                  <a href="mailto:Happytokenpole@gmail.com" style={{ fontWeight: 600, color: "var(--text-main)" }}>Happytokenpole@gmail.com</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-primary)", padding: "0.6rem", borderRadius: "8px" }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>DELIVERY COVERAGE</span>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>North York & Greater Toronto Area (GTA)</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Side: Delivery Details & Contact Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Delivery Zones */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>DELIVERY SCHEDULING</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              Discreet and premium delivery service to your door. Operating with same-day deliveries across our zones.
            </p>

            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>North York Area</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Minimum order: 50.00 for free delivery.<br />
                  Orders below minimum: 5.00 delivery fee.
                </p>
              </div>

              <div style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>GTA Area (Greater Toronto)</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Minimum order: 60.00 for free delivery.<br />
                  Orders below minimum: 10.00 delivery fee.
                </p>
              </div>

              <div style={{ borderLeft: "3px solid var(--color-secondary)", paddingLeft: "1rem" }}>
                <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>Canada Post Mail Orders</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Canada-wide shipping. Flat mailing fee: 15.00.
                </p>
              </div>
            </div>
          </section>

          {/* Feedback Contact Form */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1.25rem" }}>LEAVE A MESSAGE</h2>
            
            <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Smith"
                  className="form-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane@example.com"
                  className="form-input"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Message</label>
                <textarea
                  required
                  placeholder="Enter details of your inquiry..."
                  className="form-textarea"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="cart-checkout-btn" style={{ padding: "0.8rem" }}>
                SEND MESSAGE
              </button>
            </form>
          </section>

        </div>

      </div>
    </div>
  );
}
