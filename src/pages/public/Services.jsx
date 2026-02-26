export default function Services() {
  const items = [
    "UV Printing",
    "Large Format Printing",
    "DTF Printing",
    "Branding & Stickers",
    "Corporate Materials",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Services
      </h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div
            key={s}
            className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="text-primary font-extrabold">{s}</div>
            <div className="mt-2 text-sm text-zinc-600">
              Professional output, consistent quality, fast turnaround.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
