import { useEffect, useMemo, useRef, useState } from "react";
import { listJobs } from "../../api/jobs.api";
import logo from "../../../assets/logo.png";
import seal from "../../../assets/azaelCompanySeal-01.png";
// import proformaTemplate from "../../../assets/proforma-template.png";

function onlyNumberLike(v) {
  return String(v || "").replace(/[^\d.]/g, "");
}

function safeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

function formatMoney(v) {
  return Number(v || 0).toLocaleString();
}

function todayDisplay() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getNextDocNumber(storageKey, prefix) {
  const raw = Number(localStorage.getItem(storageKey) || "0") + 1;
  return `${prefix}${String(raw).padStart(5, "0")}`;
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function ProformaSheet({ docNumber, customerName, tin, rows, totals }) {
  const rowCount = Math.max(1, rows.length);
  const tableTop = 40;
  const headerH = 4.4;
  const maxTableBody = 24;
  const rowH = Math.min(5.8, maxTableBody / rowCount);
  const totalsTop = tableTop + headerH + rowCount * rowH + 0.8;

  return (
    <div className="sheet-page relative overflow-hidden bg-white text-[#1f2937]">
      <div className="absolute left-[1.5%] top-[1.8%] h-[14%] w-[53%] rounded-br-[3.8rem] bg-[#1679bf]" />
      <img
        src={logo}
        alt="Azael"
        className="absolute left-[5%] top-[3.3%] w-[44%]"
      />
      <div className="absolute left-[18.8%] top-[15.2%] text-[2.7%] tracking-[0.14em] text-white font-semibold">
        PROFORMA
      </div>

      <div className="absolute right-0 top-[3.1%] h-[1.4%] w-[16%] rounded-l-full bg-[#1679bf]" />
      <div className="absolute right-0 top-[6.2%] h-[1.4%] w-[11%] rounded-l-full bg-[#1679bf]" />

      <div className="absolute right-[5.8%] top-[20.8%] text-right text-[1.95%] leading-[1.55] text-[#4169b2] font-semibold">
        <div>
          TIN <span className="text-[#111111] font-medium">0082555133</span>
        </div>
        <div>
          VAT REG{" "}
          <span className="text-[#111111] font-medium">19889750816</span>
        </div>
        <div>
          PROFORMA NUMBER{" "}
          <span className="text-[#111111] font-medium">{docNumber}</span>
        </div>
        <div>
          DATE{" "}
          <span className="text-[#111111] font-medium">{todayDisplay()}</span>
        </div>
      </div>

      <div className="absolute left-[7%] top-[29.4%] text-[2.35%] font-semibold text-[#1679bf]">
        PRICING QUATATION TO:
      </div>
      <div className="absolute left-[35%] top-[30.5%] h-[0.18%] w-[42%] bg-[#4f7cc3]" />
      <div className="absolute left-[46%] top-[29.1%] max-w-[28%] text-center overflow-hidden whitespace-nowrap text-ellipsis bg-white px-[2px] text-[1.9%] text-[#111111] font-semibold">
        {customerName}
      </div>

      <div className="absolute left-[28.8%] top-[32.55%] text-[2.35%] font-semibold text-[#4f7cc3]">
        TIN :
      </div>
      <div className="absolute left-[35%] top-[33.7%] h-[0.18%] w-[42%] bg-[#4f7cc3]" />
      <div className="absolute left-[46%] top-[32.35%] max-w-[28%] text-center overflow-hidden whitespace-nowrap text-ellipsis bg-white px-[2px] text-[1.9%] text-[#111111] font-semibold">
        {tin}
      </div>

      <div className="absolute left-[4%] top-[38%] w-[91.3%] text-[2%] text-[#1679bf] font-semibold">
        <div
          className="grid h-[4.2%] grid-cols-[5%_47%_20%_13%_15%] bg-[#1679bf] text-white border border-[#1679bf]"
          style={{ height: `${headerH}%` }}
        >
          <div className="flex items-center justify-center border-r border-white/30">
            NO
          </div>
          <div className="flex items-center px-[3%] border-r border-white/30">
            Description
          </div>
          <div className="flex items-center justify-center border-r border-white/30">
            QTY
          </div>
          <div className="flex items-center justify-center border-r border-white/30">
            Unit Price
          </div>
          <div className="flex items-center justify-center">Total Price</div>
        </div>

        {Array.from({ length: rowCount }).map((_, idx) => {
          const row = rows[idx] || {
            no: "",
            description: "",
            qty: "",
            unitPrice: "",
            total: "",
          };

          return (
            <div
              key={row.id || idx}
              className="grid grid-cols-[5%_47%_20%_13%_15%] border-x border-b border-[#1679bf]"
              style={{ height: `${rowH}%` }}
            >
              <div className="flex items-center justify-center border-r border-[#1679bf] text-[1.9%] text-[#111111] font-semibold">
                {row.no}
              </div>
              <div className="flex items-center px-[2.2%] border-r border-[#1679bf] text-[1.9%] text-[#111111] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                {row.description}
              </div>
              <div className="flex items-center justify-center px-[1%] border-r border-[#1679bf] text-[1.9%] text-[#111111] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                {row.qty}
              </div>
              <div className="flex items-center justify-end px-[5%] border-r border-[#1679bf] text-[1.9%] text-[#111111] font-semibold">
                {row.unitPrice}
              </div>
              <div className="flex items-center justify-end px-[5%] text-[1.9%] text-[#111111] font-semibold">
                {row.total}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute right-[4.7%] w-[33%] text-[2%]"
        style={{ top: `${totalsTop}%` }}
      >
        {[
          ["Sub total", formatMoney(totals.subTotal)],
          ["VAT 15%", formatMoney(totals.vat15)],
          ["Total", formatMoney(totals.total)],
        ].map(([label, value]) => (
          <div key={label} className="grid grid-cols-[48%_52%] h-[2.7%]">
            <div className="bg-[#1679bf] text-white flex items-center justify-end pr-[6%] border border-[#1679bf]">
              {label}
            </div>
            <div className="bg-white text-[#111111] flex items-center justify-end pr-[6%] border-y border-r border-[#1679bf]">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-[8.2%] bottom-[18.8%] text-[2.2%] font-bold text-[#4169b2]">
        NOTE:
      </div>

      <div className="absolute left-[8.2%] bottom-[7.9%] w-[40%] text-[1.82%] leading-[1.58] font-bold text-[#4169b2]">
        <div>The above price are including 15% vat</div>
        <div>A 60% advance payment must be issues before</div>
        <div>project stated</div>
        <div>Delivery date __________ working days</div>
        <div>the price is valid for 10 working days</div>
      </div>

      <img
        src={seal}
        alt="Seal"
        className="absolute left-[66.5%] bottom-[7.8%] w-[13.5%] opacity-95"
      />

      <div className="absolute right-[4.8%] bottom-[9.6%] text-right text-[1.95%] leading-[1.22] font-bold text-[#4169b2]">
        <div>Fikadesselassie Ayana</div>
        <div>General manager</div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-[6.9%] bg-[#1679bf]" />
      <div className="absolute bottom-[3.4%] left-0 right-0 text-center text-[1.85%] text-white font-semibold">
        ስልክ
      </div>
      <div className="absolute bottom-[1.8%] left-0 right-0 text-center text-[1.65%] text-white">
        0941413132 | 0944781211
      </div>
      <div className="absolute bottom-[0.5%] left-0 right-0 text-center text-[1.35%] text-white">
        info@azaelprinting.com &nbsp;&nbsp; www.azaelprinting.com
      </div>
    </div>
  );
}

export default function AdminProforma() {
  const [docNumber] = useState(() =>
    getNextDocNumber("azael_proforma_counter", "AZ-PR-"),
  );

  const [f, setF] = useState({
    customerName: "",
    tin: "",
    description: "",
    quantity: "",
    unitType: "pcs",
    unitPrice: "",
    deliveryDate: "",
  });

  const [items, setItems] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const textRef = useRef(null);

  function update(key, value) {
    setF((p) => ({ ...p, [key]: value }));
  }

  function buildItem() {
    const unitPrice = Number(f.unitPrice || 0);
    const quantity = Number(f.quantity || 0);
    return {
      id: safeId(),
      description: f.description,
      quantity,
      unitType: f.unitType,
      unitPrice,
      total: quantity * unitPrice,
    };
  }

  function addItem() {
    if (!f.description.trim()) return alert("Description is required");
    if (!f.quantity || Number(f.quantity) <= 0) {
      return alert("Quantity must be greater than 0");
    }
    if (!f.unitPrice || Number(f.unitPrice) < 0) {
      return alert("Unit price is required");
    }
    setItems((prev) => [...prev, buildItem()]);
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
    requestAnimationFrame(() => autoGrow(textRef.current));
  }

  function clearForm() {
    setF({
      customerName: "",
      tin: "",
      description: "",
      quantity: "",
      unitType: "pcs",
      unitPrice: "",
      deliveryDate: "",
    });
    setItems([]);
    requestAnimationFrame(() => autoGrow(textRef.current));
  }

  function removeRow(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  useEffect(() => {
    (async () => {
      try {
        const jobs = await listJobs();
        setAllJobs(jobs || []);
      } catch {
        setAllJobs([]);
      }
    })();
  }, []);

  useEffect(() => {
    const exact = allJobs.find(
      (j) =>
        String(j.customerName || "")
          .trim()
          .toLowerCase() ===
        String(f.customerName || "")
          .trim()
          .toLowerCase(),
    );

    if (exact?.tin || exact?.customerTin) {
      setF((prev) => ({
        ...prev,
        tin: String(exact.tin || exact.customerTin || prev.tin || ""),
      }));
    }
  }, [f.customerName, allJobs]);

  useEffect(() => {
    autoGrow(textRef.current);
  }, [f.description]);

  const totals = useMemo(() => {
    const subTotal = items.reduce((s, x) => s + Number(x.total || 0), 0);
    const vat15 = subTotal * 0.15;
    const total = subTotal + vat15;
    return { subTotal, vat15, total };
  }, [items]);

  // const rows = useMemo(() => {
  //   const actual = items.map((x, i) => ({
  //     id: x.id,
  //     no: i + 1,
  //     description: x.description,
  //     qty: `${x.quantity} ${x.unitType || ""}`.trim(),
  //     unitPrice: formatMoney(x.unitPrice),
  //     total: formatMoney(x.total),
  //   }));

  //   return actual.length
  //     ? actual
  //     : [
  //         {
  //           id: "empty",
  //           no: "",
  //           description: "",
  //           qty: "",
  //           unitPrice: "",
  //           total: "",
  //         },
  //       ];
  // }, [items]);
  const rows = useMemo(() => {
    const actual = items.map((x, i) => ({
      id: x.id,
      no: i + 1,
      description: x.description,
      qty: `${x.quantity} ${x.unitType || ""}`.trim(),
      unitPrice: formatMoney(x.unitPrice),
      total: formatMoney(x.total),
    }));

    if (actual.length) return actual;

    const liveQty = Number(f.quantity || 0);
    const liveUnit = Number(f.unitPrice || 0);
    const liveTotal = liveQty * liveUnit;

    if (f.description?.trim() || liveQty || liveUnit) {
      return [
        {
          id: "live-preview",
          no: 1,
          description: f.description || "",
          qty: `${f.quantity || ""} ${f.unitType || ""}`.trim(),
          unitPrice: liveUnit ? formatMoney(liveUnit) : "",
          total: liveTotal ? formatMoney(liveTotal) : "",
        },
      ];
    }

    return [
      {
        id: "empty",
        no: "",
        description: "",
        qty: "",
        unitPrice: "",
        total: "",
      },
    ];
  }, [items, f.description, f.quantity, f.unitType, f.unitPrice]);

  function printPdf() {
    const key = "azael_proforma_counter";
    const current = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(current));
    window.print();
  }

  return (
    <>
      <style>{`
  @page {
    size: A4 portrait;
    margin: 0;
  }

  html,
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif !important;
  }

  .sheet-page {
    width: 100%;
    aspect-ratio: 210 / 297;
    font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .sheet-page * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif !important;
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
      width: 210mm !important;
      min-height: 297mm !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      display: block !important;
    }

    .no-print {
      display: none !important;
    }

    .sheet-wrap {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
    }

    .sheet-page {
      width: 210mm !important;
      height: 297mm !important;
    }
  }
`}</style>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_470px]">
        <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm no-print min-w-0">
          <div>
            <div className="text-primary text-base sm:text-lg font-bold">
              Pricing Quotation
            </div>
            <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold mt-1">
              Generate Proforma
            </div>
          </div>

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
                  list="proforma-customer-list"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs sm:text-sm"
                  value={f.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                />
                <datalist id="proforma-customer-list">
                  {Array.from(
                    new Set(allJobs.map((j) => String(j.customerName || ""))),
                  )
                    .filter(Boolean)
                    .map((name) => (
                      <option key={name} value={name} />
                    ))}
                </datalist>
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
                  ref={textRef}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 min-h-[110px] text-xs sm:text-sm resize-none overflow-hidden"
                  value={f.description}
                  onInput={(e) => autoGrow(e.target)}
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
          </div>

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
                    className="grid grid-cols-[28px_minmax(0,1fr)_64px_70px_76px_62px] sm:grid-cols-[32px_minmax(0,1fr)_70px_90px_90px_64px] gap-2 items-start border border-zinc-200 rounded-xl p-2 overflow-hidden"
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

        <div className="print-root bg-white border border-zinc-200 rounded-2xl p-2 sm:p-3 shadow-sm min-w-0 [font-family:'Segoe_UI_Variable','Segoe_UI',system-ui,sans-serif]">
          <div className="no-print mb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-primary text-base sm:text-lg font-bold">
                Preview
              </div>
              <div className="text-zinc-400 text-[11px] sm:text-xs font-semibold">
                Professional printable proforma
              </div>
            </div>
            <button
              onClick={printPdf}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-[11px] sm:text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              Print / Export PDF
            </button>
          </div>

          <div className="sheet-wrap mx-auto w-full max-w-[420px] xl:max-w-[470px]">
            <ProformaSheet
              docNumber={docNumber}
              customerName={f.customerName}
              tin={f.tin}
              rows={rows}
              totals={totals}
            />
          </div>
        </div>
      </div>
    </>
  );
}
