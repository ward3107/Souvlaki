// Small date helpers shared by the admin dashboards.
export function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function daysAgo(n: number): number {
  return new Date().getTime() - n * 24 * 60 * 60 * 1000;
}
