// import { Link, NavLink } from "react-router-dom";
// import Logo from "../../assets/logo.png";
// import { useState } from "react";

// const linkClass = ({ isActive }) =>
//   `px-3 py-2 rounded-xl text-sm font-semibold transition
//    ${isActive ? "text-primary bg-bgLight" : "text-zinc-700 hover:text-primary hover:bg-bgLight"}`;

// export default function TopNav() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-zinc-200">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-2">
//           <img src={Logo} alt="Azael Printing" className="h-10" />
//         </Link>

//         <button
//           className="md:hidden px-3 py-2 rounded-xl border border-zinc-200 text-sm"
//           onClick={() => setOpen((v) => !v)}
//         >
//           Menu
//         </button>

//         <nav className="hidden md:flex items-center gap-2">
//           <NavLink to="/" className={linkClass}>
//             Home
//           </NavLink>

//           <div className="relative group">
//             <NavLink to="/about" className={linkClass}>
//               About Us
//             </NavLink>
//             <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
//               <div className="w-56 bg-white border border-zinc-200 rounded-2xl shadow-lg p-2">
//                 <NavLink to="/about/vision" className={linkClass}>
//                   Vision
//                 </NavLink>
//                 <NavLink to="/about/mission" className={linkClass}>
//                   Mission
//                 </NavLink>
//                 <NavLink to="/about/values" className={linkClass}>
//                   Value
//                 </NavLink>
//               </div>
//             </div>
//           </div>

//           <NavLink to="/services" className={linkClass}>
//             Service
//           </NavLink>
//           <NavLink to="/management" className={linkClass}>
//             Management
//           </NavLink>
//           <NavLink to="/contact" className={linkClass}>
//             Contact Us
//           </NavLink>
//           <NavLink to="/feedback" className={linkClass}>
//             Feedback
//           </NavLink>
//         </nav>
//       </div>

//       {open && (
//         <div className="md:hidden border-t border-zinc-200 bg-white">
//           <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
//             <NavLink
//               to="/"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Home
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               About Us
//             </NavLink>
//             <NavLink
//               to="/about/vision"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Vision
//             </NavLink>
//             <NavLink
//               to="/about/mission"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Mission
//             </NavLink>
//             <NavLink
//               to="/about/values"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Value
//             </NavLink>
//             <NavLink
//               to="/services"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Service
//             </NavLink>
//             <NavLink
//               to="/management"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Management
//             </NavLink>
//             <NavLink
//               to="/contact"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Contact Us
//             </NavLink>
//             <NavLink
//               to="/feedback"
//               className={linkClass}
//               onClick={() => setOpen(false)}
//             >
//               Feedback
//             </NavLink>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { useState } from "react";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
    isActive
      ? "text-[#1074B8] bg-[#F3FAFE]"
      : "text-zinc-700 hover:text-[#1074B8] hover:bg-[#F3FAFE]"
  }`;

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F3FAFE]/92 backdrop-blur-xl border-b border-[#D9ECF7]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Azael Printing" className="h-10 w-auto" />
          <div className="hidden sm:block">
            <div className="text-[1rem] font-black tracking-tight text-slate-900">
              Azael Printing
            </div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#1074B8]/80 font-semibold">
              Print • Brand • Deliver
            </div>
          </div>
        </Link>

        <button
          className="md:hidden inline-flex items-center justify-center px-3 py-2 rounded-xl border border-[#D9ECF7] bg-white text-sm font-bold text-[#1074B8] shadow-sm"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className="hidden md:flex items-center gap-2 rounded-full border border-[#D9ECF7] bg-white px-2 py-2 shadow-sm">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <div className="relative group">
            <NavLink to="/about" className={linkClass}>
              About Us
            </NavLink>

            <div className="absolute left-0 top-full pt-2 hidden group-hover:block">
              <div className="w-56 bg-white border border-[#D9ECF7] rounded-2xl shadow-lg p-2">
                <NavLink to="/about/vision" className={linkClass}>
                  Vision
                </NavLink>
                <NavLink to="/about/mission" className={linkClass}>
                  Mission
                </NavLink>
                <NavLink to="/about/values" className={linkClass}>
                  Value
                </NavLink>
              </div>
            </div>
          </div>

          <NavLink to="/services" className={linkClass}>
            Service
          </NavLink>
          <NavLink to="/management" className={linkClass}>
            Management
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact Us
          </NavLink>
          <NavLink to="/feedback" className={linkClass}>
            Feedback
          </NavLink>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#D9ECF7] bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/about/vision"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Vision
            </NavLink>
            <NavLink
              to="/about/mission"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Mission
            </NavLink>
            <NavLink
              to="/about/values"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Value
            </NavLink>
            <NavLink
              to="/services"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Service
            </NavLink>
            <NavLink
              to="/management"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Management
            </NavLink>
            <NavLink
              to="/contact"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/feedback"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Feedback
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
