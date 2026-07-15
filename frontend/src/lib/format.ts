export function formatMonthYear(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : 'Present'}`
}
