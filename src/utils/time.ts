// Mapeo de getDay() JS (0=Sunday) a clave del objeto hours
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function parseTimeRange(range: string): { openMin: number; closeMin: number } | null {
  const parts = range.split("-");
  if (parts.length !== 2) return null;
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };
  return { openMin: toMin(parts[0]), closeMin: toMin(parts[1]) };
}

export function todayKey(): string {
  return DAY_KEYS[new Date().getDay()];
}

export function isOpenNow(hours: Record<string, string | null>): boolean {
  const key = todayKey();
  const range = hours[key];
  if (!range) return false;
  const parsed = parseTimeRange(range);
  if (!parsed) return false;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= parsed.openMin && nowMin < parsed.closeMin;
}

export function getOpenStatus(hours: Record<string, string | null>): {
  isOpen: boolean;
  label: string;
  color: "green" | "amber" | "red";
} {
  const key = todayKey();
  const range = hours[key];
  if (!range) return { isOpen: false, label: "Cerrado hoy", color: "red" };
  const parsed = parseTimeRange(range);
  if (!parsed) return { isOpen: false, label: "Cerrado", color: "red" };
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (nowMin < parsed.openMin) {
    const opens = range.split("-")[0];
    return { isOpen: false, label: `Abre a las ${opens}`, color: "red" };
  }
  if (nowMin >= parsed.closeMin) return { isOpen: false, label: "Cerrado", color: "red" };
  const minsLeft = parsed.closeMin - nowMin;
  const closes = range.split("-")[1];
  if (minsLeft <= 60) return { isOpen: true, label: `Cierra a las ${closes}`, color: "amber" };
  return { isOpen: true, label: `Abierto · Cierra ${closes}`, color: "green" };
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
