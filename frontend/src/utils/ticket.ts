export function formatTicketDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function getTicketShortCode(code: string): string {
  const parts = code.split('-')
  return parts[parts.length - 1] ?? code.slice(-6)
}

export function getEnrollmentId(userId: string): string {
  const slug = userId.replace(/-/g, '').slice(0, 8).toUpperCase()
  return `USP-${slug}`
}

export function getUniversityLabel(email: string): string {
  const domain = email.split('@')[1]?.split('.')[0] ?? 'vibeu'
  return domain.length <= 4 ? domain.toUpperCase() : domain.slice(0, 4).toUpperCase()
}
