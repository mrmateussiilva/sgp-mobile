const ISO_DATE_PREFIX_REGEX = /^(\d{4})-(\d{2})-(\d{2})/

const toLocalDateFromParts = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day)
}

export const parseApiDate = (value: string | null | undefined): Date | null => {
  if (!value) return null

  const dateOnlyMatch = value.match(ISO_DATE_PREFIX_REGEX)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    return toLocalDateFromParts(Number(year), Number(month), Number(day))
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const getDateKey = (value: string | Date | null | undefined): string | null => {
  if (!value) return null

  if (typeof value === 'string') {
    const dateOnlyMatch = value.match(ISO_DATE_PREFIX_REGEX)
    if (dateOnlyMatch) return dateOnlyMatch[0]
  }

  const date = value instanceof Date ? value : parseApiDate(value)
  if (!date || Number.isNaN(date.getTime())) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDatePtBR = (
  value: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback = 'N/A',
): string => {
  const date = parseApiDate(value)
  if (!date) return fallback
  return date.toLocaleDateString('pt-BR', options)
}

export const getTodayKeyLocal = (): string => {
  return getDateKey(new Date()) as string
}

export const getCurrentMonthStartKeyLocal = (): string => {
  const now = new Date()
  return getDateKey(new Date(now.getFullYear(), now.getMonth(), 1)) as string
}
