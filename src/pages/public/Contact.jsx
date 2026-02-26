import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    // You’ll wire this to backend later. For now it validates + UX works.
    setSent(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900">
        Contact Us
      </h2>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <form
          onSubmit={onSubmit}
          className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm"
        >
          <div className="font-extrabold text-primary">Send a message</div>

          <div className="mt-4 space-y-3">
            <input
              className="w-full p-3 rounded-xl border border-zinc-200"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl border border-zinc-200"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((v) => ({ ...v, phone: e.target.value }))
              }
            />
            <textarea
              className="w-full p-3 rounded-xl border border-zinc-200 min-h-[120px]"
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm((v) => ({ ...v, message: e.target.value }))
              }
            />
          </div>

          <button className="mt-4 w-full p-3 rounded-xl bg-primary text-white font-extrabold hover:opacity-90 transition">
            Submit
          </button>

          {sent && (
            <div className="mt-3 text-sm text-success font-semibold">
              Message submitted.
            </div>
          )}
        </form>

        <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm">
          <div className="font-extrabold text-primary">Our Contact</div>
          <div className="mt-3 text-zinc-700 space-y-2">
            <div>
              <span className="font-bold">Phone:</span> +251 …
            </div>
            <div>
              <span className="font-bold">Email:</span> info@azaelprinting.com
            </div>
            <div>
              <span className="font-bold">Address:</span> Addis Ababa, Ethiopia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
