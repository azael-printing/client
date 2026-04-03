export default function FinanceSectionCard({ title, subtitle, action, className = "", children }) {
  return (
    <div
      className={`rounded-[24px] border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/15 hover:shadow-md ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-semibold leading-none text-primary">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm font-semibold text-zinc-500">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
