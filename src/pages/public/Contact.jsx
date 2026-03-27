import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    // You’ll wire this to backend later. For now it validates + UX works.
    setSent(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Contact Us
      </h2>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={onSubmit}
          className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm"
        >
          <div className="font-extrabold text-primary">Send a message</div>

          <div className="mt-4 space-y-3">
            <input
              className="w-full p-3 rounded-xl border border-zinc-200"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl border border-zinc-200"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((v) => ({ ...v, phone: e.target.value }))
              }
            />
            <textarea
              className="w-full p-3 rounded-xl border border-zinc-200 min-h-[120px]"
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm((v) => ({ ...v, message: e.target.value }))
              }
            />
          </div>

          <button className="mt-4 w-full p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition">
            Submit
          </button>

          {sent && (
            <div className="mt-3 text-sm text-success font-semibold">
              Message submitted.
            </div>
          )}
        </form>

        <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm">
          <div className="font-extrabold text-primary">Our Contact</div>
          <div className="mt-3 text-zinc-700 space-y-2">
            <div>
              <span className="font-bold">Phone:</span> +251 …
            </div>
            <div>
              <span className="font-bold">Email:</span> info@azaelprinting.com
            </div>
            <div>
              <span className="font-bold">Address:</span> Addis Ababa, Ethiopia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useState } from "react";
// import MainNavbar from "../../components/nav/MainNavbar";

// export default function Contact() {
//   const [form, setForm] = useState({ name: "", phone: "", message: "" });
//   const [sent, setSent] = useState(false);

//   function onSubmit(e) {
//     e.preventDefault();
//     setSent(true);
//   }

//   return (
//     <div className="min-h-screen bg-[#f8fcfe] text-slate-900">
//       <MainNavbar />

//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1f44] to-[#1683d7] pt-28 pb-16 md:pt-32 md:pb-20">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
//           <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90">
//             Contact Azael Printing
//           </span>

//           <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
//             Start Your Next Print Job
//             <span className="block text-white/85">
//               with Clear Communication
//             </span>
//           </h2>
//         </div>
//       </section>

//       <section className="max-w-6xl mx-auto px-4 py-12 md:py-14">
//         <div className="grid lg:grid-cols-2 gap-6">
//           <form
//             onSubmit={onSubmit}
//             className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
//           >
//             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
//               ✉
//             </div>
//             <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
//               Send a message
//             </div>

//             <div className="mt-5 space-y-4">
//               <input
//                 className="w-full h-12 rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm((v) => ({ ...v, name: e.target.value }))
//                 }
//               />
//               <input
//                 className="w-full h-12 rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={(e) =>
//                   setForm((v) => ({ ...v, phone: e.target.value }))
//                 }
//               />
//               <textarea
//                 className="w-full min-h-[140px] rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//                 placeholder="Message"
//                 value={form.message}
//                 onChange={(e) =>
//                   setForm((v) => ({ ...v, message: e.target.value }))
//                 }
//               />
//             </div>

//             <button className="mt-5 w-full h-12 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_30px_rgba(22,131,215,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(22,131,215,0.34)]">
//               Submit
//             </button>

//             {sent && (
//               <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
//                 Message submitted.
//               </div>
//             )}
//           </form>

//           <div className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
//             <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
//               ☎
//             </div>
//             <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
//               Our Contact
//             </div>

//             <div className="mt-5 space-y-4">
//               {[
//                 { label: "Phone", value: "+251 …" },
//                 { label: "Email", value: "info@azaelprinting.com" },
//                 { label: "Address", value: "Addis Ababa, Ethiopia" },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className="rounded-2xl bg-[#f8fcfe] border border-slate-200 px-4 py-4"
//                 >
//                   <div className="text-sm font-semibold text-slate-900">
//                     {item.label}
//                   </div>
//                   <div className="mt-1 text-sm md:text-base text-slate-600">
//                     {item.value}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
