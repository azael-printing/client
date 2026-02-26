import { useState } from "react";

export default function Feedback() {
  const [form, setForm] = useState({ name: "", rating: "5", feedback: "" });
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Feedback
      </h2>

      <form
        onSubmit={onSubmit}
        className="mt-6 border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm"
      >
        <div className="space-y-3">
          <input
            className="w-full p-3 rounded-xl border border-zinc-200"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
          />
          <select
            className="w-full p-3 rounded-xl border border-zinc-200"
            value={form.rating}
            onChange={(e) => setForm((v) => ({ ...v, rating: e.target.value }))}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Bad</option>
            <option value="1">1 - Terrible</option>
          </select>
          <textarea
            className="w-full p-3 rounded-xl border border-zinc-200 min-h-[120px]"
            placeholder="Your feedback"
            value={form.feedback}
            onChange={(e) =>
              setForm((v) => ({ ...v, feedback: e.target.value }))
            }
          />
        </div>

        <button className="mt-4 w-full p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition">
          Send Feedback
        </button>

        {sent && (
          <div className="mt-3 text-sm text-success font-semibold">
            Thanks. Feedback submitted.
          </div>
        )}
      </form>
    </div>
  );
}
