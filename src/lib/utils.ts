import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy") {
  const dateObj = typeof date === "string" ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy HH:mm")
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatWeight(weight: number) {
  return `${weight.toFixed(2)} kg`
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateRut(rut: string) {
  // Simple Chilean RUT validation
  const rutRegex = /^[0-9]+-[0-9kK]{1}$/
  return rutRegex.test(rut)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function calculateNetWeight(grossWeight: number, tare: number) {
  return Math.max(0, grossWeight - tare)
}

export function getStatusColor(status: string) {
  switch (status) {
    case "pendiente":
      return "bg-warning-100 text-warning-700 border-warning-200"
    case "sincronizado":
      return "bg-aqua-100 text-aqua-700 border-aqua-200"
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/20"
    case "activo":
      return "bg-aqua-100 text-aqua-700 border-aqua-200"
    case "inactivo":
      return "bg-muted text-muted-foreground border-border"
    case "pagado":
      return "bg-aqua-100 text-aqua-700 border-aqua-200"
    case "vencido":
      return "bg-destructive/10 text-destructive border-destructive/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getStatusText(status: string) {
  switch (status) {
    case "pendiente":
      return "Pendiente"
    case "sincronizado":
      return "Sincronizado"
    case "error":
      return "Error"
    case "activo":
      return "Activo"
    case "inactivo":
      return "Inactivo"
    case "pagado":
      return "Pagado"
    case "vencido":
      return "Vencido"
    case "prueba":
      return "Prueba"
    case "suspendido":
      return "Suspendido"
    case "cancelado":
      return "Cancelado"
    default:
      return status
  }
}

export function isTrialExpired(expirationDate: string | Date) {
  const expDate = typeof expirationDate === "string" ? parseISO(expirationDate) : expirationDate
  return new Date() > expDate
}

export function getDaysUntilExpiration(expirationDate: string | Date) {
  const expDate = typeof expirationDate === "string" ? parseISO(expirationDate) : expirationDate
  const diffTime = expDate.getTime() - new Date().getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}