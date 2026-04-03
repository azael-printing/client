export default function FinanceSectionCard({ title, subtitle, action, className = "", children }) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/10 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-primary text-[30px] font-extrabold leading-none">{title}</h2>
          {subtitle ? <p className="mt-1 text-zinc-500 font-semibold text-sm">{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </div>
  );
}
