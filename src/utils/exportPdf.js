function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportTableToPdf({ title, headers, rows }) {
  const printable = window.open("", "_blank", "width=1200,height=800");
  if (!printable) return;

  const headerHtml = headers
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join("");

  const rowHtml = rows.length
    ? rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${escapeHtml(cell)}</td>`)
              .join("")}</tr>`,
        )
        .join("")
    : `<tr><td colspan="${headers.length}">No records.</td></tr>`;

  printable.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: "Segoe UI", Arial, sans-serif; padding: 24px; color: #18181b; }
          h1 { margin: 0 0 8px; color: #0b74b9; font-size: 28px; }
          p { margin: 0 0 20px; color: #71717a; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          th, td { border: 1px solid #e4e4e7; padding: 10px 12px; text-align: left; vertical-align: top; font-size: 12px; word-break: break-word; }
          th { background: #f4f4f5; font-weight: 700; }
          tr:nth-child(even) td { background: #fafafa; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <p>Generated ${escapeHtml(new Date().toLocaleString())}</p>
        <table>
          <thead><tr>${headerHtml}</tr></thead>
          <tbody>${rowHtml}</tbody>
        </table>
      </body>
    </html>
  `);
  printable.document.close();
  printable.focus();
  printable.print();
}
