import { useState, useEffect } from "react";
import type { Route } from "./+types/delivery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delivery Info | The Cann Flow - Cannabis Delivery Zones" },
    { name: "description", content: "Check weed delivery minimums, coverage zones in North York & GTA, and flat mailing fees across Canada." },
    { name: "keywords", content: "weed delivery zones, North York delivery fee, GTA cannabis delivery minimum, mail order weed Canada" },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: "https://thecannflow.com/delivery" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Delivery Info | The Cann Flow - Cannabis Delivery Zones" },
    { property: "og:description", content: "Check weed delivery minimums, coverage zones in North York & GTA, and flat mailing fees across Canada." },
    { property: "og:url", content: "https://thecannflow.com/delivery" },
    { property: "og:image", content: "https://thecannflow.com/favicon.svg" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Delivery Coverage & Rates | The Cann Flow" },
    { name: "twitter:description", content: "Verify delivery zones, minimum order requirements for free delivery, and mail order details." }
  ];
}

export default function Delivery() {
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openingStatusText, setOpeningStatusText] = useState("");

  // Check current time status in Toronto
  useEffect(() => {
    const updateTimeStatus = () => {
      const date = new Date();
      
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
    const timer = setInterval(updateTimeStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "var(--color-primary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011-1v-4h3l3.293 3.293a1 1 0 01.171.344l.536 2.144a1 1 0 01-.97 1.242H13" />
          </svg>
          DELIVERY INFO
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>Check our delivery coverage zones, rates, minimum order requirements, and mailing policies.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Side: Coverage & Rates */}
        <section className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem" }}>Coverage delivery area</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            We offer discreet, premium delivery to North York & gta
          </p>

          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="badge-status open" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>North York</span>
              <span className="badge-status open" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>GTA</span>
            </div>

            <div style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem" }}>
              <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>North York</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Minimum order 50 for free delivery. Under minimum: 5–10 delivery fee.
              </p>
            </div>

            <div style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: "1rem" }}>
              <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>GTA</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Minimum order 60 for free delivery. Under minimum: 5-20 delivery fee.
              </p>
            </div>

            <div style={{ borderLeft: "3px solid var(--color-secondary)", paddingLeft: "1rem" }}>
              <h4 style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.95rem" }}>Mail delivery</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Mail delivery available with in Canada + delivery fee
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Store Status & Operating Hours */}
        <section className="glass-panel" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>STORE STATUS & HOURS</h2>
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

      </div>
    </div>
  );
}
