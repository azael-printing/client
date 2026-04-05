// // import invoiceBg from "../../../assets/invoice-reference-bg.png";
// // import proformaBg from "../../../assets/proforma-reference-bg.png";

// // function formatMoney(v) {
// //   return Number(v || 0).toLocaleString();
// // }

// // function todayDisplay() {
// //   const d = new Date();
// //   const dd = String(d.getDate()).padStart(2, "0");
// //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// //   const yyyy = d.getFullYear();
// //   return `${dd}/${mm}/${yyyy}`;
// // }

// // function blankRow() {
// //   return {
// //     id: "empty",
// //     no: "",
// //     description: "",
// //     qty: "",
// //     unitPrice: "",
// //     total: "",
// //   };
// // }

// // function Cover({ style, color = "#efefef" }) {
// //   return <div className="absolute" style={{ background: color, ...style }} />;
// // }

// // function Value({ className = "", style, children }) {
// //   return (
// //     <div
// //       className={`absolute overflow-hidden whitespace-nowrap text-ellipsis bg-transparent font-semibold text-[#111111] ${className}`}
// //       style={style}
// //     >
// //       {children}
// //     </div>
// //   );
// // }

// // function TableOverlay({ rows, totals, tableTop = 38, maxBody = 24 }) {
// //   const cleanRows = rows?.length ? rows : [blankRow()];
// //   const rowCount = Math.max(1, cleanRows.length);
// //   const headerH = 4.35;
// //   const rowH = Math.min(5.5, maxBody / rowCount);
// //   const totalsTop = tableTop + headerH + rowCount * rowH + 0.5;

// //   return (
// //     <>
// //       <Cover
// //         style={{
// //           left: "4%",
// //           top: `${tableTop}%`,
// //           width: "91.3%",
// //           height: `${headerH + rowCount * rowH + 0.15}%`,
// //         }}
// //         color="#ffffff"
// //       />
// //       <div
// //         className="absolute left-[4%] w-[91.3%] text-[2%] font-semibold text-[#1679bf]"
// //         style={{ top: `${tableTop}%` }}
// //       >
// //         <div
// //           className="grid grid-cols-[5%_47%_20%_13%_15%] border border-[#1679bf] bg-[#1679bf] text-white"
// //           style={{ height: `${headerH}%` }}
// //         >
// //           <div className="flex items-center justify-center border-r border-white/30">
// //             NO
// //           </div>
// //           <div className="flex items-center px-[3%] border-r border-white/30">
// //             Description
// //           </div>
// //           <div className="flex items-center justify-center border-r border-white/30">
// //             QTY
// //           </div>
// //           <div className="flex items-center justify-center border-r border-white/30">
// //             Unit Price
// //           </div>
// //           <div className="flex items-center justify-center">Total Price</div>
// //         </div>

// //         {cleanRows.map((row, idx) => (
// //           <div
// //             key={row.id || idx}
// //             className="grid grid-cols-[5%_47%_20%_13%_15%] border-x border-b border-[#1679bf]"
// //             style={{ height: `${rowH}%` }}
// //           >
// //             <div className="flex items-center justify-center border-r border-[#1679bf] px-[1%] text-[1.9%] font-semibold text-[#111111]">
// //               {row.no}
// //             </div>
// //             <div className="flex items-center border-r border-[#1679bf] px-[2.2%] text-[1.9%] font-semibold text-[#111111] overflow-hidden whitespace-nowrap text-ellipsis">
// //               {row.description}
// //             </div>
// //             <div className="flex items-center justify-center border-r border-[#1679bf] px-[1%] text-[1.9%] font-semibold text-[#111111] overflow-hidden whitespace-nowrap text-ellipsis">
// //               {row.qty}
// //             </div>
// //             <div className="flex items-center justify-end border-r border-[#1679bf] px-[5%] text-[1.9%] font-semibold text-[#111111]">
// //               {row.unitPrice}
// //             </div>
// //             <div className="flex items-center justify-end px-[5%] text-[1.9%] font-semibold text-[#111111]">
// //               {row.total}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       <Cover
// //         style={{
// //           right: "4.7%",
// //           top: `${totalsTop}%`,
// //           width: "17.1%",
// //           height: "8.35%",
// //         }}
// //         color="#ffffff"
// //       />
// //       <div
// //         className="absolute right-[4.7%] w-[17.1%] text-[2%]"
// //         style={{ top: `${totalsTop}%` }}
// //       >
// //         {[
// //           formatMoney(totals.subTotal),
// //           formatMoney(totals.vat15),
// //           formatMoney(totals.total),
// //         ].map((value, idx) => (
// //           <div
// //             key={idx}
// //             className="flex h-[2.78%] items-center justify-end px-[7%] text-[1.95%] font-semibold text-[#111111]"
// //           >
// //             {value}
// //           </div>
// //         ))}
// //       </div>
// //     </>
// //   );
// // }

// // export default function DocumentExactSheet({
// //   type = "invoice",
// //   docNumber = "",
// //   customerName = "",
// //   tin = "",
// //   rows = [],
// //   totals = { subTotal: 0, vat15: 0, total: 0 },
// //   accountName = "",
// //   bankName = "",
// //   accountNumber = "",
// // }) {
// //   const isInvoice = type === "invoice";
// //   const bg = isInvoice ? invoiceBg : proformaBg;
// //   const docTop = isInvoice ? "18.45%" : "20.75%";
// //   const dateTop = isInvoice ? "23.85%" : "26.1%";
// //   const customerTop = isInvoice ? "28.0%" : "29.35%";
// //   const tinTop = isInvoice ? "31.15%" : "32.45%";
// //   const tableTop = isInvoice ? 36.1 : 38.0;
// //   const maxBody = isInvoice ? 18.5 : 18.5;

// //   return (
// //     <div className="sheet-page relative overflow-hidden bg-white text-[#1f2937]">
// //       <img
// //         src={bg}
// //         alt={isInvoice ? "Invoice template" : "Proforma template"}
// //         className="absolute inset-0 h-full w-full object-cover"
// //       />

// //       <Cover
// //         style={{ left: "78.2%", top: docTop, width: "16%", height: "2.45%" }}
// //       />
// //       <Cover
// //         style={{ left: "78.2%", top: dateTop, width: "16%", height: "2.45%" }}
// //       />
// //       <Cover
// //         style={{
// //           left: "44.2%",
// //           top: customerTop,
// //           width: "31.2%",
// //           height: "2.35%",
// //         }}
// //       />
// //       <Cover
// //         style={{ left: "44.2%", top: tinTop, width: "31.2%", height: "2.35%" }}
// //       />

// //       <Value
// //         className="text-right text-[1.95%]"
// //         style={{ right: "6.0%", top: docTop, width: "16.8%" }}
// //       >
// //         {docNumber}
// //       </Value>
// //       <Value
// //         className="text-right text-[1.95%]"
// //         style={{ right: "6.0%", top: dateTop, width: "16.8%" }}
// //       >
// //         {todayDisplay()}
// //       </Value>
// //       <Value
// //         className="text-center text-[1.9%]"
// //         style={{ left: "44.8%", top: customerTop, width: "30%" }}
// //       >
// //         {customerName}
// //       </Value>
// //       <Value
// //         className="text-center text-[1.9%]"
// //         style={{ left: "44.8%", top: tinTop, width: "30%" }}
// //       >
// //         {tin}
// //       </Value>

// //       <TableOverlay
// //         rows={rows}
// //         totals={totals}
// //         tableTop={tableTop}
// //         maxBody={maxBody}
// //       />

// //       {isInvoice ? (
// //         <>
// //           <Cover
// //             style={{
// //               left: "2.7%",
// //               bottom: "5.6%",
// //               width: "47.5%",
// //               height: "19%",
// //             }}
// //           />
// //           <div className="absolute left-[3.2%] bottom-[18.7%] text-[2.1%] font-bold text-[#4966B7]">
// //             Payment Instructions
// //           </div>
// //           <div className="absolute left-[3.2%] bottom-[10.35%] w-[41.5%] text-[1.82%] leading-[1.42] text-[#4E6CC2] font-bold">
// //             <div>
// //               Account Name: <span className="font-medium">{accountName}</span>
// //             </div>
// //             <div>
// //               Bank Name: <span className="font-medium">{bankName}</span>
// //             </div>
// //             <div>
// //               Account Number:{" "}
// //               <span className="font-medium">{accountNumber}</span>
// //             </div>
// //           </div>
// //           <div className="absolute left-[6.2%] bottom-[6.3%] w-[43%] text-[1.72%] leading-[1.36] text-[#4E6CC2] font-semibold">
// //             <div>
// //               - Please complete payment via bank transfer and send the
// //               transaction receipt for verification.
// //             </div>
// //             <div>
// //               - Your official receipt will be issued once payment is confirmed.
// //             </div>
// //           </div>
// //         </>
// //       ) : null}
// //     </div>
// //   );
// // }

// // This component is a static representation of an invoice or proforma document.
// // It uses absolute positioning to overlay values on top of a background template image.
// // The TableOverlay component dynamically renders the table rows and totals based on the provided data.
// // The Cover component is used to hide any existing text on the template that may interfere with the overlaid values.

// import React, { forwardRef, useMemo } from "react";
// import "./azael-document.css";

// const toNumber = (v) => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : 0;
// };

// const money = (v) => {
//   if (v === "" || v === null || v === undefined) return "";
//   return toNumber(v).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// };

// const buildRows = (items = [], minRows = 1) => {
//   const cleaned = items.map((item, index) => {
//     const qty = item?.qty ?? item?.quantity ?? "";
//     const unitPrice = item?.unitPrice ?? "";
//     const totalPrice =
//       item?.totalPrice ??
//       (qty !== "" && unitPrice !== ""
//         ? toNumber(qty) * toNumber(unitPrice)
//         : "");

//     return {
//       no: index + 1,
//       description: item?.description ?? "",
//       qty,
//       unitPrice,
//       totalPrice,
//     };
//   });

//   const blanksNeeded = Math.max(minRows - cleaned.length, 0);
//   const blanks = Array.from({ length: blanksNeeded }, (_, i) => ({
//     no: cleaned.length + i + 1,
//     description: "",
//     qty: "",
//     unitPrice: "",
//     totalPrice: "",
//   }));

//   return [...cleaned, ...blanks];
// };

// const AzaelDocumentTemplate = forwardRef(function AzaelDocumentTemplate(
//   {
//     type = "invoice", // "invoice" | "proforma"
//     documentNumber = "",
//     date = "DD/MM/YYYY",
//     customerName = "",
//     customerTin = "",
//     items = [],
//     vatRate = 0.15,
//     vatEnabled = true,
//     minRows = 1,

//     company = {
//       tin: "0082555133",
//       vatReg: "19889750816",
//       accountName: "[Your Company Name]",
//       bankName: "[Bank Name]",
//       accountNumber: "[Account Number]",
//       phones: ["0941431532", "0944781211"],
//       email: "info@azaelprinting.com",
//       website: "www.azaelprinting.com",
//       managerName: "Fikad",
//       managerTitle: "General manager",
//     },

//     logoSrc = "",
//     sealSrc = "",

//     note = {
//       deliveryDate: "",
//       workingDays: "",
//       validDays: "10",
//     },

//     className = "",
//   },
//   ref,
// ) {
//   const isInvoice = String(type).toLowerCase() === "invoice";

//   const rows = useMemo(() => buildRows(items, minRows), [items, minRows]);

//   const filledItems = useMemo(
//     () =>
//       rows.filter(
//         (row) =>
//           String(row.description).trim() ||
//           String(row.qty).trim() ||
//           String(row.unitPrice).trim() ||
//           String(row.totalPrice).trim(),
//       ),
//     [rows],
//   );

//   const subtotal = filledItems.reduce(
//     (sum, item) => sum + toNumber(item.totalPrice),
//     0,
//   );
//   const vatAmount = vatEnabled ? subtotal * vatRate : 0;
//   const grandTotal = subtotal + vatAmount;

//   const docLabel = isInvoice ? "INVOICE" : "PROFORMA";
//   const docNumberLabel = isInvoice ? "INVOICE NUMBER" : "PROFORMA NUMBER";
//   const docPrefix = isInvoice ? "AZ-INV-" : "AZ-PR-";

//   return (
//     <div className={`azael-doc-wrap ${className}`}>
//       <div ref={ref} className="azael-doc">
//         <div className="azael-top-lines">
//           <span />
//           <span />
//         </div>

//         <div className="azael-brand-box">
//           {logoSrc ? (
//             <img
//               src={logoSrc}
//               alt="Azael Printing"
//               className="azael-brand-logo"
//             />
//           ) : (
//             <div className="azael-brand-fallback">
//               <div className="azael-brand-main">azael</div>
//               <div className="azael-brand-sub">PRINTING</div>
//               <div className="azael-brand-am">አዛኤል ፕሪንቲንግ</div>
//             </div>
//           )}

//           <div className="azael-doc-type">{docLabel}</div>
//         </div>

//         <div className="azael-meta">
//           <div>
//             <span className="meta-key">TIN</span> {company.tin}
//           </div>
//           <div>
//             <span className="meta-key">VAT REG</span> {company.vatReg}
//           </div>
//           <div>
//             <span className="meta-key">{docNumberLabel}</span>{" "}
//             {documentNumber || `${docPrefix}00001`}
//           </div>
//           <div>
//             <span className="meta-key">DATE</span> {date}
//           </div>
//         </div>

//         <div className="azael-customer-block">
//           <div className="azael-line-row">
//             <div className="azael-line-label">PRICING QUATIATION TO:</div>
//             <div className="azael-line-value">{customerName}</div>
//           </div>

//           <div className="azael-line-row azael-line-row-tin">
//             <div className="azael-line-label">TIN:</div>
//             <div className="azael-line-value">{customerTin}</div>
//           </div>
//         </div>

//         <div className="azael-table-area">
//           <table className="azael-items-table">
//             <thead>
//               <tr>
//                 <th className="col-no">NO</th>
//                 <th className="col-description">Description</th>
//                 <th className="col-qty">QTY</th>
//                 <th className="col-unit">Unit Price</th>
//                 <th className="col-total">Total Price</th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((row, index) => (
//                 <tr key={`${row.no}-${index}`}>
//                   <td className="cell-center">
//                     {row.description ||
//                     row.qty ||
//                     row.unitPrice ||
//                     row.totalPrice
//                       ? row.no
//                       : ""}
//                   </td>
//                   <td>{row.description}</td>
//                   <td className="cell-center">{row.qty}</td>
//                   <td className="cell-right">
//                     {row.unitPrice !== "" ? money(row.unitPrice) : ""}
//                   </td>
//                   <td className="cell-right">
//                     {row.totalPrice !== "" ? money(row.totalPrice) : ""}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="azael-summary-box">
//             <div className="summary-row">
//               <div className="summary-label">Sub total</div>
//               <div className="summary-value">
//                 {subtotal ? money(subtotal) : ""}
//               </div>
//             </div>

//             <div className="summary-row">
//               <div className="summary-label">
//                 VAT {vatEnabled ? `${vatRate * 100}%` : "0%"}
//               </div>
//               <div className="summary-value">
//                 {vatAmount ? money(vatAmount) : ""}
//               </div>
//             </div>

//             <div className="summary-row">
//               <div className="summary-label">Total</div>
//               <div className="summary-value">
//                 {grandTotal ? money(grandTotal) : ""}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="azael-bottom-content">
//           <div className="azael-bottom-left">
//             {isInvoice ? (
//               <>
//                 <div className="azael-section-title">Payment Instructions</div>

//                 <div className="azael-info-line">
//                   <strong>Account Name:</strong> {company.accountName}
//                 </div>
//                 <div className="azael-info-line">
//                   <strong>Bank Name:</strong> {company.bankName}
//                 </div>
//                 <div className="azael-info-line">
//                   <strong>Account Number:</strong> {company.accountNumber}
//                 </div>

//                 <ul className="azael-note-list">
//                   <li>Please complete payment via bank transfer.</li>
//                   <li>Send the transaction receipt for verification.</li>
//                   <li>
//                     Your official receipt will be issued once payment is
//                     confirmed.
//                   </li>
//                 </ul>
//               </>
//             ) : (
//               <>
//                 <div className="azael-section-title">NOTE:</div>

//                 <div className="azael-info-line">
//                   The above price are including 15% vat
//                 </div>
//                 <div className="azael-info-line">
//                   A 60% advance payment must be issues before project stated
//                 </div>
//                 <div className="azael-info-line">
//                   Delivery date {note.deliveryDate || "________________"}{" "}
//                   {note.workingDays || "working days"}
//                 </div>
//                 <div className="azael-info-line">
//                   the price is valid for {note.validDays || "10"} working days
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="azael-stamp-sign">
//             <div className="azael-stamp-box">
//               {sealSrc ? (
//                 <img
//                   src={sealSrc}
//                   alt="Company Seal"
//                   className="azael-stamp-img"
//                 />
//               ) : (
//                 <div className="azael-stamp-fallback">
//                   <div className="stamp-ring">
//                     <div className="stamp-inner">SEAL</div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="azael-signature-box">
//               <div className="azael-manager-name">{company.managerName}</div>
//               <div className="azael-manager-title">{company.managerTitle}</div>
//             </div>
//           </div>
//         </div>

//         <div className="azael-footer">
//           <div className="azael-footer-title">አድራሻ</div>

//           <div className="azael-footer-phones">
//             {company.phones.join(" | ")}
//           </div>

//           <div className="azael-footer-bottom">
//             <span>{company.email}</span>
//             <span>● ● ●</span>
//             <span>{company.website}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default AzaelDocumentTemplate;
import React from "react";

function todayDisplay() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function num(v) {
  const n = Number(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function money(v) {
  if (v === "" || v == null) return "";
  return num(v).toLocaleString("en-US");
}

function normalizeRows(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [
      {
        id: "empty-0",
        no: "",
        description: "",
        qty: "",
        unitPrice: "",
        total: "",
      },
    ];
  }

  return rows.map((row, i) => ({
    id: row.id || `row-${i}`,
    no: row.no ?? i + 1,
    description: row.description || "",
    qty: row.qty || "",
    unitPrice: row.unitPrice || "",
    total: row.total || "",
  }));
}

export default function DocumentExactSheet({
  type = "invoice",
  docNumber = "",
  customerName = "",
  tin = "",
  rows = [],
  totals = {},
  accountName = "[Your Company Name]",
  bankName = "[Bank Name]",
  accountNumber = "[Account Number]",
  deliveryDate = "",
  logoSrc = "",
  sealSrc = "",
}) {
  const isInvoice = String(type).toLowerCase() === "invoice";
  const docWord = isInvoice ? "INVOICE" : "PROFORMA";
  const docNumberLabel = isInvoice ? "INVOICE NUMBER" : "PROFORMA NUMBER";

  const finalRows = normalizeRows(rows);
  const subTotal = money(totals?.subTotal || 0);
  const vat15 = money(totals?.vat15 || 0);
  const total = money(totals?.total || 0);

  return (
    <div className="sheet-page azael-doc-sheet">
      <style>{`
        .azael-doc-sheet {
          width: 100%;
          aspect-ratio: 210 / 297;
          background: #efefef;
          color: #2252a2;
          font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif !important;
          position: relative;
          overflow: hidden;
          border-radius: 0 0 18px 18px;
        }

        .azael-doc-sheet * {
          box-sizing: border-box;
          font-family: "Segoe UI Variable", "Segoe UI", system-ui, sans-serif !important;
        }

        .azael-doc-inner {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .azael-top-right-lines {
          position: absolute;
          top: 2.8%;
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 1.3%;
          width: 16%;
          align-items: flex-end;
          z-index: 2;
        }

        .azael-top-right-lines span {
          display: block;
          background: #0d74b9;
          height: 1.05%;
          min-height: 4px;
          border-radius: 999px 0 0 999px;
        }

        .azael-top-right-lines span:first-child {
          width: 65%;
        }

        .azael-top-right-lines span:last-child {
          width: 43%;
        }

        .azael-brand-block {
          width: 55%;
          height: 15.2%;
          background: #0d74b9;
          border-bottom-right-radius: 36px;
          position: relative;
          overflow: hidden;
          padding: 3.2% 3.2% 1.5% 3.2%;
          display: flex;
          align-items: flex-start;
        }

        .azael-logo-img {
          width: 58%;
          max-width: 180px;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .azael-logo-fallback {
          color: #fff;
          line-height: 0.95;
        }

        .azael-logo-main {
          font-size: clamp(18px, 5vw, 39px);
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .azael-logo-sub {
          font-size: clamp(6px, 1.25vw, 11px);
          font-weight: 800;
          letter-spacing: 0.32em;
          margin-left: 2px;
        }

        .azael-logo-am {
          font-size: clamp(5px, 1vw, 9px);
          font-weight: 700;
          margin-top: 2px;
          margin-left: 2px;
        }

        .azael-doc-word {
          position: absolute;
          left: 18%;
          bottom: 7%;
          font-size: clamp(14px, 3.5vw, 28px);
          font-weight: 900;
          letter-spacing: 0.04em;
          color: transparent;
          -webkit-text-stroke: 1px #ffffff;
          text-transform: uppercase;
        }

        .azael-meta {
          position: absolute;
          right: 6.4%;
          top: 11.3%;
          text-align: right;
          font-size: clamp(7px, 1.45vw, 12px);
          font-weight: 800;
          line-height: 1.26;
          color: #3f67b5;
        }

        .azael-meta div {
          white-space: nowrap;
        }

        .azael-party {
          width: 75%;
          margin-top: 10.2%;
          margin-left: 4.7%;
          color: #2f5dad;
        }

        .azael-party-row {
          display: flex;
          align-items: center;
          gap: 1.8%;
          margin-bottom: 1.5%;
        }

        .azael-party-row.tin {
          padding-left: 26%;
        }

        .azael-party-label {
          font-size: clamp(8px, 1.5vw, 12px);
          font-weight: 800;
          white-space: nowrap;
        }

        .azael-party-line {
          flex: 1;
          min-height: 13px;
          border-bottom: 1.5px solid #6480bd;
          padding: 0 1.2% 0.6% 1.2%;
          font-size: clamp(7px, 1.25vw, 11px);
          font-weight: 700;
          color: #27488f;
        }

        .azael-table-wrap {
          width: 92%;
          margin: 4.2% auto 0 auto;
        }

        .azael-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          color: #23478e;
        }

        .azael-table thead th {
          background: #0d74b9;
          color: #ffffff;
          border: 1.5px solid #4f74b6;
          padding: 0.8% 1%;
          text-align: left;
          font-size: clamp(6px, 1.12vw, 10px);
          font-weight: 800;
          line-height: 1;
        }

        .azael-table tbody td {
          border: 1.5px solid #4f74b6;
          height: 18px;
          padding: 0.8% 1%;
          vertical-align: middle;
          font-size: clamp(6px, 1.12vw, 10px);
          font-weight: 700;
          background: #efefef;
        }

        .azael-col-no {
          width: 4%;
          text-align: center;
        }

        .azael-col-desc {
          width: 46%;
        }

        .azael-col-qty {
          width: 13%;
          text-align: center;
        }

        .azael-col-unit {
          width: 18%;
          text-align: right;
        }

        .azael-col-total {
          width: 19%;
          text-align: right;
        }

        .azael-cell-center {
          text-align: center;
        }

        .azael-cell-right {
          text-align: right;
        }

        .azael-summary {
          width: 36%;
          margin-left: auto;
          margin-top: -1px;
        }

        .azael-summary-row {
          display: grid;
          grid-template-columns: 48% 52%;
        }

        .azael-summary-label {
          background: #0d74b9;
          color: white;
          border: 1.5px solid #4f74b6;
          border-right: none;
          padding: 3.5% 5%;
          text-align: right;
          font-size: clamp(6px, 1.18vw, 11px);
          font-weight: 800;
          line-height: 1;
        }

        .azael-summary-value {
          background: #efefef;
          color: #23478e;
          border: 1.5px solid #4f74b6;
          padding: 3.5% 5%;
          text-align: right;
          font-size: clamp(6px, 1.18vw, 11px);
          font-weight: 800;
          line-height: 1;
          min-height: 20px;
        }

        .azael-flex-space {
          flex: 1;
          min-height: 18%;
        }

        .azael-bottom-zone {
          width: 92%;
          margin: 0 auto 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2%;
        }

        .azael-bottom-left {
          width: 52%;
          color: #5d72b3;
          padding-bottom: 1.2%;
        }

        .azael-bottom-title {
          font-size: clamp(9px, 1.6vw, 14px);
          font-weight: 900;
          margin-bottom: 2.5%;
          color: #3a5ca5;
        }

        .azael-bottom-line {
          font-size: clamp(6px, 1.18vw, 10px);
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 0.7%;
        }

        .azael-note-list {
          margin: 3% 0 0 5.5%;
          padding: 0;
          color: #5d72b3;
        }

        .azael-note-list li {
          font-size: clamp(6px, 1.18vw, 10px);
          font-weight: 700;
          line-height: 1.28;
          margin-bottom: 0.8%;
        }

        .azael-stamp-sign {
          width: 40%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 2%;
          padding-bottom: 1%;
        }

        .azael-stamp-box {
          width: 31%;
          max-width: 86px;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .azael-stamp-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .azael-stamp-fallback {
          width: 100%;
          height: 100%;
          border: 2px solid #5b6eb0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5b6eb0;
          font-size: clamp(8px, 1.6vw, 12px);
          font-weight: 900;
          position: relative;
        }

        .azael-stamp-fallback::before {
          content: "";
          position: absolute;
          inset: 18%;
          border: 2px solid #5b6eb0;
          border-radius: 50%;
        }

        .azael-sign-box {
          text-align: left;
          color: #6277b5;
          margin-bottom: 6%;
        }

        .azael-sign-name {
          font-size: clamp(6px, 1.14vw, 10px);
          font-weight: 800;
          line-height: 1.2;
        }

        .azael-sign-title {
          font-size: clamp(5px, 1vw, 9px);
          font-weight: 700;
          line-height: 1.1;
        }

        .azael-footer {
          margin-top: 0.8%;
          background: #0d74b9;
          color: white;
          min-height: 7.6%;
          border-radius: 0 0 18px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.2% 3% 1.4%;
        }

        .azael-footer-title {
          font-size: clamp(7px, 1.22vw, 10px);
          font-weight: 900;
          line-height: 1;
          margin-bottom: 0.6%;
        }

        .azael-footer-phones {
          font-size: clamp(6px, 1.12vw, 10px);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.7%;
        }

        .azael-footer-bottom {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4%;
          font-size: clamp(5px, 0.95vw, 8px);
          font-weight: 700;
          line-height: 1;
        }

        @media print {
          .azael-doc-sheet {
            width: 210mm !important;
            height: 297mm !important;
            aspect-ratio: auto !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="azael-doc-inner">
        <div className="azael-top-right-lines">
          <span />
          <span />
        </div>

        <div className="azael-brand-block">
          {logoSrc ? (
            <img src={logoSrc} alt="Azael logo" className="azael-logo-img" />
          ) : (
            <div className="azael-logo-fallback">
              <div className="azael-logo-main">azael</div>
              <div className="azael-logo-sub">PRINTING</div>
              <div className="azael-logo-am">አዛኤል ፕሪንቲንግ</div>
            </div>
          )}

          <div className="azael-doc-word">{docWord}</div>
        </div>

        <div className="azael-meta">
          <div>TIN 0082555133</div>
          <div>VAT REG 19889750816</div>
          <div>
            {docNumberLabel}{" "}
            {docNumber || (isInvoice ? "AZ-INV-00001" : "AZ-PR-00001")}
          </div>
          <div>DATE {todayDisplay()}</div>
        </div>

        <div className="azael-party">
          <div className="azael-party-row">
            <div className="azael-party-label">PRICING QUATIATION TO:</div>
            <div className="azael-party-line">{customerName}</div>
          </div>

          <div className="azael-party-row tin">
            <div className="azael-party-label">TIN:</div>
            <div className="azael-party-line">{tin}</div>
          </div>
        </div>

        <div className="azael-table-wrap">
          <table className="azael-table">
            <thead>
              <tr>
                <th className="azael-col-no">NO</th>
                <th className="azael-col-desc">Description</th>
                <th className="azael-col-qty">QTY</th>
                <th className="azael-col-unit">Unit Price</th>
                <th className="azael-col-total">Total Price</th>
              </tr>
            </thead>

            <tbody>
              {finalRows.map((row) => (
                <tr key={row.id}>
                  <td className="azael-col-no">{row.no}</td>
                  <td className="azael-col-desc">{row.description}</td>
                  <td className="azael-col-qty azael-cell-center">{row.qty}</td>
                  <td className="azael-col-unit azael-cell-right">
                    {row.unitPrice}
                  </td>
                  <td className="azael-col-total azael-cell-right">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="azael-summary">
            <div className="azael-summary-row">
              <div className="azael-summary-label">Sub total</div>
              <div className="azael-summary-value">
                {num(totals?.subTotal) ? subTotal : ""}
              </div>
            </div>

            <div className="azael-summary-row">
              <div className="azael-summary-label">VAT 15%</div>
              <div className="azael-summary-value">
                {num(totals?.vat15) ? vat15 : ""}
              </div>
            </div>

            <div className="azael-summary-row">
              <div className="azael-summary-label">Total</div>
              <div className="azael-summary-value">
                {num(totals?.total) ? total : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="azael-flex-space" />

        <div className="azael-bottom-zone">
          <div className="azael-bottom-left">
            {isInvoice ? (
              <>
                <div className="azael-bottom-title">Payment Instructions</div>
                <div className="azael-bottom-line">
                  <strong>Account Name:</strong> {accountName}
                </div>
                <div className="azael-bottom-line">
                  <strong>Bank Name:</strong> {bankName}
                </div>
                <div className="azael-bottom-line">
                  <strong>Account Number:</strong> {accountNumber}
                </div>

                <ul className="azael-note-list">
                  <li>Please complete payment via bank transfer.</li>
                  <li>Send the transaction receipt for verification.</li>
                  <li>
                    Your official receipt will be issued once payment is
                    confirmed.
                  </li>
                </ul>
              </>
            ) : (
              <>
                <div className="azael-bottom-title">NOTE:</div>
                <div className="azael-bottom-line">
                  The above price are including 15% vat
                </div>
                <div className="azael-bottom-line">
                  A 60% advance payment must be issues before project stated
                </div>
                <div className="azael-bottom-line">
                  Delivery date {deliveryDate || "__________"}{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; working days
                </div>
                <div className="azael-bottom-line">
                  the price is valid for 10 working days
                </div>
              </>
            )}
          </div>

          <div className="azael-stamp-sign">
            <div className="azael-stamp-box">
              {sealSrc ? (
                <img
                  src={sealSrc}
                  alt="Company seal"
                  className="azael-stamp-img"
                />
              ) : (
                <div className="azael-stamp-fallback">SEAL</div>
              )}
            </div>

            <div className="azael-sign-box">
              <div className="azael-sign-name">Fikadseelassie Ayana</div>
              <div className="azael-sign-title">General manager</div>
            </div>
          </div>
        </div>

        <div className="azael-footer">
          <div className="azael-footer-title">አድራሻ</div>
          <div className="azael-footer-phones">0941431532 | 0944781211</div>
          <div className="azael-footer-bottom">
            <span>info@azaelprinting.com</span>
            <span>● ● ●</span>
            <span>www.azaelprinting.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
