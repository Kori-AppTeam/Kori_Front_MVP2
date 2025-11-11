export const isMeaningfulName = (v?: any) => {
  const s = String(v ?? '').trim();
  if (!s) return false;
  const lower = s.toLowerCase();
  return !['unknown', 'null', 'undefined', '-', '—'].includes(lower);
};

export const pickNonEmpty = (...vals: any[]) => {
  for (const v of vals) {
    const s = String(v ?? '').trim();
    if (s) return s;
  }
  return '';
};

// 다른 파일과 중복: 추후 삭제
export function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

// 다른 파일과 중복: 추후 삭제
export function parseDateFlexible(v?: unknown): Date | null {
  if (v == null) return null;
  let s = String(v).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return new Date(parseFloat(s) * 1000);
  if (!s.includes('T') && s.includes(' ')) s = s.replace(' ', 'T');
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// 다른 파일 util과 이름 중복 -> 수정 필요
export function toDateLabel(raw?: unknown, fallbackIso?: string): string {
  let d = parseDateFlexible(raw);
  if ((!d || isNaN(d.getTime())) && fallbackIso) d = parseDateFlexible(fallbackIso);
  if (!d) return '';
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(d).replace(/-/g, '/');
  } catch {
    return `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;
  }
}