// ROLE: Configuration des pays (TVA, devise, identifiants fiscaux)
// INPUT: Aucun (données statiques)
// OUTPUT: Objet COUNTRIES avec configs par pays
// DEPENDS ON: DYNAMIC_RULES.md section 2

export const COUNTRIES = {
  senegal: {
    id: 'senegal',
    nom: 'Sénégal',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NINEA',
    prefixeTelephone: '+221',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  coteDivoire: {
    id: 'coteDivoire',
    nom: 'Côte d\'Ivoire',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NIF',
    identifiantFiscal2: 'RCCM',
    prefixeTelephone: '+225',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr',
    facturationNormalisee: true
  },
  cameroun: {
    id: 'cameroun',
    nom: 'Cameroun',
    devise: 'XAF',
    tvaStandard: 19.25,
    tvaHebergement: 19.25,
    identifiantFiscal: 'NIU',
    prefixeTelephone: '+237',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  gabon: {
    id: 'gabon',
    nom: 'Gabon',
    devise: 'XAF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+241',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  congo: {
    id: 'congo',
    nom: 'Congo (Brazzaville)',
    devise: 'XAF',
    tvaStandard: 18.9,
    tvaHebergement: 18.9,
    identifiantFiscal: 'NIU',
    prefixeTelephone: '+242',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  rdc: {
    id: 'rdc',
    nom: 'République Démocratique du Congo',
    devise: 'CDF',
    tvaStandard: 16,
    tvaHebergement: 16,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+243',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  mali: {
    id: 'mali',
    nom: 'Mali',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+223',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  burkina: {
    id: 'burkina',
    nom: 'Burkina Faso',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'IFU',
    prefixeTelephone: '+226',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  benin: {
    id: 'benin',
    nom: 'Bénin',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'IFU',
    prefixeTelephone: '+229',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  togo: {
    id: 'togo',
    nom: 'Togo',
    devise: 'XOF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+228',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  niger: {
    id: 'niger',
    nom: 'Niger',
    devise: 'XOF',
    tvaStandard: 19,
    tvaHebergement: 19,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+227',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  guinee: {
    id: 'guinee',
    nom: 'Guinée',
    devise: 'GNF',
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+224',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  maroc: {
    id: 'maroc',
    nom: 'Maroc',
    devise: 'MAD',
    tvaStandard: 20,
    tvaHebergement: 10,
    identifiantFiscal: 'IF',
    identifiantFiscal2: 'RC',
    prefixeTelephone: '+212',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  tunisie: {
    id: 'tunisie',
    nom: 'Tunisie',
    devise: 'TND',
    tvaStandard: 19,
    tvaHebergement: 7,
    identifiantFiscal: 'MF',
    prefixeTelephone: '+216',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  algerie: {
    id: 'algerie',
    nom: 'Algérie',
    devise: 'DZD',
    tvaStandard: 19,
    tvaHebergement: 9,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+213',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  },
  madagascar: {
    id: 'madagascar',
    nom: 'Madagascar',
    devise: 'MGA',
    tvaStandard: 20,
    tvaHebergement: 20,
    identifiantFiscal: 'NIF',
    prefixeTelephone: '+261',
    formatDate: 'DD/MM/YYYY',
    langue: 'fr'
  }
}

// Liste des pays pour les selects UI
export const getCountriesList = () => {
  return Object.values(COUNTRIES).map(country => ({
    id: country.id,
    nom: country.nom,
    devise: country.devise
  }))
}

// Obtenir config d'un pays spécifique
export const getCountryConfig = (countryId) => {
  return COUNTRIES[countryId] || COUNTRIES.senegal // fallback
}

// Obtenir taux TVA pour un pays
export const getTvaRate = (countryId, type = 'standard') => {
  const country = COUNTRIES[countryId] || COUNTRIES.senegal
  return type === 'hebergement' ? country.tvaHebergement : country.tvaStandard
}
