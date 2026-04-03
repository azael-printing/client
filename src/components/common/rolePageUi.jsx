export const rolePageCardClass =
  "min-w-0 rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/15 hover:shadow-md";

export const roleTableWrapClass =
  "mt-5 overflow-auto rounded-2xl border border-zinc-200 bg-white";

export const roleTableClass =
  "min-w-[1080px] w-full table-fixed text-sm";

export const roleTheadClass =
  "bg-bgLight text-left text-zinc-500";

export const roleThClass =
  "px-4 py-3 text-[13px] font-semibold whitespace-nowrap";

export const roleTdClass =
  "px-4 py-3 text-[13px] font-semibold text-zinc-800 whitespace-nowrap";

export const roleTitleClass =
  "text-[26px] leading-none text-primary font-semibold";

export const roleSubtitleClass =
  "mt-1 text-sm font-semibold text-zinc-500";

export function roleActionClass(tone = "outline") {
  const map = {
    primary:
      "bg-primary text-white border-primary hover:-translate-y-0.5 hover:shadow-md hover:opacity-95",
    outline:
      "bg-white text-primary border-primary/25 hover:-translate-y-0.5 hover:shadow-sm hover:bg-bgLight",
    neutral:
      "bg-bgLight text-primary border-transparent hover:-translate-y-0.5 hover:shadow-sm",
    danger:
      "bg-white text-red-600 border-red-300 hover:-translate-y-0.5 hover:shadow-sm hover:bg-red-50",
  };

  return [
    "inline-flex items-center justify-center rounded-2xl border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300",
    map[tone] || map.outline,
  ].join(" ");
}

export function RoleStatCard({ title, value, sub, onClick }) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className="w-full min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
    >
      <div className="text-[13px] font-semibold text-zinc-500">{title}</div>
      <div className="mt-2 text-[28px] font-semibold leading-none text-primary">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-400">{sub}</div>
    </Tag>
  );
}
