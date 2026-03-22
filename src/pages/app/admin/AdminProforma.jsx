import { useMemo, useState } from "react";
import logo from "../../../assets/logo.png";

function onlyNumberLike(v) {
  return String(v || "").replace(/[^\d.]/g, "");
}

function todayParts() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return { dd, mm, yyyy, iso: `${yyyy}-${mm}-${dd}` };
}

function formatMoney(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toLocaleString() : "0";
}

export default function AdminProforma() {
  const t = todayParts();

  const [f, setF] = useState({
    customerName: "",
    tin: "",
    description: "",
    quantity: "",
    unitType: "pcs",
    unitPrice: "",
    deliveryDate: t.iso,
    proformaNo: "AZ-PR-0001",
    companyTin: "0082555133",
    vatReg: "10989750816",
  });

  const [items, setItems] = useState([]);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  function buildRowFromForm() {
    return {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      description: f.description.trim(),
      qty: Number(f.quantity || 0),
      unitType: f.unitType,
      unitPrice: Number(f.unitPrice || 0),
      totalPrice: Number(f.quantity || 0) * Number(f.unitPrice || 0),
    };
  }

  function addItem() {
    if (!f.customerName.trim()) return alert("Customer name is required");
    if (!f.description.trim()) return alert("Description is required");
    if (!f.quantity || Number(f.quantity) <= 0)
      return alert("Quantity must be greater than 0");
    if (!f.unitPrice || Number(f.unitPrice) < 0)
      return alert("Unit price is required");

    setItems((prev) => [...prev, buildRowFromForm()]);
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
    setF((p) => ({
      ...p,
      customerName: "",
      tin: "",
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
      deliveryDate: t.iso,
    }));
    setItems([]);
  }

  const totals = useMemo(() => {
    const subTotal = items.reduce((s, x) => s + Number(x.totalPrice || 0), 0);
    const vat15 = subTotal * 0.15;
    const total = subTotal + vat15;
    return { subTotal, vat15, total };
  }, [items]);

  const tableRows = useMemo(() => {
    const rowsNeeded = 8;
    const dataRows = items.slice(0, rowsNeeded);
    const empties = Array.from({
      length: Math.max(0, rowsNeeded - dataRows.length),
    }).map((_, i) => ({
      id: `empty-${i}`,
      description: "",
      qty: "",
      unitPrice: "",
      totalPrice: "",
    }));
    return [...dataRows, ...empties];
  }, [items]);

  function printPdf() {
    window.print();
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-root, .print-root * {
            visibility: visible !important;
          }
          .print-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_500px]">
        {/* LEFT FORM */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm no-print min-w-0">
          <div>
            <div className="text-primary text-base sm:text-lg font-bold">
              Pricing Quotation
            </div>
            <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold mt-1">
              Generate Proforma
            </div>
          </div>

          {/* CUSTOMER INFO */}
          <div className="mt-5">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Customer Info
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Customer name
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={f.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  TIN
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={f.tin}
                  onChange={(e) =>
                    update("tin", onlyNumberLike(e.target.value))
                  }
                  placeholder="TIN number"
                />
              </div>
            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div className="mt-6">
            <div className="text-primary text-sm sm:text-base font-bold border-b border-zinc-200 pb-2">
              Job Description
            </div>

            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  Description
                </div>
                <textarea
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[96px] text-xs sm:text-sm"
                  value={f.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the job"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Quantity
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.quantity}
                    onChange={(e) =>
                      update("quantity", onlyNumberLike(e.target.value))
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Unit Type
                  </div>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-xs sm:text-sm"
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
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Unit Price
                  </div>
                  <input
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.unitPrice}
                    onChange={(e) =>
                      update("unitPrice", onlyNumberLike(e.target.value))
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                    Delivery date
                  </div>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                    value={f.deliveryDate}
                    onChange={(e) => update("deliveryDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={addNew}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Add new
            </button>

            <button
              onClick={addItem}
              className="px-4 py-2.5 rounded-xl bg-success text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Add
            </button>

            <button
              onClick={clearForm}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-[11px] sm:text-xs font-bold transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            >
              Clear
            </button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="print-root bg-white border border-zinc-200 rounded-2xl p-2 sm:p-3 shadow-sm min-w-0">
          <div className="no-print flex items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-primary text-base sm:text-lg font-bold">
                Preview
              </div>
              <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold">
                Printable Proforma
              </div>
            </div>

            <button
              onClick={printPdf}
              className="px-4 py-2 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95"
            >
              Print / Export PDF
            </button>
          </div>

          {/* A4 BOARD */}
          <div className="mx-auto w-full max-w-[794px] bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 lg:p-6 text-primary">
            {/* TOP */}
            <div className="grid grid-cols-[170px_1fr] gap-4 items-start">
              {/* LEFT LOGO PANEL */}
              <div className="bg-primary rounded-tr-[42px] rounded-br-[42px] px-4 py-3 min-h-[110px] flex flex-col justify-center">
                <img
                  src={logo}
                  alt="Azael Printing"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
                <div className="mt-2 text-white text-[10px] sm:text-[11px] font-semibold tracking-[1px]">
                  PROFORMA
                </div>
              </div>

              {/* RIGHT META */}
              <div className="pt-3 sm:pt-5 text-right">
                <div className="text-[10px] sm:text-[11px] leading-5 font-semibold">
                  <div>
                    <span className="font-bold">TIN</span>{" "}
                    <span className="ml-2">{f.companyTin}</span>
                  </div>
                  <div>
                    <span className="font-bold">VAT REG</span>{" "}
                    <span className="ml-2">{f.vatReg}</span>
                  </div>
                  <div>
                    <span className="font-bold">PROFORMA NUMBER</span>{" "}
                    <span className="ml-2">{f.proformaNo}</span>
                  </div>
                  <div>
                    <span className="font-bold">DATE</span>{" "}
                    <span className="ml-2">
                      {t.dd}/{t.mm}/{t.yyyy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CUSTOMER LINES */}
            <div className="mt-6 sm:mt-7 text-[10px] sm:text-[11px] font-semibold">
              <div className="grid grid-cols-[132px_1fr] items-center gap-2">
                <div>PRICING QUATATION TO:</div>
                <div className="border-b border-primary h-[14px]">
                  {f.customerName && (
                    <div className="translate-y-[-2px] pl-1 font-bold">
                      {f.customerName}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-[132px_1fr] items-center gap-2">
                <div>TIN:</div>
                <div className="border-b border-primary h-[14px]">
                  {f.tin && (
                    <div className="translate-y-[-2px] pl-1 font-bold">
                      {f.tin}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="mt-6">
              <table className="w-full border-collapse text-[9px] sm:text-[10px] text-primary">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="border border-primary px-1.5 py-1 text-left w-[34px]">
                      NO
                    </th>
                    <th className="border border-primary px-1.5 py-1 text-left">
                      Description
                    </th>
                    <th className="border border-primary px-1.5 py-1 text-center w-[58px]">
                      QTY
                    </th>
                    <th className="border border-primary px-1.5 py-1 text-center w-[78px]">
                      Unit Price
                    </th>
                    <th className="border border-primary px-1.5 py-1 text-center w-[86px]">
                      Total Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="border border-primary h-[28px] px-1.5 align-top">
                        {row.description ? idx + 1 : ""}
                      </td>
                      <td className="border border-primary h-[28px] px-1.5 align-top">
                        {row.description || ""}
                      </td>
                      <td className="border border-primary h-[28px] px-1.5 text-center align-top">
                        {row.qty || ""}
                      </td>
                      <td className="border border-primary h-[28px] px-1.5 text-right align-top">
                        {row.unitPrice !== "" && row.unitPrice !== undefined
                          ? formatMoney(row.unitPrice)
                          : ""}
                      </td>
                      <td className="border border-primary h-[28px] px-1.5 text-right align-top">
                        {row.totalPrice !== "" && row.totalPrice !== undefined
                          ? formatMoney(row.totalPrice)
                          : ""}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td
                      colSpan={3}
                      rowSpan={3}
                      className="border border-primary align-top px-3 py-3"
                    >
                      <div className="text-[10px] sm:text-[11px] font-bold mb-2">
                        NOTE:
                      </div>

                      <div className="text-[8px] sm:text-[9px] leading-4 sm:leading-5 text-primary/90 font-medium max-w-[270px]">
                        <div>The above price are including 15% vat</div>
                        <div>
                          A 60% advance payment must be issue before project
                          started
                        </div>
                        <div>Delivery date __________ working days</div>
                        <div>the price is valid for 3 working days</div>
                      </div>
                    </td>

                    <td className="border border-primary px-2 py-1 font-semibold text-right">
                      Sub total
                    </td>
                    <td className="border border-primary px-2 py-1 text-right font-bold">
                      {formatMoney(totals.subTotal)}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-primary px-2 py-1 font-semibold text-right">
                      VAT 15%
                    </td>
                    <td className="border border-primary px-2 py-1 text-right font-bold">
                      {formatMoney(totals.vat15)}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-primary px-2 py-1 font-bold text-right">
                      Total
                    </td>
                    <td className="border border-primary px-2 py-1 text-right font-extrabold">
                      {formatMoney(totals.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BOTTOM NOTE + SEAL */}
            <div className="mt-4 grid grid-cols-[1fr_140px] gap-4 items-end">
              <div className="text-[8px] sm:text-[9px] leading-4 text-primary/90 font-medium">
                <div>Delivery date __________________</div>
                <div className="mt-2">
                  the price is valid for 3 working days
                </div>
              </div>

              <div className="relative w-[108px] h-[108px] sm:w-[120px] sm:h-[120px] mx-auto">
                <div className="absolute inset-0 rounded-full border-[3px] border-primary/80 rotate-[-12deg] flex items-center justify-center">
                  <div className="absolute inset-[10px] rounded-full border-2 border-primary/50" />
                  <div className="text-center px-2 leading-tight">
                    <div className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wide">
                      Azael Printing
                    </div>
                    <div className="mt-1 text-[7px] sm:text-[8px] font-semibold">
                      OFFICIAL
                    </div>
                    <div className="text-[7px] sm:text-[8px] font-semibold">
                      COMPANY SEAL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIGNATURE AREA */}
            <div className="mt-3 grid grid-cols-2 gap-4 text-[8px] sm:text-[9px] font-semibold text-primary/90">
              <div>
                <div className="border-b border-primary h-[18px] w-[150px]" />
                <div className="mt-1">Prepared by</div>
              </div>
              <div className="text-right">
                <div className="border-b border-primary h-[18px] w-[150px] ml-auto" />
                <div className="mt-1">Approved by</div>
              </div>
            </div>

            {/* FOOTER BAR */}
            <div className="mt-6 bg-primary text-white rounded-tl-[18px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[18px] px-4 py-3">
              <div className="text-center text-[8px] sm:text-[9px] font-semibold leading-4">
                <div className="font-bold">Addis Ababa, Ethiopia</div>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  <span>0941415121 / 0941481211</span>
                  <span>fikadazprinting@gmail.com</span>
                  <span>www.azalprinting.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
