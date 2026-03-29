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
      title: "Large Format Printing",
      desc: "High-impact banners, posters, backdrops, and display graphics for indoor and outdoor branding.",
      icon: "🖨️",
    },
    {
      title: "Sticker & Label Printing",
      desc: "Custom stickers, labels, product branding, and packaging support with clean finishing.",
      icon: "🏷️",
    },
    {
      title: "Promotional Products",
      desc: "Branded notebooks, pens, mugs, gift items, and corporate giveaway materials.",
      icon: "🎁",
    },
    {
      title: "UV & Custom Printing",
      desc: "Premium custom printing on selected surfaces for unique branded products and specialty jobs.",
      icon: "✨",
    },
    {
      title: "T-shirt & Apparel Printing",
      desc: "Custom apparel production for teams, brands, campaigns, staff uniforms, and events.",
      icon: "👕",
    },
    {
      title: "Business Branding Materials",
      desc: "Business cards, brochures, office branding, company stationery, and professional print support.",
      icon: "🏢",
    },
  ];

  const products = [
    "Business Cards",
    "Custom Stickers",
    "Roll-up Banners",
    "Branded Notebooks",
    "Pens & Promo Items",
    "Packaging Labels",
    "Mugs & Gift Items",
    "Event Backdrops",
  ];

  const portfolio = [
    "Corporate branding package",
    "Custom label production",
    "Promotional giveaway set",
    "Large event backdrop",
    "Retail sticker batch",
    "Office print materials",
  ];

  const reasons = [
    "High-quality production output",
    "Modern printing equipment",
    "Custom solutions for every job",
    "Fast response and reliable service",
    "Professional finishing and detail",
    "Bulk order support for businesses",
  ];

  const process = [
    {
      step: "01",
      title: "Send Your Request",
      desc: "Tell us what you need, quantities, sizes, deadline, and any branding requirements.",
    },
    {
      step: "02",
      title: "Get Your Quotation",
      desc: "We review the request and provide a clear quotation with the best production option.",
    },
    {
      step: "03",
      title: "Approve & Produce",
      desc: "Once approved, design and production move forward with close attention to finish and quality.",
    },
    {
      step: "04",
      title: "Receive Your Order",
      desc: "Pick up or arrange delivery for a professional final product ready for use.",
    },
  ];

  return (
    <div className="bg-[#F3FAFE] text-slate-900 overflow-x-hidden">
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

        <div className="absolute inset-0 bg-[#0f172a]/55 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 via-[#0f172a]/45 to-[#0f172a]/75 z-[1]" />

        <div className="absolute inset-0 z-[2] pointer-events-none">
          <img
            src={heroHover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 md:opacity-25"
          />
        </div>

        <div className="absolute inset-0 z-[2] pointer-events-none">
          <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-[#1074B8]/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#1074B8]/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs md:text-sm text-white/90 shadow-lg font-semibold">
            Established for Your Quality Printing Solution
          </div>

          <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]">
            HD Quality Printing *
            <span className="block text-[#dff1fb] font-semibold">
              Fast Delivery.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/80 leading-7">
            Azael Printing helps businesses, events, and organizations produce
            high-quality printed materials, promotional products, labels, and
            branding items with clean finishing and dependable service.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#FFFFFF] text-[#1074B8] text-sm md:text-base font-bold shadow-[0_14px_34px_rgba(16,116,184,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(16,116,184,0.28)]"
            >
              Request a Quote
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
            {[
              { value: "Fast", label: "Turnaround" },
              { value: "Premium", label: "Finish" },
              { value: "Custom", label: "Orders" },
              { value: "Business", label: "Support" },
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

      <div className="min-h-screen bg-[#F3FAFE] text-slate-900">
        <header className="sticky top-0 z-50 border-b border-[#D9ECF7]/80 bg-[#F3FAFE]/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[#1074B8] text-lg font-black tracking-tight text-white shadow-lg shadow-[#1074B8]/20">
                A
              </div>
              <div>
                <div className="text-[1.05rem] font-black tracking-tight text-slate-950">
                  Azael Printing
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1074B8]/80">
                  Print • Brand • Deliver
                </div>
              </div>
            </div> */}

            <nav className="hidden items-center gap-2 rounded-full border border-[#D9ECF7] bg-white/80 px-2 py-2 shadow-sm md:flex">
              {[
                ["Home", "#home"],
                ["Services", "#services"],
                ["Products", "#products"],
                ["Portfolio", "#portfolio"],
                ["Contact", "#contact"],
              ].map(([label, href], index) => (
                <a
                  key={label}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    index === 0
                      ? "bg-[#1074B8] text-white shadow-md shadow-[#1074B8]/20"
                      : "text-slate-700 hover:bg-[#F3FAFE] hover:text-[#1074B8]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden text-right lg:block">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Need a quote fast?
                </div>
                <div className="text-sm font-black text-slate-950">
                  Talk to Azael today
                </div>
              </div>
              <button className="rounded-full border border-[#D9ECF7] bg-white px-5 py-2.5 text-sm font-black text-[#1074B8] shadow-lg shadow-[#1074B8]/10 transition hover:-translate-y-0.5 hover:border-[#1074B8]/30 hover:bg-white">
                Request Quote
              </button>
            </div>
          </div>
        </header>

        <main>
          <section id="home" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,116,184,0.14),_transparent_32%),radial-gradient(circle_at_left,_rgba(16,116,184,0.08),_transparent_28%)]" />
            <div className="absolute left-0 top-24 h-52 w-52 rounded-full bg-[#1074B8]/6 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#1074B8]/8 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D9ECF7] bg-white px-4 py-2 text-sm font-bold text-[#1074B8] shadow-sm">
                  Trusted Printing & Branding Partner
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-[4.2rem]">
                  Printing That Makes
                  <span className="block text-[#1074B8]">
                    Your Brand Look Serious
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-[1.05rem]">
                  Azael Printing helps businesses, events, and organizations
                  produce high-quality printed materials, promotional products,
                  labels, and branding items with clean finishing and dependable
                  service.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button className="rounded-full border border-[#D9ECF7] bg-[#FFFFFF] px-7 py-3.5 text-sm font-black text-[#1074B8] shadow-xl shadow-[#1074B8]/10 transition hover:-translate-y-1 hover:border-[#1074B8]/30 hover:bg-white">
                    Request a Quote
                  </button>
                </div>

                <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    "Fast Turnaround",
                    "Premium Finish",
                    "Custom Orders",
                    "Bulk Support",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#D9ECF7] bg-white px-4 py-4 text-center text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-[1.75rem] border border-[#D9ECF7] bg-white/80 shadow-lg blur-[1px] lg:block" />
                <div className="absolute -right-4 bottom-10 hidden h-20 w-20 rounded-full border border-[#D9ECF7] bg-white/80 shadow-lg lg:block" />

                <div className="relative rounded-[2rem] border border-[#D9ECF7] bg-white p-5 shadow-2xl shadow-[#1074B8]/10">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.75rem] bg-[#1074B8] p-6 text-white shadow-lg shadow-[#1074B8]/20 transition hover:-translate-y-1">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                        Featured Service
                      </div>
                      <div className="mt-3 text-2xl font-black leading-tight">
                        Custom Branding Prints
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/85">
                        Labels, stickers, office branding, promo materials, and
                        clean business print production.
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-[#D9ECF7] bg-[#F3FAFE] p-6 transition hover:-translate-y-1 hover:shadow-md">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Production Focus
                      </div>
                      <div className="mt-3 text-2xl font-black leading-tight text-slate-950">
                        Clean Output
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Strong materials, precise finishing, and professional
                        presentation that represent your brand properly.
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-[#D9ECF7] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Built For
                      </div>
                      <div className="mt-3 text-2xl font-black leading-tight text-slate-950">
                        Business & Events
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Ideal for companies, schools, campaigns, corporate
                        gifts, activations, and branded events.
                      </p>
                    </div>

                    <div className="rounded-[1.75rem] bg-[#1074B8]/8 p-6 transition hover:-translate-y-1 hover:shadow-md">
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#1074B8]">
                        Azael Standard
                      </div>
                      <div className="mt-3 text-2xl font-black leading-tight text-slate-950">
                        Print. Brand. Deliver.
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Straight process, reliable communication, and output
                        that looks polished instead of improvised.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-[#D9ECF7] bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 text-center sm:px-6 md:grid-cols-5 lg:px-8">
              {[
                "Professional Equipment",
                "Reliable Delivery",
                "Custom Orders",
                "Business Solutions",
                "Quality Finish",
              ].map((item) => (
                <div key={item} className="text-sm font-bold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section
            id="services"
            className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="max-w-2xl">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1074B8]">
                Services
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                What We Do
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                We deliver professional printing and branding solutions for
                businesses, events, institutions, and custom client requests.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group rounded-[1.75rem] border border-[#D9ECF7] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#1074B8]/20 hover:shadow-2xl hover:shadow-[#1074B8]/10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3FAFE] text-2xl transition group-hover:scale-110">
                    {service.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="products" className="bg-[#F3FAFE] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1074B8]">
                    Products
                  </div>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Popular Products
                  </h2>
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    Products designed to help businesses market better, package
                    better, and look more professional.
                  </p>
                </div>
                <button className="w-fit rounded-2xl border border-[#D9ECF7] bg-[#FFFFFF] px-5 py-3 text-sm font-bold text-[#1074B8] transition hover:-translate-y-1 hover:border-[#1074B8]/30 hover:bg-white">
                  Request Product Quote
                </button>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product, i) => (
                  <div
                    key={product}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#EAF6FC] via-white to-[#DDEFFA] text-center text-lg font-black text-slate-700">
                      Product Preview {i + 1}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-slate-950">
                        {product}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        Premium production support for custom branding, office
                        use, promotions, and business visibility.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1074B8]">
                  Why Choose Us
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Why Choose Azael Printing
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  We focus on quality output, professional communication, and
                  practical solutions that help businesses and clients get
                  results without unnecessary confusion.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {reasons.map((reason) => (
                    <div
                      key={reason}
                      className="rounded-2xl border border-[#D9ECF7] bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#1074B8] p-8 text-white shadow-2xl shadow-[#1074B8]/20">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  About Azael
                </div>
                <h3 className="mt-4 text-3xl font-black tracking-tight">
                  Built for serious print work
                </h3>
                <p className="mt-5 text-sm leading-8 text-white/85 sm:text-base">
                  Azael Printing provides professional printing, branding, and
                  promotional product solutions for businesses, events, and
                  custom orders. We combine quality materials, modern machines,
                  and careful finishing to produce results that represent brands
                  properly.
                </p>
                <p className="mt-5 text-sm leading-8 text-white/85 sm:text-base">
                  Whether the order is a single custom item or a larger
                  production request, the goal stays the same: professional
                  output, clear communication, and dependable service.
                </p>
              </div>
            </div>
          </section>

          <section id="portfolio" className="bg-[#F3FAFE] py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1074B8]">
                  Portfolio
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Our Recent Work
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Replace these placeholders with actual project photography.
                  Without real work samples, trust is weaker. That’s the truth.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {portfolio.map((item, i) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#EAF6FC] via-white to-[#DDEFFA] text-center text-lg font-black text-slate-600">
                      Work Sample {i + 1}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-slate-950">
                        {item}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        Showcase the quality, finish, branding detail, and type
                        of client work delivered.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1074B8]">
                Process
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Keep the process dead simple. People don’t buy when they’re
                confused.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {process.map((item) => (
                <div
                  key={item.step}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="text-sm font-black tracking-[0.2em] text-[#1074B8]">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-extrabold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="bg-[#1074B8] py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-12">
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
                    Get Started
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                    Ready to Print Your Next Project?
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">
                    Talk to Azael Printing for custom quotations, promotional
                    materials, business branding, and high-quality print
                    production that actually represents your brand well.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button className="rounded-2xl border border-[#D9ECF7] bg-[#FFFFFF] px-6 py-3.5 text-sm font-bold text-[#1074B8] transition hover:-translate-y-1 hover:border-white/60 hover:bg-white">
                      Request a Quote
                    </button>
                    <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/15">
                      Contact on WhatsApp
                    </button>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-white p-6 text-slate-900 shadow-xl">
                  <h3 className="text-xl font-extrabold">Quick Contact</h3>
                  <div className="mt-6 space-y-4 text-sm">
                    <div>
                      <div className="font-bold text-slate-500">Phone</div>
                      <div className="mt-1 font-semibold">+251 XX XXX XXXX</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-500">Email</div>
                      <div className="mt-1 font-semibold">
                        info@azaelprinting.com
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-500">Location</div>
                      <div className="mt-1 font-semibold">
                        Addis Ababa, Ethiopia
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-500">
                        Business Support
                      </div>
                      <div className="mt-1 font-semibold">
                        Bulk orders • Branding • Custom requests
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[#D9ECF7] bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-950">
                Azael Printing
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Professional printing, branding, promotional products, and
                custom production solutions.
              </p>
            </div>

            <div>
              <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900">
                Quick Links
              </div>
              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                <div>Home</div>
                <div>Services</div>
                <div>Products</div>
                <div>Portfolio</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900">
                Services
              </div>
              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                <div>Large Format Printing</div>
                <div>Sticker Printing</div>
                <div>Promotional Items</div>
                <div>Custom Branding</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900">
                Contact
              </div>
              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                <div>+251 XX XXX XXXX</div>
                <div>info@azaelprinting.com</div>
                <div>Addis Ababa, Ethiopia</div>
                <div>
                  Powered by
                  <a
                    href="https://mulutilacodecomp.vercel.app"
                    className="text-decoration-inherit hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MuluTilaCodeCamp. |Pro.STD.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <button className="fixed bottom-5 right-5 rounded-full border border-[#D9ECF7] bg-[#FFFFFF] px-5 py-3 text-sm font-bold text-[#1074B8] shadow-2xl transition hover:-translate-y-1 hover:border-[#1074B8]/30 hover:bg-white">
          WhatsApp
        </button>
      </div>
    </div>
  );
}
