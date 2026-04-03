import invoiceBg from "../../../assets/invoice-reference-bg.png";
import proformaBg from "../../../assets/proforma-reference-bg.png";

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

function blankRow() {
  return { id: "empty", no: "", description: "", qty: "", unitPrice: "", total: "" };
}

function Cover({ style, color = "#efefef" }) {
  return <div className="absolute" style={{ background: color, ...style }} />;
}

function Value({ className = "", style, children }) {
  return (
    <div
      className={`absolute overflow-hidden whitespace-nowrap text-ellipsis bg-transparent font-semibold text-[#111111] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function TableOverlay({ rows, totals, tableTop = 38, maxBody = 24 }) {
  const cleanRows = rows?.length ? rows : [blankRow()];
  const rowCount = Math.max(1, cleanRows.length);
  const headerH = 4.35;
  const rowH = Math.min(5.5, maxBody / rowCount);
  const totalsTop = tableTop + headerH + rowCount * rowH + 0.5;

  return (
    <>
      <Cover style={{ left: "4%", top: `${tableTop}%`, width: "91.3%", height: `${headerH + rowCount * rowH + 0.15}%` }} color="#ffffff" />
      <div className="absolute left-[4%] w-[91.3%] text-[2%] font-semibold text-[#1679bf]" style={{ top: `${tableTop}%` }}>
        <div className="grid grid-cols-[5%_47%_20%_13%_15%] border border-[#1679bf] bg-[#1679bf] text-white" style={{ height: `${headerH}%` }}>
          <div className="flex items-center justify-center border-r border-white/30">NO</div>
          <div className="flex items-center px-[3%] border-r border-white/30">Description</div>
          <div className="flex items-center justify-center border-r border-white/30">QTY</div>
          <div className="flex items-center justify-center border-r border-white/30">Unit Price</div>
          <div className="flex items-center justify-center">Total Price</div>
        </div>

        {cleanRows.map((row, idx) => (
          <div
            key={row.id || idx}
            className="grid grid-cols-[5%_47%_20%_13%_15%] border-x border-b border-[#1679bf]"
            style={{ height: `${rowH}%` }}
          >
            <div className="flex items-center justify-center border-r border-[#1679bf] px-[1%] text-[1.9%] font-semibold text-[#111111]">
              {row.no}
            </div>
            <div className="flex items-center border-r border-[#1679bf] px-[2.2%] text-[1.9%] font-semibold text-[#111111] overflow-hidden whitespace-nowrap text-ellipsis">
              {row.description}
            </div>
            <div className="flex items-center justify-center border-r border-[#1679bf] px-[1%] text-[1.9%] font-semibold text-[#111111] overflow-hidden whitespace-nowrap text-ellipsis">
              {row.qty}
            </div>
            <div className="flex items-center justify-end border-r border-[#1679bf] px-[5%] text-[1.9%] font-semibold text-[#111111]">
              {row.unitPrice}
            </div>
            <div className="flex items-center justify-end px-[5%] text-[1.9%] font-semibold text-[#111111]">
              {row.total}
            </div>
          </div>
        ))}
      </div>

      <Cover style={{ right: "4.7%", top: `${totalsTop}%`, width: "17.1%", height: "8.35%" }} color="#ffffff" />
      <div className="absolute right-[4.7%] w-[17.1%] text-[2%]" style={{ top: `${totalsTop}%` }}>
        {[formatMoney(totals.subTotal), formatMoney(totals.vat15), formatMoney(totals.total)].map((value, idx) => (
          <div key={idx} className="flex h-[2.78%] items-center justify-end px-[7%] text-[1.95%] font-semibold text-[#111111]">
            {value}
          </div>
        ))}
      </div>
    </>
  );
}

export default function DocumentExactSheet({
  type = "invoice",
  docNumber = "",
  customerName = "",
  tin = "",
  rows = [],
  totals = { subTotal: 0, vat15: 0, total: 0 },
  accountName = "",
  bankName = "",
  accountNumber = "",
}) {
  const isInvoice = type === "invoice";
  const bg = isInvoice ? invoiceBg : proformaBg;
  const docTop = isInvoice ? "18.45%" : "20.75%";
  const dateTop = isInvoice ? "23.85%" : "26.1%";
  const customerTop = isInvoice ? "28.0%" : "29.35%";
  const tinTop = isInvoice ? "31.15%" : "32.45%";
  const tableTop = isInvoice ? 36.1 : 38.0;
  const maxBody = isInvoice ? 18.5 : 18.5;

  return (
    <div className="sheet-page relative overflow-hidden bg-white text-[#1f2937]">
      <img src={bg} alt={isInvoice ? "Invoice template" : "Proforma template"} className="absolute inset-0 h-full w-full object-cover" />

      <Cover style={{ left: "78.2%", top: docTop, width: "16%", height: "2.45%" }} />
      <Cover style={{ left: "78.2%", top: dateTop, width: "16%", height: "2.45%" }} />
      <Cover style={{ left: "44.2%", top: customerTop, width: "31.2%", height: "2.35%" }} />
      <Cover style={{ left: "44.2%", top: tinTop, width: "31.2%", height: "2.35%" }} />

      <Value className="text-right text-[1.95%]" style={{ right: "6.0%", top: docTop, width: "16.8%" }}>
        {docNumber}
      </Value>
      <Value className="text-right text-[1.95%]" style={{ right: "6.0%", top: dateTop, width: "16.8%" }}>
        {todayDisplay()}
      </Value>
      <Value className="text-center text-[1.9%]" style={{ left: "44.8%", top: customerTop, width: "30%" }}>
        {customerName}
      </Value>
      <Value className="text-center text-[1.9%]" style={{ left: "44.8%", top: tinTop, width: "30%" }}>
        {tin}
      </Value>

      <TableOverlay rows={rows} totals={totals} tableTop={tableTop} maxBody={maxBody} />

      {isInvoice ? (
        <>
          <Cover style={{ left: "2.7%", bottom: "5.6%", width: "47.5%", height: "19%" }} />
          <div className="absolute left-[3.2%] bottom-[18.7%] text-[2.1%] font-bold text-[#4966B7]">
            Payment Instructions
          </div>
          <div className="absolute left-[3.2%] bottom-[10.35%] w-[41.5%] text-[1.82%] leading-[1.42] text-[#4E6CC2] font-bold">
            <div>Account Name: <span className="font-medium">{accountName}</span></div>
            <div>Bank Name: <span className="font-medium">{bankName}</span></div>
            <div>Account Number: <span className="font-medium">{accountNumber}</span></div>
          </div>
          <div className="absolute left-[6.2%] bottom-[6.3%] w-[43%] text-[1.72%] leading-[1.36] text-[#4E6CC2] font-semibold">
            <div>- Please complete payment via bank transfer and send the transaction receipt for verification.</div>
            <div>- Your official receipt will be issued once payment is confirmed.</div>
          </div>
        </>
      ) : null}
    </div>
  );
}
