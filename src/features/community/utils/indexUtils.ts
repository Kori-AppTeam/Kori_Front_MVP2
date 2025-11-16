export const isMeaningfulName = (value?: any) => {
  const s = String(value ?? '').trim();
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
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return fmt.format(d).replace(/-/g, '/');
  } catch {
    return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}/${d.getFullYear()}`;
  }
}

export const timeToAgo = (time: string) => {
  const now = new Date();
  const created = new Date(time);

  const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? `1 hour ago` : `${hours} hours ago`;
  }

  return toDateLabel(time);
};
