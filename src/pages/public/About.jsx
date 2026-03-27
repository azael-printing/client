import { Outlet, Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        About Us
      </h2>
      <p className="mt-3 text-zinc-700 max-w-3xl">
        Azael Printing delivers premium printing solutions for businesses and
        individuals with modern machines and strict quality control.
      </p>

      <div className="mt-6 flex gap-2 flex-wrap">
        <Link
          to="/about/vision"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Vision
        </Link>
        <Link
          to="/about/mission"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Mission
        </Link>
        <Link
          to="/about/values"
          className="px-4 py-2 rounded-xl bg-bgLight text-primary font-bold hover:opacity-90"
        >
          Value
        </Link>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
// import { Outlet, Link } from "react-router-dom";
// import MainNavbar from "../../components/nav/MainNavbar";

// export default function About() {
//   return (
//     <div className="min-h-screen bg-[#f8fcfe] text-slate-900">
//       <MainNavbar />

//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1f44] to-[#1683d7] pt-28 pb-16 md:pt-32 md:pb-20">
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
//           <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
//           <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90">
//             About Azael Printing
//           </span>

//           <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
//             Built for Better Presentation,
//             <span className="block text-white/85">Quality, and Trust</span>
//           </h2>

//           <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-white/75 leading-7">
//             Azael Printing delivers premium printing solutions for businesses
//             and individuals with modern machines, strong execution, and strict
//             quality control.
//           </p>
//         </div>
//       </section>

//       <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-14">
//         <div className="flex flex-wrap gap-3">
//           <Link
//             to="/about/vision"
//             className="rounded-2xl bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1683d7] shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(22,131,215,0.12)]"
//           >
//             Vision
//           </Link>
//           <Link
//             to="/about/mission"
//             className="rounded-2xl bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1683d7] shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(22,131,215,0.12)]"
//           >
//             Mission
//           </Link>
//           <Link
//             to="/about/values"
//             className="rounded-2xl bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-[#1683d7] shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(22,131,215,0.12)]"
//           >
//             Values
//           </Link>
//         </div>

//         <div className="mt-8">
//           <Outlet />
//         </div>
//       </section>
//     </div>
//   );
// }
