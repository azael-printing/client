export default function Values() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-extrabold text-primary">Value</h3>
      <ul className="mt-3 list-disc pl-5 text-zinc-700 space-y-1">
        <li>Quality</li>
        <li>Speed</li>
        <li>Trust</li>
        <li>Clear communication</li>
      </ul>
    </div>
  );
}
// export default function Values() {
//   return (
//     <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 md:p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(22,131,215,0.14)]">
//       <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1683d7]/10 text-[#1683d7] text-lg font-bold">
//         V
//       </div>
//       <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
//         Values
//       </h3>

//       <ul className="mt-4 space-y-3">
//         {["Quality", "Speed", "Trust", "Clear communication"].map((item) => (
//           <li
//             key={item}
//             className="flex items-start gap-3 rounded-2xl bg-[#f8fcfe] px-4 py-4 text-sm md:text-base text-slate-700"
//           >
//             <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1683d7] text-xs font-bold text-white">
//               ✓
//             </span>
//             <span>{item}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
