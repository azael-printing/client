import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const navItems = [
  { label: "Home", section: "top", path: "/" },
  { label: "About", section: "about", path: "/" },
  { label: "Services", section: "services", path: "/" },
  { label: "Team", section: "team", path: "/" },
  { label: "Contact", section: "contact", path: "/" },
];

export default function MainNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pastHero, setPastHero] = useState(location.pathname !== "/");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (location.pathname !== "/") {
        setPastHero(true);
        return;
      }
      setPastHero(window.scrollY > 120);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeSection = useMemo(() => {
    if (location.pathname !== "/") return "";
    if (typeof window === "undefined") return "top";

    const ids = ["top", "about", "services", "team", "contact"];
    let current = "top";

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= 140) current = id;
    }

    return current;
  }, [location.pathname, pastHero, open]);

  const goToSection = (section) => {
    setOpen(false);

    if (section === "top") {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 80);
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(section);
        if (!el) return;
        const navOffset = 84;
        const y =
          el.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 80);
      return;
    }

    const el = document.getElementById(section);
    if (!el) return;
    const navOffset = 84;
    const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {!pastHero && location.pathname === "/" && (
        <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
            <div className="pointer-events-auto flex items-center justify-between gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.28)]"
              >
                <div className="h-12 w-12 rounded-2xl bg-white/95 shadow-[0_10px_26px_rgba(15,23,42,0.16)] flex items-center justify-center text-[#1683d7] font-black text-sm">
                  AZ
                </div>
                <div className="hidden sm:block">
                  <div className="text-base font-bold tracking-tight">
                    Azael Printing
                  </div>
                  <div className="text-xs text-white/80">
                    Quality • Branding • Print Solutions
                  </div>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/8 backdrop-blur-md px-3 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
                {navItems.map((item) => {
                  const active = activeSection === item.section;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => goToSection(item.section)}
                      className={`relative rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "bg-white/16 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute left-4 right-4 bottom-1 h-[2px] rounded-full bg-white transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => goToSection("contact")}
                  className="ml-1 inline-flex items-center justify-center rounded-full bg-[#1683d7] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(22,131,215,0.34)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(22,131,215,0.42)]"
                >
                  Get yours
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      {pastHero && (
        <>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="fixed right-4 top-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a1f44] text-white shadow-[0_18px_38px_rgba(8,38,82,0.30)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1683d7] sm:right-5 sm:top-5"
          >
            <span className="text-[1.45rem] leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>

          <div
            className={`fixed inset-0 z-40 transition-all duration-300 ${
              open
                ? "pointer-events-auto bg-slate-950/25 backdrop-blur-[2px]"
                : "pointer-events-none bg-transparent"
            }`}
            onClick={() => setOpen(false)}
          />

          <nav
            className={`fixed right-4 top-[4.9rem] z-50 flex w-[min(90vw,340px)] flex-col gap-3 rounded-[1.6rem] border border-white/12 bg-gradient-to-b from-[#0a1f44] to-[#1683d7] p-4 shadow-[0_28px_60px_rgba(8,38,82,0.32)] transition-all duration-300 sm:right-5 ${
              open
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0"
            }`}
          >
            {navItems.map((item) => {
              const active =
                location.pathname === "/" && activeSection === item.section;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goToSection(item.section)}
                  className={`relative w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold text-white transition-all duration-300 ${
                    active
                      ? "border-white/20 bg-white/22"
                      : "border-white/8 bg-white/8 hover:bg-white/16"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-4 right-4 bottom-2 h-[2px] rounded-full bg-white transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToSection("contact")}
              className="mt-1 inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0a1f44] shadow-[0_14px_28px_rgba(7,27,58,0.18)] transition-all duration-300 hover:bg-[#edf5ff]"
            >
              Get Yours
            </button>
          </nav>
        </>
      )}
    </>
  );
}
