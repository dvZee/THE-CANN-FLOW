import { useRef, useState, useEffect } from "react";

interface CategoryScrollProps {
  title: string;
  children: React.ReactNode;
}

export function CategoryScroll({ title, children }: CategoryScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollBounds = () => {
    const el = scrollRef.current;
    if (el) {
      // Allow slight decimal rounding tolerance
      const tolerance = 2;
      setCanScrollLeft(el.scrollLeft > tolerance);
      setCanScrollRight(
        el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance
      );
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollBounds();
      // Handle resize and content updates
      window.addEventListener("resize", checkScrollBounds);
      
      // Create a MutationObserver to watch child nodes loading/mounting
      const observer = new MutationObserver(checkScrollBounds);
      observer.observe(el, { childList: true, subtree: true });

      return () => {
        window.removeEventListener("resize", checkScrollBounds);
        observer.disconnect();
      };
    }
  }, [children]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (el) {
      // Scroll by width of 2 cards (approx 280px + 20px gap each = 600px)
      const scrollAmount = direction === "left" ? -580 : 580;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="category-section">
      <div className="category-header">
        <h2 className="category-title">{title}</h2>
        <div className="scroll-controls">
          <button
            className="scroll-btn"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            className="scroll-btn"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        className="horizontal-scroll-container"
        ref={scrollRef}
        onScroll={checkScrollBounds}
      >
        {children}
      </div>
    </div>
  );
}
