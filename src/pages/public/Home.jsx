// import bgvideo from "./printing-advert.mp4";
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
//       title: "Large Format Printing",
//       desc: "High-impact banners, posters, backdrops, and display graphics for indoor and outdoor branding.",
//       icon: "🖨️",
//     },
//     {
//       title: "Sticker & Label Printing",
//       desc: "Custom stickers, labels, product branding, and packaging support with clean finishing.",
//       icon: "🏷️",
//     },
//     {
//       title: "Promotional Products",
//       desc: "Branded notebooks, pens, mugs, gift items, and corporate giveaway materials.",
//       icon: "🎁",
//     },
//     {
//       title: "UV & Custom Printing",
//       desc: "Premium custom printing on selected surfaces for unique branded products and specialty jobs.",
//       icon: "✨",
//     },
//     {
//       title: "T-shirt & Apparel Printing",
//       desc: "Custom apparel production for teams, brands, campaigns, staff uniforms, and events.",
//       icon: "👕",
//     },
//     {
//       title: "Business Branding Materials",
//       desc: "Business cards, brochures, office branding, company stationery, and professional print support.",
//       icon: "🏢",
//     },
//   ];

//   const portfolio = [
//     "Corporate branding package",
//     "Custom label production",
//     "Promotional giveaway set",
//     "Large event backdrop",
//     "Retail sticker batch",
//     "Office print materials",
//   ];

//   return (
//     <div className="bg-[#F3FAFE] text-slate-900 overflow-x-hidden">
//       <section
//         id="top"
//         className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden"
//       >
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

//         <div className="absolute inset-0 bg-[#0f172a]/55 z-[1]" />
//         <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/20 via-[#0f172a]/45 to-[#0f172a]/75 z-[1]" />

//         <div className="absolute inset-0 z-[2] pointer-events-none">
//           <img
//             src={heroHover}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover opacity-15 md:opacity-25"
//           />
//         </div>

//         <div className="absolute inset-0 z-[2] pointer-events-none">
//           <div className="absolute left-0 top-20 h-56 w-56 rounded-full bg-[#1074B8]/20 blur-3xl" />
//           <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[#1074B8]/15 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
//           <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs md:text-sm text-white/90 shadow-lg font-semibold">
//             Trusted Printing & Branding Partner
//           </div>

//           <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]">
//             Printing That Makes
//             <span className="block text-[#dff1fb] font-semibold">
//               Your Brand Look Serious
//             </span>
//           </h1>

//           <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/80 leading-7">
//             Azael Printing helps businesses, events, and organizations produce
//             high-quality printed materials, promotional products, labels, and
//             branding items with clean finishing and dependable service.
//           </p>

//           <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
//             <button
//               type="button"
//               onClick={() => scrollToSection("contact")}
//               className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#FFFFFF] text-[#1074B8] text-sm md:text-base font-bold shadow-[0_14px_34px_rgba(16,116,184,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(16,116,184,0.28)]"
//             >
//               Request a Quote
//             </button>
//           </div>

//           <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
//             {[
//               { value: "Fast", label: "Turnaround" },
//               { value: "Premium", label: "Finish" },
//               { value: "Custom", label: "Orders" },
//               { value: "Business", label: "Support" },
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
//         className="relative bg-[#F3FAFE] py-16 sm:py-20 md:py-24 scroll-mt-20 overflow-hidden"
//       >
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#1074B8]/10 blur-3xl" />
//           <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1074B8]/10 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7] shadow-sm">
//               About Azael Printing
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Printing That Looks Sharp,
//               <span className="block text-[#1074B8]">
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
//         </div>
//       </section>

//       <section
//         id="services"
//         className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-[#F3FAFE] px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7]">
//               Our Services
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Complete Print and Branding
//               <span className="block text-[#1074B8]">
//                 Solutions in One Place
//               </span>
//             </h2>
//           </div>

//           <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
//             {services.map((item, index) => (
//               <div
//                 key={item.title}
//                 className="group rounded-[1.75rem] border border-[#D9ECF7] bg-[#F3FAFE] p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_26px_60px_rgba(16,116,184,0.10)]"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#D9ECF7] text-xl">
//                     {item.icon}
//                   </div>
//                   <div className="text-[#1074B8] font-black">0{index + 1}</div>
//                 </div>

//                 <h3 className="mt-5 text-xl font-semibold text-slate-900">
//                   {item.title}
//                 </h3>

//                 <p className="mt-3 text-sm md:text-base text-slate-600 leading-7">
//                   {item.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="gallery"
//         className="relative bg-[#F3FAFE] py-16 sm:py-20 md:py-24 scroll-mt-20"
//       >
//         <div className="max-w-6xl mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto text-center">
//             <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7]">
//               Gallery
//             </span>

//             <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
//               Some Completed Jobs Gallery
//               <span className="block text-[#1074B8]">Quality Work</span>
//             </h2>
//           </div>

//           <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
//             {portfolio.map((item, index) => (
//               <div
//                 key={item}
//                 className={`rounded-[2rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-2 ${
//                   index === 1
//                     ? "bg-[#1074B8] shadow-[0_26px_60px_rgba(16,116,184,0.22)]"
//                     : "bg-white border border-[#D9ECF7] shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(16,116,184,0.10)]"
//                 }`}
//               >
//                 <div
//                   className={`aspect-[4/4.6] rounded-[1.5rem] flex items-center justify-center text-lg font-semibold ${
//                     index === 1
//                       ? "bg-white/10 text-white"
//                       : "bg-[#F3FAFE] text-[#1074B8] border border-[#D9ECF7]"
//                   }`}
//                 >
//                   Photo {index + 1}
//                 </div>

//                 <div className="mt-6 text-center">
//                   <h3
//                     className={`text-xl font-semibold ${
//                       index === 1 ? "text-white" : "text-slate-900"
//                     }`}
//                   >
//                     {item}
//                   </h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section
//         id="contact"
//         className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-[#D9ECF7] shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
//             <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
//               <div className="bg-[#1074B8] p-7 sm:p-8 md:p-10 text-white">
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
//               </div>

//               <div className="bg-[#F3FAFE] p-7 sm:p-8 md:p-10">
//                 <form className="space-y-5">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-2 text-sm font-semibold text-slate-700">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-2 text-sm font-semibold text-slate-700">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-semibold text-slate-700">
//                       E-mail
//                     </label>
//                     <input
//                       type="email"
//                       className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block mb-2 text-sm font-semibold text-slate-700">
//                       Message
//                     </label>
//                     <textarea
//                       rows="6"
//                       className="w-full rounded-xl border border-[#D9ECF7] bg-white px-4 py-3 outline-none resize-none"
//                     />
//                   </div>

//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="inline-flex items-center justify-center min-w-[160px] h-12 rounded-xl bg-white border border-[#D9ECF7] text-[#1074B8] text-sm md:text-base font-bold shadow-[0_14px_30px_rgba(16,116,184,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(16,116,184,0.24)]"
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
//     </div>
//   );
// }

import bgvideo from "./printing-advert.mp4";
import heroHover from "../../assets/hero-hover.png";

export default function Home() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navOffset = 84;
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

  const portfolio = [
    "Corporate branding package",
    "Custom label production",
    "Promotional giveaway set",
    "Large event backdrop",
    "Retail sticker batch",
    "Office print materials",
  ];

  return (
    <div className="bg-[#F3FAFE] text-slate-900 overflow-x-hidden">
      <section
        id="top"
        className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden"
      >
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
            Trusted Printing & Branding Partner
          </div>

          <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.02]">
            Printing That Makes
            <span className="block text-[#dff1fb] font-semibold">
              Your Brand Look Serious
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

      <section
        id="about"
        className="relative bg-[#F3FAFE] py-16 sm:py-20 md:py-24 scroll-mt-20 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#1074B8]/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1074B8]/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7] shadow-sm">
              About Azael Printing
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Printing That Looks Sharp,
              <span className="block text-[#1074B8]">
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
        </div>
      </section>

      <section
        id="services"
        className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#F3FAFE] px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7]">
              Our Services
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Complete Print and Branding
              <span className="block text-[#1074B8]">
                Solutions in One Place
              </span>
            </h2>
          </div>

          <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[1.75rem] border border-[#D9ECF7] bg-[#F3FAFE] p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_26px_60px_rgba(16,116,184,0.10)]"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#D9ECF7] text-xl">
                    {item.icon}
                  </div>
                  <div className="text-[#1074B8] font-black">0{index + 1}</div>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm md:text-base text-slate-600 leading-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="relative bg-[#F3FAFE] py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#1074B8] border border-[#D9ECF7]">
              Gallery
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Some Completed Jobs Gallery
              <span className="block text-[#1074B8]">Quality Work</span>
            </h2>
          </div>

          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {portfolio.map((item, index) => (
              <div
                key={item}
                className={`rounded-[2rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-2 ${
                  index === 1
                    ? "bg-[#1074B8] shadow-[0_26px_60px_rgba(16,116,184,0.22)]"
                    : "bg-white border border-[#D9ECF7] shadow-[0_14px_36px_rgba(15,23,42,0.05)] hover:shadow-[0_24px_50px_rgba(16,116,184,0.10)]"
                }`}
              >
                <div
                  className={`aspect-[4/4.6] rounded-[1.5rem] flex items-center justify-center text-lg font-semibold ${
                    index === 1
                      ? "bg-white/10 text-white"
                      : "bg-[#F3FAFE] text-[#1074B8] border border-[#D9ECF7]"
                  }`}
                >
                  Photo {index + 1}
                </div>

                <div className="mt-6 text-center">
                  <h3
                    className={`text-xl font-semibold ${
                      index === 1 ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative bg-white py-16 sm:py-20 md:py-24 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-[#D9ECF7] shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-[#1074B8] p-7 sm:p-8 md:p-10 text-white">
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
              </div>

              <div className="bg-[#F3FAFE] p-7 sm:p-8 md:p-10">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      E-mail
                    </label>
                    <input
                      type="email"
                      className="w-full h-12 rounded-xl border border-[#D9ECF7] bg-white px-4 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      rows="6"
                      className="w-full rounded-xl border border-[#D9ECF7] bg-white px-4 py-3 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center min-w-[160px] h-12 rounded-xl bg-white border border-[#D9ECF7] text-[#1074B8] text-sm md:text-base font-bold shadow-[0_14px_30px_rgba(16,116,184,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(16,116,184,0.24)]"
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
    </div>
  );
}
