// Data local no formato "AAAA-MM-DD" (toISOString usaria UTC e,
// depois das 21h no horário de Brasília, já cairia no dia seguinte)
export function dataLocalISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// "AAAA-MM-DD" -> Date local (sem conversão de fuso)
export function parseDataISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "AAAA-MM-DD" -> "DD/MM/AAAA"
export function formatDataBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
