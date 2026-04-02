export default function Pagination({ page, totalPages, onChange }) {
  const safeTotal = Math.max(1, Number(totalPages || 1));
  const safePage = Math.min(Math.max(1, Number(page || 1)), safeTotal);

  function build(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, current, current - 1, current + 1]);
    const nums = Array.from(set).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i < nums.length; i += 1) {
      if (i > 0 && nums[i] - nums[i - 1] > 1) out.push("…");
      out.push(nums[i]);
    }
    return out;
  }

  const pages = build(safePage, safeTotal);

  return (
    <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
      <button
        onClick={() => onChange(Math.max(1, safePage - 1))}
        disabled={safePage === 1}
        className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-semibold disabled:text-zinc-400 disabled:bg-zinc-50 transition-all duration-300 enabled:hover:bg-bgLight enabled:hover:-translate-y-0.5"
      >
        Prev
      </button>
      {pages.map((item, idx) => item === "…" ? (
        <span key={`dots-${idx}`} className="px-2 text-zinc-400 font-semibold">…</span>
      ) : (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={[
            "px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
            item === safePage ? "bg-primary text-white border-primary" : "border-zinc-200 hover:bg-bgLight",
          ].join(" ")}
        >
          {item}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(safeTotal, safePage + 1))}
        disabled={safePage === safeTotal}
        className="px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-semibold disabled:text-zinc-400 disabled:bg-zinc-50 transition-all duration-300 enabled:hover:bg-bgLight enabled:hover:-translate-y-0.5"
      >
        Next
      </button>
    </div>
  );
}
