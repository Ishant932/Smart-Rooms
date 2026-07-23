import { Download } from 'lucide-react';

function escapeCsv(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function downloadCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadCsvButton({ filename, rows, label = 'Download CSV', className = '' }) {
  return (
    <button
      type="button"
      onClick={() => downloadCsv(filename, rows)}
      disabled={!rows?.length}
      className={`inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <Download size={16} />
      {label}
    </button>
  );
}
