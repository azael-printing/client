export default function FinanceStatCard({ title, value, subtitle, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className="w-full text-left bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20"
    >
      <div className="text-zinc-900 font-extrabold text-[16px] leading-tight">{title}</div>
      <div className="mt-2 text-primary font-extrabold text-[30px] leading-none tracking-tight">{value}</div>
      <div className="mt-2 text-zinc-500 font-semibold text-sm">{subtitle}</div>
    </Tag>
  );
}
