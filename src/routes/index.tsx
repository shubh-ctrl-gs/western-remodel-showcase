import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoUrl from "@/assets/wmfr-logo.svg";
import droneAerial from "@/assets/drone-aerial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Western Multi-Family Remodel | Fast-Track CAPEX Renovations",
      },
      {
        name: "description",
        content:
          "Western Multi-Family Remodel fast-tracks comprehensive CAPEX interior remodels on large, occupied multi-family communities — up to 1,200+ units.",
      },
      { property: "og:title", content: "Western Multi-Family Remodel" },
      {
        property: "og:description",
        content:
          "Fast-track occupied multi-family interior remodels at scale — 1,151 units delivered for AvalonBay Communities at AVA Toluca Hills.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: droneAerial },
      { name: "twitter:title", content: "Western Multi-Family Remodel" },
      {
        name: "twitter:description",
        content:
          "Fast-track occupied multi-family interior remodels at scale — 1,151 units delivered at AVA Toluca Hills.",
      },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "Home", href: "#home", active: true },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services", badge: "NEW: Custom Remodel" },
  { label: "Our Process", href: "#process" },
  { label: "Portfolio / Case Studies", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

function Index() {
  const overlayRef = useRef<HTMLImageElement>(null);
  const headerLogoRef = useRef<HTMLImageElement>(null);
  const [introDone, setIntroDone] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  useEffect(() => {
    const el = overlayRef.current;
    const target = headerLogoRef.current;
    if (!el || !target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroDone(true);
      setOverlayGone(true);
      return;
    }

    let cancelled = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      if (cancelled) return;
      const r = target.getBoundingClientRect();
      const w = r.width || el.offsetWidth;
      const h = r.height || el.offsetHeight;
      const scale = 2.2;
      const startX = window.innerWidth / 2 - (w * scale) / 2;
      const startY = window.innerHeight / 2 - (h * scale) / 2;

      const anim = el.animate(
        [
          {
            transform: `translate3d(${startX}px, ${startY}px, 0) scale(${scale})`,
            opacity: 0.3,
            filter: "drop-shadow(0 0 0 rgba(245,158,11,0))",
            offset: 0,
          },
          {
            transform: `translate3d(${startX}px, ${startY}px, 0) scale(${scale})`,
            opacity: 1,
            filter:
              "drop-shadow(4px 4px 0px rgba(245,158,11,0.9)) drop-shadow(8px 8px 14px rgba(0,0,0,0.35))",
            offset: 0.42,
          },
          {
            transform: `translate3d(${startX}px, ${startY}px, 0) scale(${scale})`,
            opacity: 1,
            filter: "drop-shadow(0 0 0 rgba(245,158,11,0))",
            offset: 0.58,
          },
          {
            transform: `translate3d(${r.left}px, ${r.top}px, 0) scale(1)`,
            opacity: 1,
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.10))",
            offset: 1,
          },
        ],
        {
          duration: 2200,
          easing: "cubic-bezier(0.65, 0, 0.2, 1)",
          fill: "forwards",
        },
      );

      anim.finished
        .then(() => {
          if (cancelled) return;
          try {
            anim.commitStyles();
            anim.cancel();
          } catch {
            /* noop */
          }
          setIntroDone(true);
          // let the revealed header logo take over, then fade the overlay out
          requestAnimationFrame(() => {
            el.style.opacity = "0";
          });
          hideTimer = setTimeout(() => setOverlayGone(true), 700);
        })
        .catch(() => {});
    };

    // wait for layout + fonts/image so the measured target is final
    const raf = requestAnimationFrame(() => requestAnimationFrame(run));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Logo intro overlay (runs once on load, then hidden) */}
      {!overlayGone && (
        <img
          ref={overlayRef}
          src={logoUrl}
          alt=""
          aria-hidden
          className={`logo-intro ${introDone ? "logo-intro-fade" : ""}`}
        />
      )}

      <div className={introDone ? "wmfr-reveal" : "wmfr-reveal-hidden"}>
        {/* 1. Utility Bar */}
        <div className="utility-bar h-9 w-full">
          <div className="section-shell flex h-full items-center justify-end gap-6">
            <span className="inline-flex items-center gap-1.5">
              <PhoneIcon className="h-3.5 w-3.5 text-amber" />
              (714) 920-9947
            </span>
            <span className="opacity-40" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BuildingIcon className="h-3.5 w-3.5 text-amber" />
              Office: (714) 299-9722
            </span>
          </div>
        </div>

        {/* 2. Sticky Header */}
        <header className="site-header sticky top-0 z-50 h-20 w-full">
          <div className="section-shell flex h-full items-center justify-between">
            {/* Logo container */}
            <a
              href="#home"
              className="flex items-center"
              aria-label="Western Multi-Family Remodel home"
            >
              <img
                ref={headerLogoRef}
                src={logoUrl}
                alt="Western Multi-Family Remodel"
                className="h-[3.75rem] w-auto"
                style={{ maxWidth: "none" }}
              />
            </a>

            {/* Nav + CTA */}
            <nav className="flex items-center gap-7" aria-label="Primary">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link inline-flex items-center"
                  data-active={item.active ? "true" : undefined}
                >
                  {item.label}
                  {item.badge ? <span className="new-pill">{item.badge}</span> : null}
                </a>
              ))}
              <a href="#contact" className="cta-quote ml-2 inline-flex items-center gap-2">
                Request a Quote
                <ArrowIcon className="h-4 w-4" />
              </a>
            </nav>
          </div>
        </header>

        {/* 3. Hero Intro Section */}
        <section id="home" className="bg-background">
          <div className="section-shell py-16">
            <p className="eyebrow mb-5">AvalonBay Communities · AVA Toluca Hills</p>
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-8">
                <h1 className="hero-h1">
                  <span className="upper">WMFR</span> has set the standard for our ability to{" "}
                  <span className="accent-word">Fast-Track</span> comprehensive CAPEX interior
                  remodel on Large, up to <span className="accent-word">1200+ unit</span>,
                  multi-family projects, <span className="accent-word">WHILE OCCUPIED.</span>
                </h1>
              </div>
              <div className="col-span-4 flex flex-col justify-center">
                <div className="highlight-box p-6">
                  <p className="text-sm leading-relaxed">
                    Completing <span className="stat text-2xl">3 units</span> PER Trade Per Day, we
                    reduced the original projected length of the project by{" "}
                    <span className="stat text-2xl">1 year & 4 months.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Body block */}
            <div className="mt-12 grid grid-cols-12 gap-10 border-t border-border pt-10">
              <div className="col-span-8">
                <p className="body-copy">
                  In partnership with <strong>AvalonBay Communities</strong>, Western Multi-Family
                  Remodel took on the full interior renovation of <strong>AVA Toluca Hills</strong>{" "}
                  — a 1,200+ unit garden-style community in the heart of Los Angeles. The scope
                  spanned every unit interior: full kitchen and bath rebuilds, flooring, millwork,
                  paint, and fixtures — executed entirely{" "}
                  <strong>while the community remained occupied</strong>.
                </p>
                <p className="body-copy mt-5">
                  Our self-performing trade crews, sequenced logistics, and same-unit daily turnover
                  model let us complete <strong>3 units per trade per day</strong> — compressing a
                  schedule originally projected at nearly three years into{" "}
                  <strong>under 19 months</strong>. The result: 1,151 units delivered to spec, on
                  time, with zero displaced residents.
                </p>
              </div>
              <div className="col-span-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatTile value="1,151" label="Units Completed" />
                  <StatTile value="3" label="Units / Trade / Day" />
                  <StatTile value="1 yr 4 mo" label="Schedule Reduced" />
                  <StatTile value="0" label="Residents Displaced" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Aerial Drone Site Map */}
        <section id="portfolio" className="drone-section h-[600px] w-full">
          {/* orthomosaic image */}
          <img
            src={droneAerial}
            alt="Aerial drone orthomosaic site map of the AVA Toluca Hills multi-family community"
            className="drone-img absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={768}
          />
          {/* overlays */}
          <div className="drone-grid absolute inset-0 opacity-60" aria-hidden />
          <div className="drone-vignette absolute inset-0" aria-hidden />

          {/* Floating glass badge — top center */}
          <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2">
            <div className="glass-badge px-7 py-4 text-center">
              <div className="glass-label">Total Units Completed</div>
              <div className="glass-number text-4xl mt-1">1,151</div>
            </div>
          </div>

          {/* Bottom-right CTA */}
          <div className="absolute bottom-7 right-7 z-10">
            <a
              href="#case-study"
              className="drone-cta inline-flex items-center gap-2 px-6 py-3.5 text-sm"
            >
              Explore Full Toluca Hills Case Study
              <ArrowIcon className="h-4 w-4" />
            </a>
          </div>

          {/* corner label */}
          <div className="absolute left-7 bottom-7 z-10 text-white/70">
            <div className="eyebrow text-[0.62rem] text-amber-soft">Orthomosaic Site Survey</div>
            <div className="font-display text-sm font-semibold text-white/90 mt-1">
              AVA Toluca Hills · Los Angeles, CA
            </div>
          </div>
        </section>

        {/* spacer for sticky nav anchors */}
        <div id="case-study" className="h-24" />
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="font-display text-2xl font-extrabold text-navy">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="2" width="16" height="20" rx="1.5" />
      <path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
