import { useMemo, useState } from "react";
import logo from "../../../assets/logo.png";
import sealImg from "../../../assets/azaelCompnySeal-01.png";

function onlyNumberLike(v) {
  return String(v || "").replace(/[^\d.]/g, "");
}

function safeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function todayParts() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return {
    dd,
    mm,
    yyyy,
    iso: `${yyyy}-${mm}-${dd}`,
    display: `${dd}/${mm}/${yyyy}`,
  };
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString();
}

function autoGrow(e) {
  e.target.style.height = "auto";
  e.target.style.height = `${e.target.scrollHeight}px`;
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
    deliveryDate: "",
    proformaNo: "AZ-PR-00001",
    companyTin: "0082555133",
    vatReg: "19889750816",
    note1: "The above price are including 15% vat",
    note2: "A 60% advance payment must be issues before project stated",
    note3: "Delivery date",
    note4: "the price is valid for 10 working days",
    managerName: "Fikadesselassie Ayana",
    managerTitle: "General manager",
    phone1: "0941413132",
    phone2: "0944781211",
    email: "info@azaelprinting.com",
    website: "www.azaelprinting.com",
  });

  const [items, setItems] = useState([]);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  function addItem() {
    if (!f.description.trim()) {
      return alert("Description is required");
    }
    if (!f.quantity || Number(f.quantity) <= 0) {
      return alert("Quantity must be greater than 0");
    }
    if (!f.unitPrice || Number(f.unitPrice) < 0) {
      return alert("Unit price is required");
    }

    const row = {
      id: safeId(),
      description: f.description,
      quantity: Number(f.quantity || 0),
      unitType: f.unitType,
      unitPrice: Number(f.unitPrice || 0),
      total: Number(f.quantity || 0) * Number(f.unitPrice || 0),
    };

    setItems((prev) => [...prev, row]);
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
      deliveryDate: "",
    }));
    setItems([]);
  }

  function removeRow(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  const totals = useMemo(() => {
    const subTotal = items.reduce((s, x) => s + Number(x.total || 0), 0);
    const vat15 = subTotal * 0.15;
    const total = subTotal + vat15;
    return { subTotal, vat15, total };
  }, [items]);

  const previewRows = useMemo(() => {
    const minimumRows = 8;
    const actual = items.map((x, i) => ({
      no: i + 1,
      description: x.description,
      quantity: `${x.quantity} ${x.unitType || ""}`.trim(),
      unitPrice: x.unitPrice ? formatMoney(x.unitPrice) : "",
      total: x.total ? formatMoney(x.total) : "",
      isEmpty: false,
      id: x.id,
    }));

    const emptiesNeeded = Math.max(0, minimumRows - actual.length);
    const empties = Array.from({ length: emptiesNeeded }).map((_, i) => ({
      no: "",
      description: "",
      quantity: "",
      unitPrice: "",
      total: "",
      isEmpty: true,
      id: `empty-${i}`,
    }));

    return [...actual, ...empties];
  }, [items]);

  function printPdf() {
    window.print();
  }

  return (
    <>
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .print-root,
          .print-root * {
            visibility: visible !important;
          }

          .print-root {
            position: absolute;
            inset: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff;
          }

          .no-print {
            display: none !important;
          }

          .print-page {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_560px]">
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
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                />
              </div>

              <div>
                <div className="text-[11px] sm:text-xs font-semibold text-zinc-700 mb-1">
                  TIN
                </div>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.tin}
                  onChange={(e) =>
                    update("tin", onlyNumberLike(e.target.value))
                  }
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
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[110px] text-xs sm:text-sm resize-none overflow-hidden"
                  value={f.description}
                  onInput={autoGrow}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Long description accepted..."
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
                    <option value="set">set</option>
                    <option value="box">box</option>
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
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Add new
            </button>

            <button
              onClick={addItem}
              className="px-4 py-2.5 rounded-xl bg-success text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Add
            </button>

            <button
              onClick={clearForm}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 text-[11px] sm:text-xs font-bold transition-all duration-300 hover:bg-bgLight hover:-translate-y-0.5 hover:shadow-sm"
            >
              Clear
            </button>

            <button
              onClick={printPdf}
              className="ml-auto px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Print / Export PDF
            </button>
          </div>

          {/* ADDED LIST */}
          <div className="mt-6">
            <div className="text-primary text-sm font-bold border-b border-zinc-200 pb-2">
              Added Items
            </div>

            <div className="mt-3 grid gap-2">
              {items.length === 0 ? (
                <div className="text-zinc-400 text-xs font-semibold">
                  No item added yet
                </div>
              ) : (
                items.map((row, idx) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[32px_minmax(0,1fr)_70px_90px_90px_64px] gap-2 items-start border border-zinc-200 rounded-xl p-2"
                  >
                    <div className="text-xs font-bold text-zinc-500 pt-1">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-zinc-800 whitespace-pre-wrap break-words">
                      {row.description}
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 pt-1">
                      {row.quantity} {row.unitType}
                    </div>
                    <div className="text-xs font-semibold text-zinc-700 pt-1">
                      {formatMoney(row.unitPrice)}
                    </div>
                    <div className="text-xs font-bold text-primary pt-1">
                      {formatMoney(row.total)}
                    </div>
                    <button
                      onClick={() => removeRow(row.id)}
                      className="px-2 py-1 rounded-lg border border-zinc-200 text-[10px] font-bold hover:bg-red-50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="print-root bg-white border border-zinc-200 rounded-2xl p-2 sm:p-3 shadow-sm min-w-0">
          <div className="no-print mb-3">
            <div className="text-primary text-base sm:text-lg font-bold">
              Preview
            </div>
            <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold">
              Exact-style printable proforma
            </div>
          </div>

          <div className="print-page mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white text-[#1e73be] overflow-hidden rounded-xl border border-zinc-200">
            {/* TOP HEADER SHAPE */}
            <div className="relative">
              <div className="grid grid-cols-[58%_42%] min-h-[170px]">
                <div className="bg-[#1178be] rounded-br-[90px] pl-[28px] pt-[24px] pr-[24px] pb-[14px]">
                  <img
                    src={logo}
                    alt="Azael Printing"
                    className="w-[330px] max-w-full object-contain"
                  />
                  <div
                    className="mt-[8px] ml-[64px] text-white font-extrabold tracking-wide uppercase"
                    style={{
                      fontSize: "34px",
                      lineHeight: 1,
                      WebkitTextStroke: "1.2px white",
                      color: "transparent",
                    }}
                  >
                    PROFORMA
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute right-[18px] top-[34px] flex flex-col gap-[18px]">
                    <div className="w-[130px] h-[12px] rounded-full bg-[#1178be]" />
                    <div className="w-[96px] h-[12px] rounded-full bg-[#1178be] ml-auto" />
                  </div>

                  <div className="absolute right-[34px] top-[84px] text-right font-bold leading-[1.45]">
                    <div className="text-[18px]">
                      <span>TIN</span>
                      <span className="ml-3 font-medium text-[#2d5fb3]">
                        {f.companyTin}
                      </span>
                    </div>
                    <div className="text-[18px]">
                      <span>VAT REG</span>
                      <span className="ml-3 font-medium text-[#2d5fb3]">
                        {f.vatReg}
                      </span>
                    </div>
                    <div className="text-[18px]">
                      <span>PROFORMA NUMBER</span>
                      <span className="ml-3 font-medium text-[#111111]">
                        {f.proformaNo}
                      </span>
                    </div>
                    <div className="text-[18px]">
                      <span>DATE</span>
                      <span className="ml-3 font-medium text-[#111111]">
                        {t.display}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="px-[34px] pt-[28px] pb-[18px]">
              {/* CUSTOMER LINES */}
              <div className="text-[18px] leading-[1.4]">
                <div className="grid grid-cols-[330px_1fr] items-end gap-[10px]">
                  <div className="text-right uppercase">
                    PRICING QUATATION TO:
                  </div>
                  <div className="border-b-[2px] border-[#3b6bbd] h-[18px]">
                    <div className="pl-1 text-[16px] font-medium text-[#111111]">
                      {f.customerName}
                    </div>
                  </div>
                </div>

                <div className="mt-[6px] grid grid-cols-[330px_1fr] items-end gap-[10px]">
                  <div className="text-right uppercase">TIN:</div>
                  <div className="border-b-[2px] border-[#3b6bbd] h-[18px]">
                    <div className="pl-1 text-[16px] font-medium text-[#111111]">
                      {f.tin}
                    </div>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="mt-[44px]">
                <table className="w-full border-collapse text-[#1178be]">
                  <thead>
                    <tr className="bg-[#1178be] text-white">
                      <th className="border-[2px] border-[#1178be] text-left px-[6px] py-[6px] text-[11px] font-bold w-[42px]">
                        NO
                      </th>
                      <th className="border-[2px] border-[#1178be] text-left px-[8px] py-[6px] text-[11px] font-bold">
                        Description
                      </th>
                      <th className="border-[2px] border-[#1178be] text-center px-[6px] py-[6px] text-[11px] font-bold w-[92px]">
                        QTY
                      </th>
                      <th className="border-[2px] border-[#1178be] text-center px-[6px] py-[6px] text-[11px] font-bold w-[120px]">
                        Unit Price
                      </th>
                      <th className="border-[2px] border-[#1178be] text-center px-[6px] py-[6px] text-[11px] font-bold w-[130px]">
                        Total Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row.id}>
                        <td className="border-[2px] border-[#1178be] px-[6px] py-[8px] text-[10px] h-[39px] align-top">
                          {row.no}
                        </td>
                        <td className="border-[2px] border-[#1178be] px-[8px] py-[8px] text-[10px] h-[39px] align-top whitespace-pre-wrap">
                          {row.description}
                        </td>
                        <td className="border-[2px] border-[#1178be] px-[6px] py-[8px] text-[10px] h-[39px] align-top text-center">
                          {row.quantity}
                        </td>
                        <td className="border-[2px] border-[#1178be] px-[6px] py-[8px] text-[10px] h-[39px] align-top text-right">
                          {row.unitPrice}
                        </td>
                        <td className="border-[2px] border-[#1178be] px-[6px] py-[8px] text-[10px] h-[39px] align-top text-right">
                          {row.total}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td
                        colSpan={3}
                        rowSpan={3}
                        className="border-none align-top pt-[26px] pr-[18px]"
                      >
                        <div className="ml-[52px]">
                          <div className="text-[20px] font-bold uppercase">
                            NOTE:
                          </div>
                          <div className="mt-[8px] text-[10px] leading-[1.7] text-[#4169b2] font-medium">
                            <div>{f.note1}</div>
                            <div>{f.note2}</div>
                            <div>
                              {f.note3}{" "}
                              <span className="inline-block min-w-[90px] border-b border-[#4169b2] align-middle" />{" "}
                              working days
                            </div>
                            <div>{f.note4}</div>
                          </div>
                        </div>
                      </td>

                      <td className="bg-[#1178be] text-white border-[2px] border-[#1178be] px-[8px] py-[6px] text-[11px] text-right font-bold">
                        Sub total
                      </td>
                      <td className="border-[2px] border-[#4169b2] px-[8px] py-[6px] text-[11px] text-right font-bold text-[#111111]">
                        {formatMoney(totals.subTotal)}
                      </td>
                    </tr>

                    <tr>
                      <td className="bg-[#1178be] text-white border-[2px] border-[#1178be] px-[8px] py-[6px] text-[11px] text-right font-bold">
                        VAT 15%
                      </td>
                      <td className="border-[2px] border-[#4169b2] px-[8px] py-[6px] text-[11px] text-right font-bold text-[#111111]">
                        {formatMoney(totals.vat15)}
                      </td>
                    </tr>

                    <tr>
                      <td className="bg-[#1178be] text-white border-[2px] border-[#1178be] px-[8px] py-[6px] text-[11px] text-right font-bold">
                        Total
                      </td>
                      <td className="border-[2px] border-[#4169b2] px-[8px] py-[6px] text-[11px] text-right font-extrabold text-[#111111]">
                        {formatMoney(totals.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* BOTTOM AREA */}
              <div className="mt-[8px] grid grid-cols-[1fr_170px_1fr] items-end gap-[8px]">
                <div />

                <div className="flex justify-center">
                  <img
                    src={sealImg}
                    alt="Company Seal"
                    className="w-[150px] h-[150px] object-contain"
                  />
                </div>

                <div className="text-right text-[#4169b2] leading-[1.15] mb-[12px]">
                  <div className="text-[14px] font-medium">{f.managerName}</div>
                  <div className="text-[11px] font-medium">
                    {f.managerTitle}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-auto bg-[#1178be] text-white rounded-tr-[0] rounded-tl-[0] rounded-bl-[34px] rounded-br-[34px] px-[28px] py-[12px]">
              <div className="text-center leading-[1.25]">
                <div className="text-[18px] font-bold">አድራሻ</div>
                <div className="text-[12px] font-medium mt-[2px]">
                  {f.phone1} | {f.phone2}
                </div>
                <div className="text-[11px] font-medium mt-[2px]">
                  {f.email} &nbsp;&nbsp;&nbsp; {f.website}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
