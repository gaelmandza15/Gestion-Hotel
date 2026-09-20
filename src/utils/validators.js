// ROLE: Validation des formulaires (téléphone, NIF, etc.)
// INPUT: Données de formulaire
// OUTPUT: Objet { valid: boolean, errors: array }
// DEPENDS ON: DYNAMIC_RULES.md sections 2, 7

// Valider un téléphone (obligatoire, format libre)
export const validateTelephone = (telephone) => {
  if (!telephone || telephone.trim() === '') {
    return { valid: false, message: 'Le téléphone est obligatoire' }
  }
  
  // Nettoyage basique
  const clean = telephone.replace(/[\s.-]/g, '')
  
  // Minimum 8 chiffres
  const digits = clean.match(/\d/g)
  if (!digits || digits.length < 8) {
    return { valid: false, message: 'Numéro de téléphone invalide (minimum 8 chiffres)' }
  }
  
  return { valid: true, message: '' }
}

// Valider un email (optionnel mais doit être valide si présent)
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: true, message: '' } // Optionnel
  }
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regex.test(email)) {
    return { valid: false, message: 'Adresse email invalide' }
  }
  
  return { valid: true, message: '' }
}

// Valider un NIF/identifiant fiscal (optionnel, format variable par pays)
export const validateNIF = (nif, pays = null) => {
  if (!nif || nif.trim() === '') {
    return { valid: true, message: '' } // Optionnel
  }
  
  const clean = nif.trim().toUpperCase()
  
  // Minimum 6 caractères alphanumériques
  if (clean.length < 6) {
    return { valid: false, message: 'Identifiant fiscal trop court' }
  }
  
  // Doit contenir au moins une lettre et un chiffre
  const hasLetter = /[A-Z]/.test(clean)
  const hasDigit = /\d/.test(clean)
  
  if (!hasLetter || !hasDigit) {
    return { valid: false, message: 'Format identifiant fiscal invalide' }
  }
  
  return { valid: true, message: '' }
}

// Valider les dates d'une réservation
export const validateReservationDates = (dateArrivee, dateDepart) => {
  const errors = []
  
  if (!dateArrivee) {
    errors.push('La date d\'arrivée est obligatoire')
  }
  
  if (!dateDepart) {
    errors.push('La date de départ est obligatoire')
  }
  
  if (dateArrivee && dateDepart) {
    const arrival = new Date(dateArrivee)
    const departure = new Date(dateDepart)
    
    if (departure <= arrival) {
      errors.push('La date de départ doit être après la date d\'arrivée')
    }
    
    // Vérifier que l'arrivée n'est pas dans le passé lointain
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (arrival < today) {
      // On permet pour les réservations en cours, mais on pourrait avertir
      // errors.push('La date d\'arrivée ne peut pas être dans le passé')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Valider un client complet
export const validateClient = (client) => {
  const errors = []
  
  // Nom obligatoire
  if (!client.nom || client.nom.trim() === '') {
    errors.push('Le nom du client est obligatoire')
  }
  
  // Téléphone obligatoire
  const telValidation = validateTelephone(client.telephone)
  if (!telValidation.valid) {
    errors.push(telValidation.message)
  }
  
  // Email optionnel mais doit être valide
  const emailValidation = validateEmail(client.email)
  if (!emailValidation.valid) {
    errors.push(emailValidation.message)
  }
  
  // NIF optionnel mais doit être valide
  const nifValidation = validateNIF(client.nif, client.pays)
  if (!nifValidation.valid) {
    errors.push(nifValidation.message)
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Valider une réservation complète
export const validateReservation = (reservation) => {
  const errors = []
  
  // Client
  if (!reservation.clientId) {
    errors.push('Client non sélectionné')
  }
  
  // Chambre
  if (!reservation.roomId) {
    errors.push('Chambre non sélectionnée')
  }
  
  // Dates
  const datesValidation = validateReservationDates(
    reservation.dateArrivee,
    reservation.dateDepart
  )
  if (!datesValidation.valid) {
    errors.push(...datesValidation.errors)
  }
  
  // Nombre de personnes
  if (!reservation.nbAdultes || reservation.nbAdultes < 1) {
    errors.push('Au moins un adulte est requis')
  }
  
  // Montant
  if (!reservation.montantTotal || reservation.montantTotal <= 0) {
    errors.push('Le montant total doit être supérieur à zéro')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Valider un paiement
export const validatePayment = (payment) => {
  const errors = []
  
  // Montant
  if (!payment.montant || payment.montant <= 0) {
    errors.push('Le montant du paiement est requis')
  }
  
  // Mode de paiement
  if (!payment.mode || payment.mode.trim() === '') {
    errors.push('Le mode de paiement est requis')
  }
  
  // Numéro de transaction pour Mobile Money
  if (payment.mode.includes('money') && !payment.numeroTransaction) {
    errors.push('Le numéro de transaction est requis pour Mobile Money')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Échapper les entrées utilisateur (XSS prevention basique)
export const sanitizeInput = (str) => {
  if (!str) return ''
  
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

// Nettoyer un objet de toutes ses entrées
export const sanitizeObject = (obj) => {
  const cleaned = {}
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      cleaned[key] = sanitizeInput(obj[key])
    } else {
      cleaned[key] = obj[key]
    }
  }
  
  return cleaned
}
