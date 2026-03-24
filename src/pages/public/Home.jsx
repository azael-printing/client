// // import { Link } from "react-router-dom";
// // import bgvideo from "../public/printing-advert.mp4";
// // export default function Home() {
// //   return (
// //     <div>
// //       <section className="relative min-h-[calc(100vh-72px)] flex items-center   justify-center overflow-hidden ">
// //         {/* Replace src with your real video path in /public */}
// //         <video
// //           className="absolute inset-0 w-full h-full object-cover"
// //           autoPlay
// //           muted
// //           loop
// //           playsInline
// //           preload="auto"
// //         >
// //           <source src={bgvideo} type="video/mp4" sound="mute" />
// //         </video>

// //         <div className="absolute inset-0 bg-black/50" />

// //         <div className="relative z-10 text-center px-4">
// //           <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
// //             High Quality Printing. Fast Delivery.
// //           </h1>
// //           <p className="mt-4 text-white/90 max-w-2xl mx-auto">
// //             UV Printing • Large Format • DTF • Branding • Corporate Materials
// //           </p>

// //           <div className="mt-8 flex items-center justify-center gap-3">
// //             <Link
// //               to="/management"
// //               className="px-6 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg hover:opacity-90 transition"
// //             >
// //               GET STARTED
// //             </Link>
// //             <Link
// //               to="/contact"
// //               className="px-6 py-3 rounded-2xl bg-white text-primary font-bold shadow-lg hover:bg-bgLight transition"
// //             >
// //               CONTACT US
// //             </Link>
// //           </div>
// //         </div>
// //       </section>
// //       <section className="relative  flex items-center   justify-center ">
// //         <div className=" max-w-6xl mx-auto px-4 py-10">
// //           <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
// //             {" "}
// //             Our Services{" "}
// //           </h1>
// //         </div>
// //       </section>

// //       <section className="relative  flex items-center   justify-center  ">
// //         <div className="max-w-6xl mx-auto px-4 py-10">
// //           <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
// //             {" "}
// //             About Us{" "}
// //           </h1>
// //         </div>
// //       </section>

// //       <section className="relative  flex items-center   justify-center ">
// //         <div className="max-w-6xl mx-auto px-4 py-10">
// //           <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
// //             {" "}
// //             Our Team{" "}
// //           </h1>
// //         </div>
// //       </section>
// //       <section className="relative  flex items-center   justify-center ">
// //         <div className="ax-w-6xl mx-auto px-4 py-10">
// //           <h1 className=" text-2xl md:text-3xl font-extrabold text-blue-700">
// //             {" "}
// //             Our Collegues{" "}
// //           </h1>
// //         </div>
// //       </section>
// //       <section className="relative  flex items-center   justify-center ">
// //         <div className="ax-w-6xl mx-auto px-4 py-10">
// //           <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700">
// //             {" "}
// //             Contact Us{" "}
// //           </h1>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
// import { Link } from "react-router-dom";
// import bgvideo from "../public/printing-advert.mp4";
// import heroHover from "../../assets/hero-hover.png";
// // import aboutHover from "../../../public/about-hover.png";

// export default function Home() {
//   const scrollToSection = (id) => {
//     const el = document.getElementById(id);
//     if (!el) return;

//     const navOffset = 72;
//     const y = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
//     window.scrollTo({ top: y, behavior: "smooth" });
//   };

//   return (
//     <div className="bg-white text-[#1b1b1b] overflow-x-hidden">
//       {/* HERO */}
//       <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
//         <video
//           className="absolute inset-0 w-full h-full object-cover"
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="auto"
//         >
//           <source src={bgvideo} type="video/mp4" />
//         </video>

//         {/* dark video layer */}
//         <div className="absolute inset-0 bg-black/45 z-[1]" />

//         {/* REAL IMAGE OVERLAY - not random arcs */}
//         <div className="absolute inset-0 z-[2] pointer-events-none">
//           <img
//             src={heroHover}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover opacity-30"
//           />
//         </div>

//         {/* content */}
//         <div className="relative z-10 text-center px-4 max-w-4xl">
//           <h1 className="text-white text-xl md:text-5xl font-semibold tracking-tight leading-tight">
//             High Quality Printing. Fast Delivery.
//           </h1>

//           <p className="mt-4 text-white/90 max-w-2xl mx-auto text-sm md:text-base font-normal">
//             UV Printing • Large Format • DTF • Branding • Corporate Materials
//           </p>

//           <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
//             <Link
//               to="/management"
//               className="px-6 py-3 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:brightness-110"
//             >
//               GET STARTED
//             </Link>

//             <button
//               type="button"
//               onClick={() => scrollToSection("contact")}
//               className="px-6 py-3 rounded-2xl bg-white text-[#1683d7] text-sm md:text-base font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-[#f4f8fc]"
//             >
//               CONTACT US
//             </button>
//           </div>
//         </div>
//       </section>
//       <>
//         {/* ABOUT US */}
//         <section
//           id="about"
//           className="about-section relative overflow-hidden bg-[#f4f8fa] py-12 md:py-20 scroll-mt-20"
//         >
//           {/* <div className="about-bg-outer" /> */}
//           {/* <div className="about-bg-topp" /> */}
//           <div className="about-bg-top" />
//           {/* <div className="services-team-outer" /> */}

//           {/* <div className="about-bg-mid" /> */}

//           <div className="relative z-10 max-w-[1250px] mx-auto px-4">
//             <h2 className="section-title-white font-medium">About US</h2>

//             <div className="mt-8 md:mt-12 grid grid-cols-3 items-start">
//               <div className="flex justify-start">
//                 <div className="about-pill hover-soft">
//                   <span>Vision</span>
//                 </div>
//               </div>

//               <div className="flex justify-center">
//                 <div className="about-pill about-pill-center hover-soft">
//                   <span>Values</span>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <div className="about-pill hover-soft">
//                   <span>Mission</span>
//                 </div>
//               </div>
//             </div>

//             <div className="about-copy font-normal">
//               Lorem ipsum dolor sit amet, consec- tetuer adipiscing elit, sed
//               diam nonum- my nibh euismod tincidunt ut laoreet dolore magna
//               aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nos-
//               trud exerci tation ullamcorper suscipit lobortis nisl ut aliquip
//               ex ea commodo
//             </div>
//           </div>
//         </section>

//         {/* SERVICES + TEAM */}
//         <section
//           id="services-team"
//           className="services-team-section relative overflow-hidden bg-[#eef5f7] py-12 md:py-20 scroll-mt-20"
//         >
//           <div className="services-team-outer" />
//           {/* <div className="services-team-inner" /> */}
//           <div className="services-team-center" />

//           <div className="relative z-10 max-w-[1280px] mx-auto px-3 md:px-6">
//             {/* OUR SERVICES */}
//             <div id="services">
//               <h2 className="section-title-blue">Our Services</h2>

//               <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-start">
//                 <div className="service-card">
//                   <h3 className="service-title">Branding</h3>
//                   <p className="service-text">
//                     Lorem ipsum
//                     <br />
//                     dolor sit amet,
//                     <br />
//                     consectetuer
//                     <br />
//                     adipiscing elit,
//                     <br />
//                     sed diam
//                     <br />
//                     nonummy nibh
//                     <br />
//                     euismod tincid-
//                     <br />
//                     unt ut laoreet
//                   </p>
//                 </div>

//                 <div className="service-card">
//                   <h3 className="service-title">Design</h3>
//                   <p className="service-text">
//                     Lorem ipsum
//                     <br />
//                     dolor sit amet,
//                     <br />
//                     consectetuer
//                     <br />
//                     adipiscing elit,
//                     <br />
//                     sed diam
//                     <br />
//                     nonummy nibh
//                     <br />
//                     euismod tincid-
//                     <br />
//                     unt ut laoreet
//                     <br />
//                     dolore magna
//                   </p>
//                 </div>

//                 <div className="service-card">
//                   <h3 className="service-title text-center">Print</h3>
//                   <p className="service-text">
//                     Lorem ipsum
//                     <br />
//                     dolor sit amet,
//                     <br />
//                     consectetuer
//                     <br />
//                     adipiscing elit,
//                     <br />
//                     sed diam nonum-
//                     <br />
//                     my nibh euismod
//                     <br />
//                     tincidunt ut
//                     <br />
//                     laoreet dolore
//                     <br />
//                     magna aliquam
//                     <br />
//                     erat volutpat. Ut
//                   </p>
//                 </div>

//                 <div className="service-card">
//                   <h3 className="service-title">Delivery</h3>
//                   <p className="service-text service-text-delivery">
//                     Lorem ipsum dolor
//                     <br />
//                     sit amet, consec-
//                     <br />
//                     tetuer adipiscing
//                     <br />
//                     elit, sed diam
//                     <br />
//                     nonummy nibh eu-
//                     <br />
//                     ismod tincidunt ut
//                     <br />
//                     laoreet dolore
//                     <br />
//                     magna aliquam
//                     <br />
//                     erat volutpat. Ut
//                     <br />
//                     wisi enim ad minim
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* OUR TEAM */}
//             <div id="team" className="mt-14 md:mt-20">
//               <h2 className="section-title-blue">Our Team</h2>

//               <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-[980px] mx-auto items-start">
//                 <div className="team-card">
//                   <div className="team-photo">Photo 1</div>
//                   <div className="mt-8 text-center">
//                     <h3 className="team-name text-[#1f78b8]">
//                       Semahegn Tilahun
//                     </h3>
//                     <p className="team-role text-[#1f78b8]">SE, Operator</p>
//                   </div>
//                 </div>

//                 <div className="team-card team-card-featured">
//                   <div className="team-photo">Photo 2</div>
//                   <div className="mt-8 text-center">
//                     <h3 className="team-name text-white">
//                       Fekadessilassie Ayana
//                     </h3>
//                     <p className="team-role text-white">
//                       CEO, Architecture Engineer{" "}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="team-card">
//                   <div className="team-photo">Photo 3</div>
//                   <div className="mt-8 text-center">
//                     <h3 className="team-name text-[#1f78b8]">
//                       Betelhem Yigzaw
//                     </h3>
//                     <p className="team-role text-[#1f78b8]">
//                       SE, Graphics Designer
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8 flex items-center justify-center gap-2">
//                 <span className="dot-small" />
//                 <span className="dot-small" />
//                 <span className="dot-active" />
//                 <span className="dot-small" />
//                 <span className="dot-small" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* COLLEGUES */}
//         <section
//           id="collegues"
//           className="relative overflow-hidden bg-[#f7fbfc] py-12 md:py-20 scroll-mt-20"
//         >
//           <div className="relative z-10 max-w-[980px] mx-auto px-4">
//             <h2 className="section-title-blue">Collegues</h2>

//             <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-start">
//               <div className="team-card">
//                 <div className="team-photo">Logo 1</div>
//                 <div className="mt-8 text-center">
//                   <h3 className="team-name text-[#1f78b8]">Kaba Transport</h3>
//                 </div>
//               </div>

//               <div className="team-card team-card-featured">
//                 <div className="team-photo">Logo 2</div>
//                 <div className="mt-8 text-center">
//                   <h3 className="team-name text-white">Ethio telecom</h3>
//                 </div>
//               </div>

//               <div className="team-card">
//                 <div className="team-photo">Logo 3</div>
//                 <div className="mt-8 text-center">
//                   <h3 className="team-name text-[#1f78b8]">Felek Leather</h3>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex items-center justify-center gap-2">
//               <span className="dot-small" />
//               <span className="dot-small" />
//               <span className="dot-active" />
//               <span className="dot-small" />
//               <span className="dot-small" />
//             </div>
//           </div>
//         </section>

//         {/* CONTACT */}
//         <section
//           id="contact"
//           className="relative overflow-hidden bg-[#f7fbfc] py-12 md:py-20 scroll-mt-20"
//         >
//           <div className="relative z-10 max-w-[1280px] mx-auto px-3 md:px-6">
//             <h2 className="section-title-blue">Contact us</h2>

//             <div className="contact-wrap mt-10 md:mt-14">
//               <div className="contact-grid">
//                 <div className="contact-labels">
//                   <div className="contact-label">Name</div>
//                   <div className="contact-label">E-mail</div>
//                   <div className="contact-label">Message</div>
//                 </div>

//                 <form className="contact-form">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//                     <div>
//                       <label className="contact-mini-label">First Name</label>
//                       <input type="text" className="contact-input" />
//                     </div>

//                     <div>
//                       <label className="contact-mini-label">Last Name</label>
//                       <input type="text" className="contact-input" />
//                     </div>
//                   </div>

//                   <div className="mt-4">
//                     <input type="email" className="contact-input" />
//                   </div>

//                   <div className="mt-4">
//                     <textarea rows="6" className="contact-textarea" />
//                   </div>

//                   <div className="mt-4 flex justify-end">
//                     <button type="submit" className="contact-submit">
//                       submit
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* FOOTER */}
//         <footer className="footer-main">
//           <div className="footer-inner">
//             <div className="footer-brand">
//               <div className="footer-logo-box">
//                 <div className="footer-logo-text">azael</div>
//               </div>
//             </div>

//             <div className="footer-cols">
//               <div>
//                 <h4 className="footer-title">Home</h4>
//                 <ul className="footer-list">
//                   <li>
//                     <button
//                       onClick={() =>
//                         window.scrollTo({ top: 0, behavior: "smooth" })
//                       }
//                     >
//                       Home
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() =>
//                         document
//                           .getElementById("services")
//                           ?.scrollIntoView({ behavior: "smooth" })
//                       }
//                     >
//                       Services
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() =>
//                         document
//                           .getElementById("about")
//                           ?.scrollIntoView({ behavior: "smooth" })
//                       }
//                     >
//                       About US
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() =>
//                         document
//                           .getElementById("contact")
//                           ?.scrollIntoView({ behavior: "smooth" })
//                       }
//                     >
//                       Contact US
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="footer-title">Resources</h4>
//                 <ul className="footer-list">
//                   <li>Legitimate</li>
//                   <li>Address</li>
//                   <li>Careers</li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="footer-title">Company</h4>
//                 <ul className="footer-list">
//                   <li>Certificates</li>
//                   <li>Collegues</li>
//                   <li>Satisfied Customers</li>
//                 </ul>
//               </div>

//               <div>
//                 <h4 className="footer-title">Rate Us</h4>
//                 <ul className="footer-list">
//                   <li>Who we are?</li>
//                   <li>More</li>
//                   <li>Co-businesses</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="footer-bottom">
//             Powered by . Mulutilacodecamp . ChatGpt
//           </div>

//           <button
//             type="button"
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="footer-top-btn"
//           >
//             TOP
//           </button>
//         </footer>
//       </>
//       ;
//     </div>
//   );
// }
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

  return (
    <div className="bg-white text-slate-900 overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={bgvideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-slate-950/55 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/35 to-slate-950/65 z-[1]" />

        <div className="absolute inset-0 z-[2] pointer-events-none">
          <img
            src={heroHover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 md:opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs md:text-sm text-white/90 shadow-lg">
            Premium Printing Studio
          </div>

          <h1 className="mt-6 text-white text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            High Quality Printing.
            <span className="block text-white/90">Fast Delivery.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-lg text-white/80 leading-7">
            UV Printing • Large Format • DTF • Branding • Corporate Materials
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="#"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-bold shadow-[0_12px_30px_rgba(22,131,215,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(22,131,215,0.45)]"
            >
              + Follow Us
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-[#1683d7] text-sm md:text-base font-medium shadow-[0_12px_30px_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="relative overflow-hidden bg-[#f5fafc] py-16 md:py-24 scroll-mt-20"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[10%] -top-[26rem] w-[90rem] h-[90rem] rounded-full border-[42px] border-[#1f78b8] opacity-95" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-16 w-[20rem] md:w-[34rem] h-[10rem] md:h-[19rem] bg-[#1f78b8] rounded-b-[10rem] md:rounded-b-[18rem]" />
          <div className="absolute left-1/2 -translate-x-1/2 top-24 md:top-28 w-24 md:w-40 h-24 md:h-40 rounded-t-full rounded-bl-full rounded-br-none bg-[#8fc0df]/50" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h2 className="text-center text-white text-3xl md:text-5xl font-semibold tracking-tight">
            About Us
          </h2>

          <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 items-start">
            <div className="flex justify-start">
              <div className="about-pill-modern">
                <span>Vision</span>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="about-pill-modern about-pill-modern-center">
                <span>Values</span>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="about-pill-modern">
                <span>Mission</span>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-8 md:mt-10 text-center">
            <p className="text-slate-800 text-sm sm:text-base md:text-lg leading-7 md:leading-8 font-normal">
              We provide reliable, high-quality printing solutions for
              businesses, brands, and organizations that need professional
              results, strong visual identity, and fast turnaround. From design
              to production and delivery, we focus on quality, consistency, and
              trust.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES + TEAM */}
      <section
        id="services-team"
        className="relative overflow-hidden bg-[#eef6f8] py-16 md:py-24 scroll-mt-20"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-[8%] -top-[16rem] w-[92rem] h-[92rem] rounded-full border-[36px] border-[#d9e9ee]" />
          <div className="absolute left-1/2 -translate-x-1/2 top-28 w-[72rem] h-[72rem] rounded-full bg-white" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[25rem] w-[20rem] md:w-[34rem] h-[20rem] md:h-[34rem] rounded-full bg-[#d8e6ea]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <div id="services">
            <h2 className="text-center text-[#1777bd] text-3xl md:text-5xl font-semibold tracking-tight">
              Our Services
            </h2>

            <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                {
                  title: "Branding",
                  text: "Professional branding materials that help your business stand out with consistent, high-quality identity across every touchpoint.",
                },
                {
                  title: "Design",
                  text: "Clean, strategic, and production-ready design solutions for print, packaging, corporate materials, and promotion.",
                },
                {
                  title: "Print",
                  text: "Premium print output across UV, large format, DTF, and custom production with reliable finish and detail.",
                },
                {
                  title: "Delivery",
                  text: "Fast, organized, and dependable delivery workflow so finished work reaches clients safely and on time.",
                },
              ].map((item) => (
                <div key={item.title} className="modern-service-card">
                  <h3 className="modern-service-title">{item.title}</h3>
                  <p className="modern-service-text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="team" className="mt-16 md:mt-24">
            <h2 className="text-center text-[#1777bd] text-3xl md:text-5xl font-semibold tracking-tight">
              Our Team
            </h2>

            <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
              <div className="modern-team-card">
                <div className="modern-team-photo">Photo 1</div>
                <div className="mt-7 text-center">
                  <h3 className="modern-team-name text-[#1f78b8]">
                    Semahegn Tilahun
                  </h3>
                  <p className="modern-team-role text-[#1f78b8]">
                    SE, Operator
                  </p>
                </div>
              </div>

              <div className="modern-team-card modern-team-card-featured">
                <div className="modern-team-photo">Photo 2</div>
                <div className="mt-7 text-center">
                  <h3 className="modern-team-name text-white">
                    Fekadessilassie Ayana
                  </h3>
                  <p className="modern-team-role text-white">
                    CEO, Architecture Engineer
                  </p>
                </div>
              </div>

              <div className="modern-team-card">
                <div className="modern-team-photo">Photo 3</div>
                <div className="mt-7 text-center">
                  <h3 className="modern-team-name text-[#1f78b8]">
                    Betelhem Yigzaw
                  </h3>
                  <p className="modern-team-role text-[#1f78b8]">
                    SE, Graphics Designer
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2">
              <span className="modern-dot" />
              <span className="modern-dot" />
              <span className="modern-dot modern-dot-active" />
              <span className="modern-dot" />
              <span className="modern-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* COLLEAGUES */}
      <section
        id="collegues"
        className="relative overflow-hidden bg-[#f8fcfd] py-16 md:py-24 scroll-mt-20"
      >
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-center text-[#1777bd] text-3xl md:text-5xl font-semibold tracking-tight">
            Collegues
          </h2>

          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            <div className="modern-team-card">
              <div className="modern-team-photo">Logo 1</div>
              <div className="mt-7 text-center">
                <h3 className="modern-team-name text-[#1f78b8]">
                  Kaba Transport
                </h3>
              </div>
            </div>

            <div className="modern-team-card modern-team-card-featured">
              <div className="modern-team-photo">Logo 2</div>
              <div className="mt-7 text-center">
                <h3 className="modern-team-name text-white">Ethio telecom</h3>
              </div>
            </div>

            <div className="modern-team-card">
              <div className="modern-team-photo">Logo 3</div>
              <div className="mt-7 text-center">
                <h3 className="modern-team-name text-[#1f78b8]">
                  Felek Leather
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <span className="modern-dot" />
            <span className="modern-dot" />
            <span className="modern-dot modern-dot-active" />
            <span className="modern-dot" />
            <span className="modern-dot" />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative overflow-hidden bg-[#f8fcfd] py-16 md:py-24 scroll-mt-20"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-center text-[#1777bd] text-3xl md:text-5xl font-semibold tracking-tight">
            Contact Us
          </h2>

          <div className="mt-10 md:mt-14 rounded-[2rem] md:rounded-[2.5rem] border border-[#85b8dd] bg-[#dce9ed] shadow-[0_20px_45px_rgba(31,120,184,0.08)] p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8">
              <div className="space-y-8 md:space-y-10 pt-1">
                <div className="text-[#3f8fc9] text-xl md:text-3xl font-semibold">
                  Name
                </div>
                <div className="text-[#3f8fc9] text-xl md:text-3xl font-semibold">
                  E-mail
                </div>
                <div className="text-[#3f8fc9] text-xl md:text-3xl font-semibold">
                  Message
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <label className="block mb-2 text-[#3f8fc9] text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-lg border border-[#69a9d8] bg-[#e6f0f3] px-4 outline-none transition-all duration-300 focus:bg-white focus:shadow-[0_10px_24px_rgba(31,120,184,0.12)]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-[#3f8fc9] text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 rounded-lg border border-[#69a9d8] bg-[#e6f0f3] px-4 outline-none transition-all duration-300 focus:bg-white focus:shadow-[0_10px_24px_rgba(31,120,184,0.12)]"
                    />
                  </div>
                </div>

                <input
                  type="email"
                  className="w-full h-12 rounded-lg border border-[#69a9d8] bg-[#e6f0f3] px-4 outline-none transition-all duration-300 focus:bg-white focus:shadow-[0_10px_24px_rgba(31,120,184,0.12)]"
                />

                <textarea
                  rows="6"
                  className="w-full rounded-lg border border-[#69a9d8] bg-[#e6f0f3] px-4 py-3 outline-none resize-none transition-all duration-300 focus:bg-white focus:shadow-[0_10px_24px_rgba(31,120,184,0.12)]"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center min-w-[160px] h-12 rounded-xl bg-[#1f78b8] text-white text-lg font-medium shadow-[0_12px_24px_rgba(31,120,184,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#166da9]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#1f78b8] text-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-[78px] h-[130px] rounded-2xl border-[3px] border-white flex items-center justify-center">
              <div className="text-[38px] font-semibold leading-none writing-mode-vertical rotate-180">
                azael
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-8 h-8 rounded-full border-[3px] border-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg md:text-xl font-semibold mb-3">Home</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("services")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg md:text-xl font-semibold mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>Legitimate</li>
                <li>Address</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg md:text-xl font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>Certificates</li>
                <li>Collegues</li>
                <li>Satisfied Customers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg md:text-xl font-semibold mb-3">Rate Us</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>Who we are?</li>
                <li>More</li>
                <li>Co-businesses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 text-center text-xs md:text-sm text-white/85">
          Powered by . Mulutilacodecamp . ChatGpt
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-[#d7ebf7] text-[#1f78b8] text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1"
        >
          TOP
        </button>
      </footer>
    </div>
  );
}
