export const workPageCardClass =
  "bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20";

export const workTableWrapClass =
  "mt-4 overflow-auto rounded-2xl border border-zinc-200";

export const workTableClass =
  "min-w-[1160px] w-full table-fixed text-sm";

export const workTheadClass =
  "bg-bgLight text-left text-zinc-500";

export const workThClass =
  "px-4 py-3 text-[13px] font-semibold whitespace-nowrap";

export const workTdClass =
  "px-4 py-3 text-[13px] font-semibold text-zinc-800 whitespace-nowrap";

export const workRowClass =
  "border-t border-zinc-200 cursor-pointer transition-colors hover:bg-zinc-50";

export const selectedRowClass = "bg-bgLight";

export function actionBtnClass(tone = "primary", wide = false) {
  const tones = {
    primary: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    neutral: "bg-bgLight text-primary",
    done: "bg-green-100 text-green-700",
  };

  return [
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
    wide ? "min-w-[150px]" : "min-w-[132px]",
    tones[tone] || tones.primary,
  ].join(" ");
}
