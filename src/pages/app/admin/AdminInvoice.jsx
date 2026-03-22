import { useMemo, useState } from "react";
import logo from "../../../assets/logo.png";

function onlyNumberLike(v) {
  return String(v || "").replace(/[^\d.]/g, "");
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString();
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function DetailRow({ label, value, bold = false }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 text-[12px]">
      <div className="font-semibold text-zinc-600">{label}</div>
      <div
        className={
          bold ? "font-bold text-zinc-900" : "font-medium text-zinc-800"
        }
      >
        {value || "-"}
      </div>
    </div>
  );
}

export default function AdminInvoice() {
  const [f, setF] = useState({
    customerName: "",
    tin: "",
    description: "",
    quantity: "",
    unitType: "pcs",
    unitPrice: "",
    deliveryDate: todayISO(),
  });

  const [items, setItems] = useState([]);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  function addItem() {
    if (!f.customerName.trim()) return alert("Customer name is required");
    if (!f.description.trim()) return alert("Description is required");
    if (!f.quantity || Number(f.quantity) <= 0)
      return alert("Quantity must be greater than 0");
    if (!f.unitPrice || Number(f.unitPrice) < 0)
      return alert("Unit price is required");

    const row = {
      id: crypto.randomUUID(),
      description: f.description,
      quantity: Number(f.quantity || 0),
      unitType: f.unitType,
      unitPrice: Number(f.unitPrice || 0),
      total: Number(f.quantity || 0) * Number(f.unitPrice || 0),
      deliveryDate: f.deliveryDate,
    };

    setItems((p) => [...p, row]);
  }

  function addNew() {
    addItem();
    setF((p) => ({
      ...p,
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
    }));
  }

  function clearForm() {
    setF({
      customerName: "",
      tin: "",
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
      deliveryDate: todayISO(),
    });
    setItems([]);
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, x) => s + Number(x.total || 0), 0);
    const vat = subtotal * 0.15;
    const grandTotal = subtotal + vat;
    return { subtotal, vat, grandTotal };
  }, [items]);

  function printPdf() {
    window.print();
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-root, .print-root * {
            visibility: visible;
          }
          .print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_470px]">
        {/* LEFT FORM */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm no-print">
          <div>
            <div className="text-primary text-lg sm:text-xl font-bold">
              Pricing Quotation
            </div>
            <div className="text-zinc-400 text-xs sm:text-sm font-semibold mt-1">
              Generate Invoice
            </div>
          </div>

          <div className="mt-5">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Customer Info
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                  Customer name
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={f.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                  TIN
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={f.tin}
                  onChange={(e) =>
                    update("tin", onlyNumberLike(e.target.value))
                  }
                  placeholder="TIN number"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Job Description
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                  Description
                </div>
                <textarea
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[100px] text-sm"
                  value={f.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the job"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                    Quantity
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    value={f.quantity}
                    onChange={(e) =>
                      update("quantity", onlyNumberLike(e.target.value))
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                    Unit Type
                  </div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
                    value={f.unitType}
                    onChange={(e) => update("unitType", e.target.value)}
                  >
                    <option value="pcs">pcs</option>
                    <option value="sqm">sqm</option>
                    <option value="meter">meter</option>
                    <option value="box">box</option>
                    <option value="set">set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                    Unit Price
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    value={f.unitPrice}
                    onChange={(e) =>
                      update("unitPrice", onlyNumberLike(e.target.value))
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-semibold text-zinc-700 mb-1">
                    Delivery date
                  </div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm"
                    value={f.deliveryDate}
                    onChange={(e) => update("deliveryDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={addNew}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Add new
            </button>

            <button
              onClick={addItem}
              className="px-4 py-2.5 rounded-xl bg-success text-white text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Add
            </button>

            <button
              onClick={clearForm}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-xs sm:text-sm font-bold transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="print-root bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="no-print flex items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-primary text-lg sm:text-xl font-bold">
                Preview
              </div>
              <div className="text-zinc-400 text-xs sm:text-sm font-semibold">
                Printable Invoice
              </div>
            </div>

            <button
              onClick={printPdf}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Print / Export PDF
            </button>
          </div>

          <div className="mx-auto w-full max-w-[794px] min-h-[1123px] bg-white border border-zinc-300 rounded-xl p-8">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-300 pb-5">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Azael Printing" className="h-14 w-auto" />
                <div>
                  <div className="text-primary text-2xl font-extrabold leading-tight">
                    Azael Printing
                  </div>
                  <div className="text-zinc-500 text-xs font-semibold">
                    High Quality Printing & Branding Solutions
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-primary uppercase">
                  Invoice
                </div>
                <div className="mt-2 text-[12px] text-zinc-600 font-medium">
                  Invoice No: INV-{todayISO().replaceAll("-", "")}
                </div>
                <div className="text-[12px] text-zinc-600 font-medium">
                  Date: {todayISO()}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <DetailRow label="Customer Name" value={f.customerName} bold />
                <DetailRow label="TIN" value={f.tin} />
              </div>

              <div className="grid gap-2">
                <DetailRow label="Prepared By" value="Azael Printing" />
                <DetailRow label="Delivery Date" value={f.deliveryDate} />
              </div>
            </div>

            <div className="mt-8">
              <table className="w-full border border-zinc-300 text-sm">
                <thead>
                  <tr className="bg-bgLight">
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      No
                    </th>
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      Description
                    </th>
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      Qty
                    </th>
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      Unit
                    </th>
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      Unit Price
                    </th>
                    <th className="border border-zinc-300 px-3 py-2 text-left">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((x, i) => (
                      <tr key={x.id}>
                        <td className="border border-zinc-300 px-3 py-2">
                          {i + 1}
                        </td>
                        <td className="border border-zinc-300 px-3 py-2">
                          {x.description}
                        </td>
                        <td className="border border-zinc-300 px-3 py-2">
                          {x.quantity}
                        </td>
                        <td className="border border-zinc-300 px-3 py-2">
                          {x.unitType}
                        </td>
                        <td className="border border-zinc-300 px-3 py-2">
                          ETB {formatMoney(x.unitPrice)}
                        </td>
                        <td className="border border-zinc-300 px-3 py-2 font-semibold">
                          ETB {formatMoney(x.total)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="border border-zinc-300 px-3 py-10 text-center text-zinc-400 font-semibold"
                      >
                        No item added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-[320px] border border-zinc-300 rounded-lg overflow-hidden text-sm">
                <div className="flex justify-between px-4 py-3 bg-white">
                  <span className="font-semibold text-zinc-600">Subtotal</span>
                  <span className="font-bold text-zinc-900">
                    ETB {formatMoney(totals.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-bgLight">
                  <span className="font-semibold text-zinc-600">VAT (15%)</span>
                  <span className="font-bold text-zinc-900">
                    ETB {formatMoney(totals.vat)}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 bg-primary/5">
                  <span className="font-extrabold text-primary">
                    Grand Total
                  </span>
                  <span className="font-extrabold text-primary">
                    ETB {formatMoney(totals.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-[12px] text-zinc-600 leading-6">
              <div className="font-bold text-zinc-800 mb-1">Payment Note</div>
              <div>
                1. Please verify all invoice details before final confirmation.
              </div>
              <div>2. VAT is included at the applicable rate.</div>
              <div>3. Thank you for choosing Azael Printing.</div>
            </div>

            <div className="mt-16 flex items-end justify-between">
              <div>
                <div className="w-[180px] border-t border-zinc-500 pt-2 text-[12px] font-semibold text-zinc-700">
                  Authorized Signature
                </div>
              </div>

              <div className="relative w-[130px] h-[130px]">
                <div className="absolute inset-0 rounded-full border-[4px] border-primary/70 flex items-center justify-center rotate-[-12deg]">
                  <div className="w-[92px] h-[92px] rounded-full border-2 border-primary/50 flex items-center justify-center text-center px-2">
                    <div className="text-[11px] leading-tight font-extrabold text-primary">
                      AZAEL
                      <br />
                      PRINTING
                      <br />
                      OFFICIAL SEAL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-4 border-t border-zinc-300 text-[11px] text-zinc-500 flex justify-between gap-4">
              <div>Addis Ababa, Ethiopia</div>
              <div>Azael Printing</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
