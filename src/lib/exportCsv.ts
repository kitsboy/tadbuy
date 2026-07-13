/** Build CSV string and trigger browser download (importable to Google Sheets). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function campaignsToCsvRows(
  campaigns: Array<{
    name: string;
    status: string;
    platforms: string[];
    budget?: number;
    impressions?: number;
    clicks?: number;
    ctr?: number;
  }>,
): (string | number)[][] {
  return campaigns.map(c => [
    c.name,
    c.status,
    c.platforms.join('; '),
    c.budget ?? '',
    c.impressions ?? '',
    c.clicks ?? '',
    c.ctr != null ? `${(c.ctr * 100).toFixed(2)}%` : '',
  ]);
}