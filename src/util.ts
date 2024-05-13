export function parseColor(colorString: string): { r: number, g: number, b: number, a: number } | undefined {
  let match

  // Check for HEX format with optional alpha
  match = colorString.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)
  if (match) {
    let hex = match[1]
    const hasAlpha = hex.length === 4 || hex.length === 8
    if (hex.length === 3 || hex.length === 4) {
      // Expand short HEX format to full HEX format
      hex = hex.replace(/./g, '$&$&')
    }
    return {
      r: Number.parseInt(hex.substring(0, 2), 16),
      g: Number.parseInt(hex.substring(2, 4), 16),
      b: Number.parseInt(hex.substring(4, 6), 16),
      a: hasAlpha ? Number.parseInt(hex.substring(6, 8), 16) / 255 : 1,
    }
  }

  // Check for RGB or RGBA format
  match = colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/)
  if (match) {
    return {
      r: Number.parseInt(match[1], 10),
      g: Number.parseInt(match[2], 10),
      b: Number.parseInt(match[3], 10),
      a: match[4] ? Number.parseFloat(match[4]) : 1,
    }
  }
}

export function parseBoolean(s: string): boolean {
  return !!s?.length && ['on', 'true', 'yes', 'y', '1'].includes(s.toLowerCase())
}

export function parseDate(s: string): Date | undefined {
  const regexs = [
    /^(?<YYYY>\d{4})-(?<MM>\d{2})-(?<DD>\d{2})\s(?<HH>\d{2}):(?<mm>\d{2}):(?<ss>\d{2})$/,
    /^(?<YYYY>\d{4})\/(?<MM>\d{2})\/(?<DD>\d{2})\s(?<HH>\d{2}):(?<mm>\d{2}):(?<ss>\d{2})$/,
  ]

  for (const re of regexs) {
    const match = s.match(re)
    if (!match)
      continue
    const { YYYY, MM, DD, HH, mm, ss } = match.groups!

    const year = Number.parseInt(YYYY)
    const month = Number.parseInt(MM)
    const day = Number.parseInt(DD)
    const hour = Number.parseInt(HH)
    const minute = Number.parseInt(mm)
    const second = Number.parseInt(ss)

    const daysOfMonth = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

    if (month <= 0 || month > 12)
      continue

    if (day <= 0 || day > daysOfMonth[month - 1])
      continue

    if (hour < 0 || hour > 23)
      continue

    if (minute < 0 || minute > 59)
      continue

    if (second < 0 || second > 59)
      continue

    return new Date(year, month - 1, day, hour, minute, second)
  }
}
