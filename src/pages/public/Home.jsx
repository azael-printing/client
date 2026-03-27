import { Link } from "react-router-dom";
import bgvideo from "../public/printing-advert.mp4";
import heroHover from "../../assets/hero-hover.png";

export default function Home() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const navOffset = 72;
    const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const services = [
    {
      title: "Branding",
      text: "Professional branding materials that strengthen identity, consistency, and customer trust across every touchpoint.",
    },
    {
      title: "Design",
      text: "Clean and production-ready creative design for print, promotion, packaging, and corporate communication.",
    },
    {
      title: "Print Production",
      text: "Reliable high-quality output for UV printing, large format, DTF, and premium custom applications.",
    },
    {
      title: "Delivery",
      text: "Fast and organized fulfillment that gets finished work to clients safely, correctly, and on time.",
    },
  ];

  const gallery = [
    {
      name: "Rina Pasta",
      role: "Gust ",
      featured: false,
    },
    {
      name: "Ethio Tel",
      role: "sticker",
      featured: true,
    },
    {
      name: "Tote Bag",
      role: "Cortex",
      featured: false,
    },
  ];

  const colleagues = [
    "Kaba Transport",
    "Ethio telecom",
    "Felek Leather",
    "Corporate Clients",
  ];

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={bgvideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-slate-950/60 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/75 z-[1]" />

        <div className="absolute inset-0 z-[2] pointer-events-none">
          <img
            src={heroHover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 md:opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs md:text-sm text-white/90 shadow-lg">
            We Established for Your Quality Printing Solution!
          </div>

          <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            HD Quality + Fast Printing
            <span className="block text-white/90 font-light">
              We Build Your Real Business Presence.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/80 leading-7">
            UV Printing • Large Format • DTF • Corporate Materials • Branding
            Solutions
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/#"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_34px_rgba(22,131,215,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(22,131,215,0.45)]"
            >
              + Follow Us
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-[#1683d7] text-sm md:text-base font-semibold shadow-[0_12px_28px_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white"
            >
              Contact Us
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
            {[
              { value: "Fast", label: "Turnaround" },
              { value: "Premium", label: "Print Quality" },
              { value: "Reliable", label: "Delivery Flow" },
              { value: "Modern", label: "Brand Output" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/12 bg-white/10 backdrop-blur-md px-4 py-4 md:px-5 md:py-5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15"
              >
                <div className="text-base sm:text-lg md:text-2xl font-bold">
                  {item.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/75">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative bg-[#f6fbfd] py-16 sm:py-20 md:py-24 scroll-mt-20 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#1683d7]/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1f78b8]/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
              About Azael Printing
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Printing That Looks Sharp,
              <span className="block text-[#1683d7]">
                Feels Professional, and Delivers Fast
              </span>
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 leading-7 md:leading-8">
              We help businesses, institutions, and brands turn ideas into
              high-quality printed products. From concept and design to
              production and delivery, our focus is simple: quality,
              consistency, speed, and trust.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                title: "Vision",
                text: "To become a trusted modern printing company known for quality execution and strong customer relationships.",
              },
              {
                title: "Values",
                text: "Discipline, quality, reliability, professionalism, and respect for every client order.",
              },
              {
                title: "Mission",
                text: "To deliver excellent print and branding solutions that help clients present their business confidently.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(22,131,215,0.14)]"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
                  {item.title.charAt(0)}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
              Our Services
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Complete Print and Branding
              <span className="block text-[#1683d7]">
                Solutions in One Place
              </span>
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 leading-7">
              We don’t just print. We help businesses build visibility with
              design, branding, production, and delivery that actually works.
            </p>
          </div>

          <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {services.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] border border-slate-200 bg-[#f8fcfe] p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_26px_60px_rgba(22,131,215,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] font-bold">
                    0{index + 1}
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1683d7] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    →
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm md:text-base text-slate-600 leading-7">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative bg-[#eef7fb] py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#1683d7]/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7] shadow-sm">
              Why Choose Us
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              We Focus on the Details
              <span className="block text-[#1683d7]">
                That Clients Actually Notice
              </span>
            </h2>

            <p className="mt-5 text-sm sm:text-base md:text-lg leading-7 text-slate-600">
              Cheap-looking print kills trust. Weak finishing kills
              presentation. Late delivery kills confidence. We build our
              workflow to avoid exactly that.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Strong visual quality with sharp finishing",
                "Fast response and organized workflow",
                "Professional output for business branding",
                "Reliable support from design to delivery",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,131,215,0.10)]"
                >
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-[#1683d7] text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm md:text-base text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {[
              { value: "UV", label: "Premium Surface Printing" },
              { value: "DTF", label: "Modern Apparel Output" },
              { value: "Large", label: "Format Capability" },
              { value: "Brand", label: "Corporate Materials" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] bg-white p-6 md:p-8 min-h-[170px] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(22,131,215,0.14)]"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#1683d7]">
                  {item.value}
                </div>
                <div className="mt-3 text-sm md:text-base text-slate-600 leading-7">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
              Gallery
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Some completed Jobs Gallery
              <span className="block text-[#1683d7]">the Quality Work</span>
            </h2>
          </div>

          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {gallery.map((cjobs, index) => (
              <div
                key={cjobs.name}
                className={`rounded-[2rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-2 ${
                  cjobs.featured
                    ? "bg-[#e1eaf0] shadow-[0_26px_60px_rgba(31,120,184,0.22)]"
                    : "bg-[#f8fcfe] border border-slate-200 shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(22,131,215,0.12)]"
                }`}
              >
                <div
                  className={`aspect-[4/4.6] rounded-[1.5rem] flex items-center justify-center text-lg font-semibold ${
                    cjobs.featured
                      ? "bg-white/15 text-white"
                      : "bg-white text-[#1683d7]"
                  }`}
                >
                  Photo {index + 1}
                </div>

                <div className="mt-6 text-center">
                  <h3
                    className={`text-xl font-semibold ${
                      cjobs.featured ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {cjobs.name}
                  </h3>
                  <p
                    className={`mt-2 text-sm md:text-base ${
                      cjobs.featured ? "text-white/85" : "text-[#1683d7]"
                    }`}
                  >
                    {cjobs.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLEAGUES */}
      <section
        id="collegues"
        className="relative bg-[#f8fcfd] py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
              Trusted Connections
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Clients, Partners,
              <span className="block text-[#1683d7]">and Collaborators</span>
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {colleagues.map((item, i) => (
              <div
                key={item}
                className={`rounded-[1.75rem] p-6 md:p-7 min-h-[180px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 ${
                  i === 1
                    ? "bg-[#1f78b8] text-white shadow-[0_24px_55px_rgba(31,120,184,0.22)]"
                    : "bg-white border border-slate-200 text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(22,131,215,0.12)]"
                }`}
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center text-sm font-bold ${
                    i === 1 ? "bg-white/15" : "bg-[#1683d7]/10 text-[#1683d7]"
                  }`}
                >
                  Logo
                </div>
                <h3 className="mt-4 text-sm sm:text-base md:text-lg font-semibold">
                  {item}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[#1f78b8] p-7 sm:p-8 md:p-10 text-white">
                <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 border border-white/15">
                  Contact Us
                </span>

                <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Let’s Print Something
                  <span className="block text-white/85">
                    That Looks Professional
                  </span>
                </h2>

                <p className="mt-5 text-sm sm:text-base text-white/80 leading-7">
                  Tell us what you need. We’ll help you move from idea to
                  professional printed output with better quality and cleaner
                  execution.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Fast response for project discussions",
                    "Clear communication before production",
                    "Professional support for branding and print jobs",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-sm sm:text-base text-white/90"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#f8fcfe] p-7 sm:p-8 md:p-10">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows="6"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center min-w-[160px] h-12 rounded-xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_30px_rgba(22,131,215,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(22,131,215,0.34)]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Azael Printing
              </h3>
              <p className="mt-4 text-sm text-white/65 leading-7 max-w-sm">
                Professional printing, branding, and production support for
                businesses that want cleaner presentation and stronger visual
                impact.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                Navigation
              </h4>
              <div className="mt-4 space-y-3 text-sm text-white/65">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="block transition hover:text-white"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="block transition hover:text-white"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block transition hover:text-white"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block transition hover:text-white"
                >
                  Contact
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                Services
              </h4>
              <div className="mt-4 space-y-3 text-sm text-white/65">
                <p>Branding</p>
                <p>Design</p>
                <p>Large Format</p>
                <p>DTF & UV Printing</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                Company
              </h4>
              <div className="mt-4 space-y-3 text-sm text-white/65">
                <p>Trusted Output</p>
                <p>Fast Delivery</p>
                <p>Professional Support</p>
                <p>Modern Branding Work</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-white/50 text-center md:text-left">
              © {new Date().getFullYear()} Azael Printing. All rights reserved.
            </p>

            <p className="text-xs sm:text-sm text-white/50 text-center md:text-right">
              <a
                href="https://mulutilacodecomp.vercel.app/"
                className=" text-inherit"
                target="_blank"
              >
                Powered by MuluTilaCodeComp
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
// import { Link } from "react-router-dom";
// import MainNavbar from "../../components/nav/MainNavbar";
// import bgvideo from "../public/printing-advert.mp4";
// import heroHover from "../../assets/hero-hover.png";

// export default function Home() {
//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if (!el) return;

//     const navOffset = 84;
//     const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
//     window.scrollTo({ top: y, behavior: "smooth" });
//   };

//   const services = [
//     {
//       title: "Branding",
//       text: "Professional branding materials that strengthen identity, consistency, and customer trust across every touchpoint.",
//     },
//     {
//       title: "Design",
//       text: "Clean and production-ready creative design for print, promotion, packaging, and corporate communication.",
//     },
//     {
//       title: "Print Production",
//       text: "Reliable high-quality output for UV printing, large format, DTF, and premium custom applications.",
//     },
//     {
//       title: "Delivery",
//       text: "Fast and organized fulfillment that gets finished work to clients safely, correctly, and on time.",
//     },
//   ];

//   const team = [
//     {
//       name: "Semahegn Tilahun",
//       role: "SE, Operator",
//       featured: false,
//     },
//     {
//       name: "Fekadessilassie Ayana",
//       role: "CEO, Architecture Engineer",
//       featured: true,
//     },
//     {
//       name: "Betelhem Yigzaw",
//       role: "SE, Graphics Designer",
//       featured: false,
//     },
//   ];

//   const colleagues = [
//     "Kaba Transport",
//     "Ethio telecom",
//     "Felek Leather",
//     "Corporate Clients",
//   ];

//   return (
//     <div id="top" className="bg-white text-slate-900 overflow-x-hidden">
//       <MainNavbar />

//       <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
//         <video
//           className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="auto"
//         >
//           <source src={bgvideo} type="video/mp4" />
//         </video>

//         <div className="absolute inset-0 bg-slate-950/60 z-[1]" />
//         <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/75 z-[1]" />

//         <div className="absolute inset-0 z-[2] pointer-events-none">
//           <img
//             src={heroHover}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover opacity-20 md:opacity-30"
//           />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
//           <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs md:text-sm text-white/90 shadow-lg">
//             We Established for Your Quality Printing Solution!
//           </div>

//           <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
//             HD Quality + Fast Printing
//             <span className="block text-white/90 font-light">
//               We Build Your Real Business Presence.
//             </span>
//           </h1>

//           <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/80 leading-7">
//             UV Printing • Large Format • DTF • Corporate Materials • Branding
//             Solutions
//           </p>

//           <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//             <Link
//               to="/#"
//               className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_34px_rgba(22,131,215,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(22,131,215,0.45)]"
//             >
//               + Follow Us
//             </Link>

//             <button
//               type="button"
//               onClick={() => scrollToSection("contact")}
//               className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-[#1683d7] text-sm md:text-base font-semibold shadow-[0_12px_28px_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white"
//             >
//               Contact Us
//             </button>
//           </div>

//           <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
//             {[
//               { value: "Fast", label: "Turnaround" },
//               { value: "Premium", label: "Print Quality" },
//               { value: "Reliable", label: "Delivery Flow" },
//               { value: "Modern", label: "Brand Output" },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="rounded-2xl border border-white/12 bg-white/10 backdrop-blur-md px-4 py-4 md:px-5 md:py-5 text-white shadow-[0_10px_28px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/15"
//               >
//                 <div className="text-base sm:text-lg md:text-2xl font-bold">
//                   {item.value}
//                 </div>
//                 <div className="mt-1 text-xs sm:text-sm text-white/75">
//                   {item.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="about"
//         className="relative bg-[#f6fbfd] py-16 sm:py-20 md:py-24 scroll-mt-24 overflow-hidden"
//       >
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#1683d7]/10 blur-3xl" />
//           <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1f78b8]/10 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
//               About Azael Printing
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Printing That Looks Sharp,
//               <span className="block text-[#1683d7]">
//                 Feels Professional, and Delivers Fast
//               </span>
//             </h2>

//             <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 leading-7 md:leading-8">
//               We help businesses, institutions, and brands turn ideas into
//               high-quality printed products. From concept and design to
//               production and delivery, our focus is simple: quality,
//               consistency, speed, and trust.
//             </p>
//           </div>

//           <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
//             {[
//               {
//                 title: "Vision",
//                 text: "To become a trusted modern printing company known for quality execution and strong customer relationships.",
//               },
//               {
//                 title: "Values",
//                 text: "Discipline, quality, reliability, professionalism, and respect for every client order.",
//               },
//               {
//                 title: "Mission",
//                 text: "To deliver excellent print and branding solutions that help clients present their business confidently.",
//               },
//             ].map((item) => (
//               <div
//                 key={item.title}
//                 className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(22,131,215,0.14)]"
//               >
//                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
//                   {item.title.charAt(0)}
//                 </div>
//                 <h3 className="mt-4 text-xl font-semibold text-slate-900">
//                   {item.title}
//                 </h3>
//                 <p className="mt-3 text-sm md:text-base leading-7 text-slate-600">
//                   {item.text}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="services"
//         className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-24"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
//               Our Services
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Complete Print and Branding
//               <span className="block text-[#1683d7]">
//                 Solutions in One Place
//               </span>
//             </h2>

//             <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 leading-7">
//               We don’t just print. We help businesses build visibility with
//               design, branding, production, and delivery that actually works.
//             </p>
//           </div>

//           <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//             {services.map((item, index) => (
//               <div
//                 key={item.title}
//                 className="group rounded-[1.75rem] border border-slate-200 bg-[#f8fcfe] p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_26px_60px_rgba(22,131,215,0.12)]"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] font-bold">
//                     0{index + 1}
//                   </div>
//                   <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1683d7] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
//                     →
//                   </div>
//                 </div>

//                 <h3 className="mt-5 text-xl font-semibold text-slate-900">
//                   {item.title}
//                 </h3>

//                 <p className="mt-3 text-sm md:text-base text-slate-600 leading-7">
//                   {item.text}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="relative bg-[#eef7fb] py-16 sm:py-20 md:py-24 overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#1683d7]/10 blur-3xl" />
//           <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
//           <div>
//             <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7] shadow-sm">
//               Why Choose Us
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               We Focus on the Details
//               <span className="block text-[#1683d7]">
//                 That Clients Actually Notice
//               </span>
//             </h2>

//             <p className="mt-5 text-sm sm:text-base md:text-lg leading-7 text-slate-600">
//               Cheap-looking print kills trust. Weak finishing kills
//               presentation. Late delivery kills confidence. We build our
//               workflow to avoid exactly that.
//             </p>

//             <div className="mt-8 space-y-4">
//               {[
//                 "Strong visual quality with sharp finishing",
//                 "Fast response and organized workflow",
//                 "Professional output for business branding",
//                 "Reliable support from design to delivery",
//               ].map((item) => (
//                 <div
//                   key={item}
//                   className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,131,215,0.10)]"
//                 >
//                   <div className="mt-0.5 h-6 w-6 rounded-full bg-[#1683d7] text-white flex items-center justify-center text-xs font-bold">
//                     ✓
//                   </div>
//                   <p className="text-sm md:text-base text-slate-700">{item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 sm:gap-5">
//             {[
//               { value: "UV", label: "Premium Surface Printing" },
//               { value: "DTF", label: "Modern Apparel Output" },
//               { value: "Large", label: "Format Capability" },
//               { value: "Brand", label: "Corporate Materials" },
//             ].map((item) => (
//               <div
//                 key={item.label}
//                 className="rounded-[1.75rem] bg-white p-6 md:p-8 min-h-[170px] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(22,131,215,0.14)]"
//               >
//                 <div className="text-2xl md:text-3xl font-bold text-[#1683d7]">
//                   {item.value}
//                 </div>
//                 <div className="mt-3 text-sm md:text-base text-slate-600 leading-7">
//                   {item.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="team"
//         className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-24"
//       >
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
//               Our Team
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               The People Behind
//               <span className="block text-[#1683d7]">the Quality Work</span>
//             </h2>
//           </div>

//           <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//             {team.map((member, index) => (
//               <div
//                 key={member.name}
//                 className={`rounded-[2rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-2 ${
//                   member.featured
//                     ? "bg-[#1f78b8] shadow-[0_26px_60px_rgba(31,120,184,0.22)]"
//                     : "bg-[#f8fcfe] border border-slate-200 shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(22,131,215,0.12)]"
//                 }`}
//               >
//                 <div
//                   className={`aspect-[4/4.6] rounded-[1.5rem] flex items-center justify-center text-lg font-semibold ${
//                     member.featured
//                       ? "bg-white/15 text-white"
//                       : "bg-white text-[#1683d7]"
//                   }`}
//                 >
//                   Photo {index + 1}
//                 </div>

//                 <div className="mt-6 text-center">
//                   <h3
//                     className={`text-xl font-semibold ${
//                       member.featured ? "text-white" : "text-slate-900"
//                     }`}
//                   >
//                     {member.name}
//                   </h3>
//                   <p
//                     className={`mt-2 text-sm md:text-base ${
//                       member.featured ? "text-white/85" : "text-[#1683d7]"
//                     }`}
//                   >
//                     {member.role}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="collegues"
//         className="relative bg-[#f8fcfd] py-16 sm:py-20 md:py-24 scroll-mt-24"
//       >
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-[#1683d7]/10 px-4 py-2 text-xs sm:text-sm font-semibold text-[#1683d7]">
//               Trusted Connections
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Clients, Partners,
//               <span className="block text-[#1683d7]">and Collaborators</span>
//             </h2>
//           </div>

//           <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
//             {colleagues.map((item, i) => (
//               <div
//                 key={item}
//                 className={`rounded-[1.75rem] p-6 md:p-7 min-h-[180px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 ${
//                   i === 1
//                     ? "bg-[#1f78b8] text-white shadow-[0_24px_55px_rgba(31,120,184,0.22)]"
//                     : "bg-white border border-slate-200 text-slate-900 shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(22,131,215,0.12)]"
//                 }`}
//               >
//                 <div
//                   className={`h-16 w-16 rounded-2xl flex items-center justify-center text-sm font-bold ${
//                     i === 1 ? "bg-white/15" : "bg-[#1683d7]/10 text-[#1683d7]"
//                   }`}
//                 >
//                   Logo
//                 </div>
//                 <h3 className="mt-4 text-sm sm:text-base md:text-lg font-semibold">
//                   {item}
//                 </h3>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="contact"
//         className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-24"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
//             <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
//               <div className="bg-[#1f78b8] p-7 sm:p-8 md:p-10 text-white">
//                 <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90 border border-white/15">
//                   Contact Us
//                 </span>

//                 <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
//                   Let’s Print Something
//                   <span className="block text-white/85">
//                     That Looks Professional
//                   </span>
//                 </h2>

//                 <p className="mt-5 text-sm sm:text-base text-white/80 leading-7">
//                   Tell us what you need. We’ll help you move from idea to
//                   professional printed output with better quality and cleaner
//                   execution.
//                 </p>

//                 <div className="mt-8 space-y-4">
//                   {[
//                     "Fast response for project discussions",
//                     "Clear communication before production",
//                     "Professional support for branding and print jobs",
//                   ].map((item) => (
//                     <div
//                       key={item}
//                       className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-sm sm:text-base text-white/90"
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-[#f8fcfe] p-7 sm:p-8 md:p-10">
//                 <form className="space-y-5">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-2 text-sm font-semibold text-slate-700">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-2 text-sm font-semibold text-slate-700">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-semibold text-slate-700">
//                       E-mail
//                     </label>
//                     <input
//                       type="email"
//                       className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-semibold text-slate-700">
//                       Message
//                     </label>
//                     <textarea
//                       rows="6"
//                       className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-[#1683d7] focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                     />
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="inline-flex items-center justify-center min-w-[160px] h-12 rounded-xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_30px_rgba(22,131,215,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(22,131,215,0.34)]"
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-slate-950 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-14">
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-xl font-semibold tracking-tight">
//                 Azael Printing
//               </h3>
//               <p className="mt-4 text-sm text-white/65 leading-7 max-w-sm">
//                 Professional printing, branding, and production support for
//                 businesses that want cleaner presentation and stronger visual
//                 impact.
//               </p>
//             </div>

//             <div>
//               <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
//                 Navigation
//               </h4>
//               <div className="mt-4 space-y-3 text-sm text-white/65">
//                 <button
//                   onClick={() =>
//                     window.scrollTo({ top: 0, behavior: "smooth" })
//                   }
//                   className="block transition hover:text-white"
//                 >
//                   Home
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("about")}
//                   className="block transition hover:text-white"
//                 >
//                   About
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("services")}
//                   className="block transition hover:text-white"
//                 >
//                   Services
//                 </button>
//                 <button
//                   onClick={() => scrollToSection("contact")}
//                   className="block transition hover:text-white"
//                 >
//                   Contact
//                 </button>
//               </div>
//             </div>

//             <div>
//               <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
//                 Services
//               </h4>
//               <div className="mt-4 space-y-3 text-sm text-white/65">
//                 <p>Branding</p>
//                 <p>Design</p>
//                 <p>Large Format</p>
//                 <p>DTF & UV Printing</p>
//               </div>
//             </div>

//             <div>
//               <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
//                 Company
//               </h4>
//               <div className="mt-4 space-y-3 text-sm text-white/65">
//                 <p>Trusted Output</p>
//                 <p>Fast Delivery</p>
//                 <p>Professional Support</p>
//                 <p>Modern Branding Work</p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-xs sm:text-sm text-white/50 text-center md:text-left">
//               © {new Date().getFullYear()} Azael Printing. All rights reserved.
//             </p>

//             <p className="text-xs sm:text-sm text-white/50 text-center md:text-right">
//               <a
//                 href="https://mulutilacodecomp.vercel.app/"
//                 className="text-inherit"
//                 target="_blank"
//               >
//                 Powered by MuluTilaCodeComp
//               </a>
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
