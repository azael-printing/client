import { useState } from "react";

export default function Feedback() {
  const [form, setForm] = useState({ name: "", rating: "5", feedback: "" });
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Feedback
      </h2>

      <form
        onSubmit={onSubmit}
        className="mt-6 border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm"
      >
        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-xl border border-zinc-200"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          />
          <select
            className="w-full p-3 rounded-xl border border-zinc-200"
            value={form.rating}
            onChange={(e) => setForm((v) => ({ ...v, rating: e.target.value }))}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Bad</option>
            <option value="1">1 - Terrible</option>
          </select>
          <textarea
            className="w-full p-3 rounded-xl border border-zinc-200 min-h-[120px]"
            placeholder="Your feedback"
            value={form.feedback}
            onChange={(e) =>
              setForm((v) => ({ ...v, feedback: e.target.value }))
            }
          />
        </div>

        <button className="mt-4 w-full p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition">
          Send Feedback
        </button>

        {sent && (
          <div className="mt-3 text-sm text-success font-semibold">
            Thanks. Feedback submitted.
          </div>
        )}
      </form>
    </div>
  );
}
// import { useState } from "react";
// import MainNavbar from "../../components/nav/MainNavbar";

// export default function Feedback() {
//   const [form, setForm] = useState({ name: "", rating: "5", feedback: "" });
//   const [sent, setSent] = useState(false);

//   function onSubmit(e) {
//     e.preventDefault();
//     setSent(true);
//   }

//   return (
//     <div className="min-h-screen bg-[#f8fcfe] text-slate-900">
//       <MainNavbar />

//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1f44] to-[#1683d7] pt-28 pb-16 md:pt-32 md:pb-20">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
//           <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold text-white/90">
//             Client Feedback
//           </span>

//           <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
//             Tell Us What Worked,
//             <span className="block text-white/85">and What Needs Fixing</span>
//           </h2>
//         </div>
//       </section>

//       <section className="max-w-3xl mx-auto px-4 py-12 md:py-14">
//         <form
//           onSubmit={onSubmit}
//           className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]"
//         >
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
//                 Feedback
//               </h3>
//               <p className="mt-2 text-sm md:text-base text-slate-600">
//                 Your input helps improve our quality, speed, and service flow.
//               </p>
//             </div>
//             <div className="hidden sm:inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
//               ✦
//             </div>
//           </div>

//           <div className="mt-6 space-y-4">
//             <input
//               className="w-full h-12 rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//               placeholder="Name"
//               value={form.name}
//               onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
//             />
//             <select
//               className="w-full h-12 rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 outline-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//               value={form.rating}
//               onChange={(e) =>
//                 setForm((v) => ({ ...v, rating: e.target.value }))
//               }
//             >
//               <option value="5">5 - Excellent</option>
//               <option value="4">4 - Good</option>
//               <option value="3">3 - Okay</option>
//               <option value="2">2 - Bad</option>
//               <option value="1">1 - Terrible</option>
//             </select>
//             <textarea
//               className="w-full min-h-[140px] rounded-2xl border border-slate-200 bg-[#f8fcfe] px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-[#1683d7] focus:bg-white focus:shadow-[0_10px_26px_rgba(22,131,215,0.12)]"
//               placeholder="Your feedback"
//               value={form.feedback}
//               onChange={(e) =>
//                 setForm((v) => ({ ...v, feedback: e.target.value }))
//               }
//             />
//           </div>

//           <button className="mt-5 w-full h-12 rounded-2xl bg-[#1683d7] text-white text-sm md:text-base font-semibold shadow-[0_14px_30px_rgba(22,131,215,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(22,131,215,0.34)]">
//             Send Feedback
//           </button>

//           {sent && (
//             <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
//               Thanks. Feedback submitted.
//             </div>
//           )}
//         </form>
//       </section>
//     </div>
//   );
// }
