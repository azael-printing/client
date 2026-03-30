import logo from "../../assets/logo.png";
import seal from "../../assets/seal.png";

function formatDate(value) {
  if (!value) return "DD/MM/YYYY";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function QuotationDocument({
  type = "invoice", // "invoice" | "proforma"
  number = "",
  date = "",
  customerName = "",
  tin = "",
  items = [],
  subtotal = 0,
  vat = 0,
  total = 0,
}) {
  const isInvoice = type === "invoice";
  const title = isInvoice ? "INVOICE" : "PROFORMA";
  const numberLabel = isInvoice ? "INVOICE NUMBER" : "PROFORMA NUMBER";

  return (
    <div className="mx-auto w-full max-w-[794px] bg-[#ECECEC] text-[#0F172A] shadow print:shadow-none">
      <div className="relative min-h-[1123px] overflow-hidden">
        {/* top curves */}
        <div className="absolute left-0 top-0 h-[112px] w-[300px] rounded-br-[44px] bg-[#1074B8]" />
        <div className="absolute right-[22px] top-[18px] h-[11px] w-[82px] rounded-full bg-[#1074B8]" />
        <div className="absolute right-[22px] top-[40px] h-[11px] w-[60px] rounded-full bg-[#1074B8]" />

        {/* footer */}
        <div className="absolute bottom-0 left-0 right-0 h-[56px] bg-[#1074B8]" />

        {/* logo area */}
        <div className="absolute left-[36px] top-[18px] z-10">
          <img src={logo} alt="Azael Printing" className="h-[82px] w-auto" />
          <div className="ml-[22px] -mt-[8px] text-[22px] font-semibold tracking-tight text-white">
            {title}
          </div>
        </div>

        {/* header info */}
        <div className="absolute right-[40px] top-[126px] text-right leading-[1.35]">
          <div className="text-[14px] font-semibold text-[#3C63B7]">
            <span className="font-bold">TIN</span>{" "}
            <span className="text-[#2F3B4B]">0082555133</span>
          </div>
          <div className="text-[14px] font-semibold text-[#3C63B7]">
            <span className="font-bold">VAT REG</span>{" "}
            <span className="text-[#2F3B4B]">19889750816</span>
          </div>
          <div className="text-[14px] font-semibold text-[#3C63B7]">
            <span className="font-bold">{numberLabel}</span>{" "}
            <span className="text-[#2F3B4B]">{number || "AZ-INV-00001"}</span>
          </div>
          <div className="text-[14px] font-semibold text-[#3C63B7]">
            <span className="font-bold">DATE</span>{" "}
            <span className="text-[#2F3B4B]">{formatDate(date)}</span>
          </div>
        </div>

        {/* client info */}
        <div className="absolute left-[26px] top-[220px] right-[40px]">
          <div className="flex items-center gap-2 text-[16px] text-[#2D5CC2]">
            <span className="whitespace-nowrap">PRICING QUATATION TO:</span>
            <div className="h-[2px] flex-1 bg-[#7D92E8]" />
          </div>
          <div className="mt-[6px] ml-[145px] flex items-center gap-2 text-[16px] text-[#2D5CC2]">
            <span className="whitespace-nowrap">TIN :</span>
            <div className="h-[2px] flex-1 bg-[#7D92E8]" />
          </div>

          {customerName && (
            <div className="absolute left-[182px] top-[-2px] text-[15px] text-[#111827]">
              {customerName}
            </div>
          )}

          {tin && (
            <div className="absolute left-[45px] top-[28px] text-[15px] text-[#111827]">
              {tin}
            </div>
          )}
        </div>

        {/* table */}
        <div className="absolute left-[20px] right-[24px] top-[290px]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#1074B8] text-white">
                <th className="w-[4%] border border-[#2E6DD9] px-1 py-2 text-left font-medium">
                  NO
                </th>
                <th className="w-[46%] border border-[#2E6DD9] px-2 py-2 text-left font-medium">
                  Description
                </th>
                <th className="w-[19%] border border-[#2E6DD9] px-2 py-2 text-center font-medium">
                  QTY
                </th>
                <th className="w-[18%] border border-[#2E6DD9] px-2 py-2 text-center font-medium">
                  Unit Price
                </th>
                <th className="w-[13%] border border-[#2E6DD9] px-2 py-2 text-center font-medium">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(items.length, 1) }).map(
                (_, index) => {
                  const item = items[index];
                  return (
                    <tr key={index} className="h-[32px]">
                      <td className="border border-[#2E6DD9] px-1 text-center">
                        {item ? index + 1 : ""}
                      </td>
                      <td className="border border-[#2E6DD9] px-2">
                        {item?.description || ""}
                      </td>
                      <td className="border border-[#2E6DD9] px-2 text-center">
                        {item?.qty || ""}
                      </td>
                      <td className="border border-[#2E6DD9] px-2 text-right">
                        {item?.unitPrice || ""}
                      </td>
                      <td className="border border-[#2E6DD9] px-2 text-right">
                        {item?.total || ""}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>

          <div className="ml-auto mt-0 w-[182px]">
            <div className="grid grid-cols-[1fr_92px] text-[13px]">
              <div className="border border-[#2E6DD9] bg-[#1074B8] px-3 py-[5px] text-right text-white">
                Sub total
              </div>
              <div className="border border-[#2E6DD9] bg-white px-3 py-[5px] text-right">
                {subtotal}
              </div>

              <div className="border border-[#2E6DD9] bg-[#1074B8] px-3 py-[5px] text-right text-white">
                VAT 15%
              </div>
              <div className="border border-[#2E6DD9] bg-white px-3 py-[5px] text-right">
                {vat}
              </div>

              <div className="border border-[#2E6DD9] bg-[#1074B8] px-3 py-[5px] text-right text-white">
                Total
              </div>
              <div className="border border-[#2E6DD9] bg-white px-3 py-[5px] text-right">
                {total}
              </div>
            </div>
          </div>
        </div>

        {/* bottom notes */}
        {isInvoice ? (
          <div className="absolute left-[16px] bottom-[90px] max-w-[360px] text-[12px] leading-[1.25] text-[#3C63B7]">
            <div className="mb-4 text-[14px] font-bold text-[#4966B7]">
              Payment Instructions
            </div>

            <div className="text-[13px] leading-[1.25]">
              <div>
                <span className="font-semibold">Account Name:</span> [Your
                Company Name]
              </div>
              <div>
                <span className="font-semibold">Bank Name:</span> [Bank Name]
              </div>
              <div>
                <span className="font-semibold">Account Number:</span> [Account
                Number]
              </div>
            </div>

            <ul className="mt-4 list-disc pl-4 text-[12px] text-[#4E6CC2]">
              <li>
                Please complete payment via bank transfer and send the
                transaction receipt for verification.
              </li>
              <li>
                Your official receipt will be issued once payment is confirmed.
              </li>
            </ul>
          </div>
        ) : (
          <div className="absolute left-[48px] bottom-[90px] max-w-[320px] text-[13px] leading-[1.55] text-[#4966B7]">
            <div className="mb-1 text-[14px] font-bold">NOTE:</div>
            <div>The above price are including 15% vat</div>
            <div>
              A 60% advance payment must be issues before project stated
            </div>
            <div>Delivery date ___ working days</div>
            <div>the price is valid for 10 working days</div>
          </div>
        )}

        {/* seal and signature */}
        <div className="absolute bottom-[78px] left-[310px]">
          <img
            src={seal}
            alt="Seal"
            className="h-[110px] w-[110px] object-contain"
          />
        </div>

        <div className="absolute bottom-[92px] right-[32px] text-right text-[#4966B7]">
          <div className="text-[14px]">Fikadesselassie Ayana</div>
          <div className="text-[11px] text-[#4F5E79]">General manager</div>
        </div>

        {/* footer content */}
        <div className="absolute bottom-[14px] left-0 right-0 text-center text-white">
          <div className="text-[13px] font-semibold">አዛል</div>
          <div className="text-[12px]">0941413132 | 0944781211</div>
          <div className="text-[10px]">
            info@azaelprinting.com &nbsp;&nbsp; www.azaelprinting.com
          </div>
        </div>
      </div>
    </div>
  );
}
