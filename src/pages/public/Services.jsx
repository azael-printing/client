export default function Services() {
  const items = [
    "UV Printing",
    "Large Format Printing",
    "DTF Printing",
    "Branding & Stickers",
    "Corporate Materials",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Services
      </h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div
            key={s}
            className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-primary font-extrabold">{s}</div>
            <div className="mt-2 text-sm text-zinc-600">
              Professional output, consistent quality, fast turnaround.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// import MainNavbar from "../../components/nav/MainNavbar";

// export default function Services() {
//   const items = [
//     "UV Printing",
//     "Large Format Printing",
//     "DTF Printing",
//     "Branding & Stickers",
//     "Corporate Materials",
//   ];

//   return (
//     <div className="min-h-screen bg-[#f8fcfe] text-slate-900">
//       <MainNavbar />

//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1f44] to-[#1683d7] pt-28 pb-16 md:pt-32 md:pb-20">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
//           <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90">
//             Our Services
//           </span>

//           <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
//             Quality Print Solutions
//             <span className="block text-white/85">That Look Professional</span>
//           </h2>

//           <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/75 leading-7">
//             Reliable execution, clean output, and production support that helps
//             your brand look serious.
//           </p>
//         </div>
//       </section>

//       <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-14">
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {items.map((s, index) => (
//             <div
//               key={s}
//               className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_26px_60px_rgba(22,131,215,0.12)]"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] font-bold">
//                   0{index + 1}
//                 </div>
//                 <div className="h-10 w-10 rounded-2xl bg-[#f8fcfe] shadow-sm flex items-center justify-center text-[#1683d7] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
//                   →
//                 </div>
//               </div>

//               <div className="mt-5 text-xl font-semibold text-slate-900">
//                 {s}
//               </div>
//               <div className="mt-3 text-sm md:text-base text-slate-600 leading-7">
//                 Professional output, consistent quality, fast turnaround.
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
