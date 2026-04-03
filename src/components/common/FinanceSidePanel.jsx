export default function FinanceSidePanel({ title, subtitle, className = "", children }) {
  return (
    <aside
      className={[
        "self-start rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/15 hover:shadow-md lg:sticky lg:top-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? <h3 className="text-[18px] font-semibold text-primary">{title}</h3> : null}
      {subtitle ? <p className="mt-1 text-sm font-semibold text-zinc-500">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </aside>
  );
}
