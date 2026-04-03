export default function FinanceStatCard({ title, value, subtitle, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
    >
      <div className="text-[13px] font-semibold text-zinc-500">{title}</div>
      <div className="mt-2 text-[28px] font-semibold leading-none text-primary">
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-400">{subtitle}</div>
    </Tag>
  );
}
