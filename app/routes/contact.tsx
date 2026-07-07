import { useState, useEffect } from "react";
import type { Route } from "./+types/contact";
import { useNotifications } from "../context/CartContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us | The Cann Flow - Get in Touch" },
    { name: "description", content: "Have questions? Reach out to The Cann Flow team. Call & Text: 416 456 7759. Same-day delivery assistance in GTA." },
    { name: "keywords", content: "contact weed delivery, the cann flow phone, toronto weed delivery phone, mail order support weed" },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: "https://thecannflow.com/contact" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Contact Us | The Cann Flow - Get in Touch" },
    { property: "og:description", content: "Have questions? Reach out to The Cann Flow team. Call & Text: 416 456 7759. Same-day delivery assistance in GTA." },
    { property: "og:url", content: "https://thecannflow.com/contact" },
    { property: "og:image", content: "https://thecannflow.com/favicon.svg" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Contact The Cann Flow" },
    { name: "twitter:description", content: "Call or text us at 416 456 7759 for ordering assistance and prompt customer support." }
  ];
}

export default function Contact() {
  const { showNotification } = useNotifications();
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openingStatusText, setOpeningStatusText] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
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
        if (decimalTime >= 12 && decimalTime < 21) {
          open = true;
          statusText = "We are open until 9 PM (21:00) tonight.";
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
    setContactPhone("");
    setContactMessage("");
  };

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "var(--color-primary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          CONTACT US
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>Call & text, order online directly, or send us a message below.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Side: Contact Information & Hours */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Live Hours Status */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>STORE STATUS</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>{currentTimeStr}</div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-input)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Current Status:</span>
              <span className={`badge-status ${isOpen ? "open" : "closed"}`} style={{ borderColor: isOpen ? "var(--color-primary)" : "var(--color-danger)", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
            {openingStatusText && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                {openingStatusText}
              </p>
            )}

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
                  <td style={{ padding: "0.6rem 0", textAlign: "right" }}>12:00 - 21:00</td>
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
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>CALL & TEXT</span>
                  <a href="tel:+14164567759" style={{ fontWeight: 600, color: "var(--text-main)" }}>416 456 7759</a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ background: "rgba(16,185,129,0.1)", color: "var(--color-primary)", padding: "0.6rem", borderRadius: "8px" }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>ORDER ONLINE</span>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>available on site</span>
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
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>LOCATION</span>
                  <span style={{ fontWeight: 600, color: "var(--text-main)" }}>north York, & gta</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Side: Contact Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Feedback Contact Form */}
          <section className="glass-panel" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>Send Us a Message</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Questions about an order or product? We respond promptly.
            </p>
            
            <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>NAME *</label>
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
                <label className="form-label" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>EMAIL *</label>
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
                <label className="form-label" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>PHONE</label>
                <input
                  type="tel"
                  placeholder="e.g. 416 456 7759"
                  className="form-input"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>MESSAGE *</label>
                <textarea
                  required
                  placeholder="Enter details of your inquiry..."
                  className="form-textarea"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>

              <button type="submit" className="cart-checkout-btn" style={{ padding: "0.8rem", textTransform: "uppercase" }}>
                SEND MESSAGE
              </button>
            </form>
          </section>

        </div>

      </div>
    </div>
  );
}
