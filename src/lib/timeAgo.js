// Tiny "x minutes ago" helper — keeps Home feed timestamps friendly.
const UNITS = [
  { label: "year", seconds: 60 * 60 * 24 * 365 },
  { label: "month", seconds: 60 * 60 * 24 * 30 },
  { label: "week", seconds: 60 * 60 * 24 * 7 },
  { label: "day", seconds: 60 * 60 * 24 },
  { label: "hour", seconds: 60 * 60 },
  { label: "minute", seconds: 60 },
];

export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  for (const u of UNITS) {
    const count = Math.floor(seconds / u.seconds);
    if (count >= 1) return `${count} ${u.label}${count === 1 ? "" : "s"} ago`;
  }
  return "just now";
}
