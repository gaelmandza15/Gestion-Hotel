// ROLE: Formatage des devises (FCFA sans décimales)
// INPUT: amount (number), currency (string)
// OUTPUT: string formatée (ex: "5 000 FCFA")
// DEPENDS ON: DYNAMIC_RULES.md section 1

// Configuration des devises
const CURRENCY_CONFIG = {
  XAF: { decimales: 0, separateur: ' ', symbole: 'FCFA', position: 'after' },
  XOF: { decimales: 0, separateur: ' ', symbole: 'FCFA', position: 'after' },
  CDF: { decimales: 0, separateur: ' ', symbole: 'FC', position: 'after' },
  GNF: { decimales: 0, separateur: ' ', symbole: 'GNF', position: 'after' },
  MGA: { decimales: 0, separateur: ' ', symbole: 'Ar', position: 'after' },
  MAD: { decimales: 2, separateur: '.', symbole: 'DH', position: 'after' },
  TND: { decimales: 3, separateur: '.', symbole: 'DT', position: 'after' },
  DZD: { decimales: 2, separateur: '.', symbole: 'DA', position: 'after' }
}

// Formater un montant selon la devise
export const formatCurrency = (amount, currency = 'XAF') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 FCFA'
  }

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.XAF
  const nombre = Number(amount).toFixed(config.decimales)
  
  // Séparateur de milliers
  const parties = nombre.split('.')
  parties[0] = parties[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.separateur)
  const formatted = parties.join('.')

  // Position du symbole
  if (config.position === 'before') {
    return `${config.symbole}${formatted}`
  }
  
  return `${formatted} ${config.symbole}`
}

// Formater avec le code devise complet
export const formatCurrencyFull = (amount, currency = 'XAF') => {
  const base = formatCurrency(amount, currency)
  
  // Pour FCFA, on affiche le code ISO entre parenthèses
  if (['XAF', 'XOF'].includes(currency)) {
    return `${base} (${currency})`
  }
  
  return base
}

// Convertir en nombre (pour les inputs)
export const parseCurrency = (str, currency = 'XAF') => {
  if (!str) return 0
  
  // Supprimer le symbole et les espaces
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.XAF
  let clean = str.replace(config.symbole, '')
  clean = clean.replace(config.separateur, '')
  clean = clean.trim()
  
  return parseFloat(clean) || 0
}

// Calculer la TVA
export const calculateTVA = (montantHT, tauxTVA) => {
  const ht = Number(montantHT) || 0
  const taux = Number(tauxTVA) || 0
  const tva = ht * (taux / 100)
  const ttc = ht + tva
  
  return {
    ht: Math.round(ht),
    tva: Math.round(tva),
    ttc: Math.round(ttc),
    taux: taux
  }
}

// Formater un pourcentage
export const formatPercentage = (value, decimales = 1) => {
  return `${Number(value).toFixed(decimales)}%`
}
