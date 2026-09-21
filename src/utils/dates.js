// ROLE: Formatage des dates (DD MMM YYYY)
// INPUT: date string ou object Date
// OUTPUT: string formatée selon le contexte
// DEPENDS ON: DYNAMIC_RULES.md section 8

// Noms des mois en français
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]

const MONTHS_FR_SHORT = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
]

const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const DAYS_FR_SHORT = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.']

// Parser une date depuis différents formats
export const parseDate = (dateInput) => {
  if (!dateInput) return null
  
  if (dateInput instanceof Date) {
    return dateInput
  }
  
  // Format ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  // Format FR (DD/MM/YYYY)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
    const [day, month, year] = dateInput.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
  
  return new Date(dateInput)
}

// Formater en DD MMM YYYY (ex: 20 Sep 2026)
export const formatDateLong = (dateInput) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS_FR_SHORT[date.getMonth()]
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}

// Formater en DD/MM/YYYY
export const formatDateShort = (dateInput) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Formater avec jour de la semaine
export const formatDateFull = (dateInput) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  const dayName = DAYS_FR[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS_FR[date.getMonth()]
  const year = date.getFullYear()
  
  return `${dayName} ${day} ${month} ${year}`
}

// Formater pour input date (YYYY-MM-DD)
export const formatDateInput = (dateInput) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${year}-${month}-${day}`
}

// Calculer la différence en jours entre deux dates
export const getDaysDifference = (startDate, endDate) => {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  
  if (!start || !end || isNaN(start) || isNaN(end)) return 0
  
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Ajouter des jours à une date
export const addDays = (dateInput, days) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return null
  
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Vérifier si une date est aujourd'hui
export const isToday = (dateInput) => {
  const date = parseDate(dateInput)
  const today = new Date()
  
  return date && 
         date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

// Vérifier si une date est dans le passé
export const isPast = (dateInput) => {
  const date = parseDate(dateInput)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return date < today
}

// Vérifier si une date est dans le futur
export const isFuture = (dateInput) => {
  const date = parseDate(dateInput)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return date > today
}

// Obtenir le nom du mois
export const getMonthName = (dateInput, short = true) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  return short ? MONTHS_FR_SHORT[date.getMonth()] : MONTHS_FR[date.getMonth()]
}

// Obtenir le nom du jour
export const getDayName = (dateInput, short = true) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  return short ? DAYS_FR_SHORT[date.getDay()] : DAYS_FR[date.getDay()]
}

// Formater une date pour le stockage (YYYY-MM-DD)
export const formatDateForStorage = (dateInput) => {
  const date = parseDate(dateInput)
  if (!date || isNaN(date)) return ''
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${year}-${month}-${day}`
}

// Alias pour formatDate (utilisé dans billingView)
export const formatDate = formatDateLong

// Calculer le nombre de nuits entre deux dates
export const calculateNights = (checkIn, checkOut) => {
  return getDaysDifference(checkIn, checkOut)
}
