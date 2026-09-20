# 📜 DYNAMIC_RULES.md - Règles Métier et Configurations

> **IMPORTANT:** Ce fichier contient TOUTES les règles configurables de l'application.  
> **NE JAMAIS** hardcoder ces valeurs dans le code. Toujours les lire depuis ce fichier ou les services.

---

## 💰 1. DEVISES ET FORMATAGE

### Règle FCFA
```javascript
{
  devise: "XAF" | "XOF" | "CDF" | "GNF" | "MGA",
  decimales: 0,  // TOUJOURS 0 pour FCFA
  separateurMilliers: " ",  // 5 000 FCFA
  symbole: "FCFA",  // Affiché après le montant
  positionSymbole: "after"  // "1000 FCFA"
}
```

### Autres Devises
```javascript
{
  MAD: { decimales: 2, separateur: ".", symbole: "DH", position: "after" },
  TND: { decimales: 3, separateur: ".", symbole: "DT", position: "after" },
  DZD: { decimales: 2, separateur: ".", symbole: "DA", position: "after" }
}
```

---

## 🌍 2. CONFIGURATIONS PAR PAYS

```javascript
const COUNTRIES = {
  senegal: {
    nom: "Sénégal",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NINEA",
    prefixeTelephone: "+221",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  coteDivoire: {
    nom: "Côte d'Ivoire",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NIF",
    identifiantFiscal2: "RCCM",
    prefixeTelephone: "+225",
    formatDate: "DD/MM/YYYY",
    langue: "fr",
    facturationNormalisee: true  // FNE obligatoire
  },
  cameroun: {
    nom: "Cameroun",
    devise: "XAF",
    tvaStandard: 19.25,
    tvaHebergement: 19.25,
    identifiantFiscal: "NIU",
    prefixeTelephone: "+237",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  gabon: {
    nom: "Gabon",
    devise: "XAF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+241",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  congo: {
    nom: "Congo (Brazzaville)",
    devise: "XAF",
    tvaStandard: 18.9,
    tvaHebergement: 18.9,
    identifiantFiscal: "NIU",
    prefixeTelephone: "+242",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  rdc: {
    nom: "République Démocratique du Congo",
    devise: "CDF",
    tvaStandard: 16,
    tvaHebergement: 16,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+243",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  mali: {
    nom: "Mali",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+223",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  burkina: {
    nom: "Burkina Faso",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "IFU",
    prefixeTelephone: "+226",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  benin: {
    nom: "Bénin",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "IFU",
    prefixeTelephone: "+229",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  togo: {
    nom: "Togo",
    devise: "XOF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+228",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  niger: {
    nom: "Niger",
    devise: "XOF",
    tvaStandard: 19,
    tvaHebergement: 19,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+227",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  guinee: {
    nom: "Guinée",
    devise: "GNF",
    tvaStandard: 18,
    tvaHebergement: 18,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+224",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  maroc: {
    nom: "Maroc",
    devise: "MAD",
    tvaStandard: 20,
    tvaHebergement: 10,  // Spécifique hébergement
    identifiantFiscal: "IF",
    identifiantFiscal2: "RC",
    prefixeTelephone: "+212",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  tunisie: {
    nom: "Tunisie",
    devise: "TND",
    tvaStandard: 19,
    tvaHebergement: 7,  // Spécifique hébergement
    identifiantFiscal: "MF",
    prefixeTelephone: "+216",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  algerie: {
    nom: "Algérie",
    devise: "DZD",
    tvaStandard: 19,
    tvaHebergement: 9,  // Spécifique hébergement
    identifiantFiscal: "NIF",
    prefixeTelephone: "+213",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  },
  madagascar: {
    nom: "Madagascar",
    devise: "MGA",
    tvaStandard: 20,
    tvaHebergement: 20,
    identifiantFiscal: "NIF",
    prefixeTelephone: "+261",
    formatDate: "DD/MM/YYYY",
    langue: "fr"
  }
}
```

---

## 📱 3. MOYENS DE PAIEMENT

```javascript
const PAYMENT_METHODS = [
  {
    id: "especes",
    nom: "Espèces",
    icon: "💵",
    champsRequis: [],
    dominant: true  // Mode par défaut
  },
  {
    id: "orange_money",
    nom: "Orange Money",
    icon: "🟠",
    champsRequis: ["numeroTransaction"],
    operateur: "Orange"
  },
  {
    id: "mtn_money",
    nom: "MTN Mobile Money",
    icon: "🟡",
    champsRequis: ["numeroTransaction"],
    operateur: "MTN"
  },
  {
    id: "wave",
    nom: "Wave",
    icon: "🔵",
    champsRequis: ["numeroTransaction"],
    operateur: "Wave"
  },
  {
    id: "moov_money",
    nom: "Moov Money",
    icon: "🔷",
    champsRequis: ["numeroTransaction"],
    operateur: "Moov"
  },
  {
    id: "airtel_money",
    nom: "Airtel Money",
    icon: "🔴",
    champsRequis: ["numeroTransaction"],
    operateur: "Airtel"
  },
  {
    id: "virement",
    nom: "Virement bancaire",
    icon: "🏦",
    champsRequis: ["referenceVirement"]
  },
  {
    id: "cheque",
    nom: "Chèque",
    icon: "📄",
    champsRequis: ["numeroCheque", "banque"]
  },
  {
    id: "carte",
    nom: "Carte bancaire",
    icon: "💳",
    champsRequis: ["derniersChiffres"],
    rare: true
  },
  {
    id: "autre",
    nom: "Autre",
    icon: "📝",
    champsRequis: ["description"]
  }
]
```

---

## 🏷️ 4. STATUTS DES RÉSERVATIONS

```javascript
const RESERVATION_STATUSES = [
  {
    id: "devis",
    nom: "Devis",
    couleur: "bg-gray-100 text-gray-700",
    ordre: 1,
    modifiable: true
  },
  {
    id: "confirmee",
    nom: "Confirmée",
    couleur: "bg-amber-50 text-amber-700",
    ordre: 2,
    modifiable: true
  },
  {
    id: "en_cours",
    nom: "En séjour",
    couleur: "bg-blue-50 text-blue-700",
    ordre: 3,
    modifiable: false  // Auto par check-in
  },
  {
    id: "terminee",
    nom: "Terminée",
    couleur: "bg-emerald-50 text-emerald-700",
    ordre: 4,
    modifiable: false  // Auto par check-out
  },
  {
    id: "annulee",
    nom: "Annulée",
    couleur: "bg-rose-50 text-rose-700",
    ordre: 5,
    modifiable: true
  }
]
```

---

## 🏠 5. STATUTS DES CHAMBRES

```javascript
const ROOM_STATUSES = [
  {
    id: "disponible",
    nom: "Disponible",
    couleur: "bg-emerald-500",
    description: "Prête à être louée"
  },
  {
    id: "occupee",
    nom: "Occupée",
    couleur: "bg-amber-500",
    description: "Client en séjour"
  },
  {
    id: "nettoyage",
    nom: "En nettoyage",
    couleur: "bg-rose-500",
    description: "Ménage en cours"
  },
  {
    id: "maintenance",
    nom: "En maintenance",
    couleur: "bg-gray-500",
    description: "Problème technique"
  },
  {
    id: "hors_service",
    nom: "Hors service",
    couleur: "bg-red-600",
    description: "Inutilisable"
  }
]
```

---

## 🧾 6. STRUCTURE FACTURE

### Niveau 1: Simple (Défaut)
```javascript
const INVOICE_SIMPLE_FIELDS = {
  required: [
    "numero",           // Numérotation libre
    "date",             // Date d'émission
    "etablissement",    // Nom + adresse
    "client",           // Nom + téléphone
    "lignes",           // Détails des prestations
    "totalHT",          // Total hors taxe
    "totalTTC"          // Total toutes taxes
  ],
  optional: [
    "nifEtablissement",
    "rccmEtablissement",
    "nifClient",
    "mentionsLegales",
    "modePaiement",
    "acompteVerse"
  ]
}
```

### Niveau 2: Normalisée (Côte d'Ivoire FNE, etc.)
```javascript
const INVOICE_NORMALISEE_FIELDS = {
  ...INVOICE_SIMPLE_FIELDS.required,
  obligatoires: [
    "nifEtablissement",      // NIF émetteur
    "nifClient",             // NIF client (si pro)
    "regimeFiscal",          // Régime (réel, simplifié...)
    "codeOperation",         // Code opération DGI
    "qrCode"                 // QR code de vérification
  ]
}
```

---

## 👤 7. CHAMPS CLIENT

```javascript
const CLIENT_FIELDS = {
  required: [
    "nom",              // Nom complet
    "telephone"         // OBLIGATOIRE (plus important qu'email)
  ],
  optional: [
    "email",            // Optionnel
    "adresse",          // Texte libre (quartier, BP...)
    "ville",            // Optionnel
    "pays",             // Optionnel
    "nif",              // Identifiant fiscal (si pro)
    "typeClient",       // "particulier" | "entreprise"
    "vip",              // booléen
    "notes"             // Texte libre
  ]
}
```

---

## 📅 8. FORMAT DE DATES

```javascript
const DATE_FORMATS = {
  short: "DD/MM/YY",      // 20/09/26
  medium: "DD/MM/YYYY",   // 20/09/2026
  long: "DD MMM YYYY",    // 20 Sep 2026
  full: "dddd DD MMMM YYYY",  // Vendredi 20 Septembre 2026
  avecHeure: "DD/MM/YYYY HH:mm"
}
```

---

## ⚠️ 9. RÈGLES DE GESTION

### Disponibilité Chambre
- **Contrôle bloquant:** Impossible de réserver si chambre occupée
- **Bouton "Forcer":** Pour cas exceptionnels (overbooking)
- **Conflit dates:** Vérifier chevauchement avant confirmation

### Numérotation Factures
- Format: `FAC-2026-0001` (préfixe + année + numéro séquentiel)
- Jamais de trous dans la numérotation
- Reset annuel optionnel

### Taxe de Séjour
- Remplacée par "Taxe de développement touristique"
- Montant fixe par nuit/personne
- Paramétrable par établissement

---

## 🔧 10. PARAMÈTRES ÉTABLISSEMENT

```javascript
const ESTABLISHMENT_SETTINGS = {
  nom: "Nom de l'hôtel",
  adresse: "Adresse complète",
  telephone: "Téléphone principal",
  email: "Email de contact",
  nif: "Numéro Identifiant Fiscal",
  rccm: "Registre Commerce",
  regimeFiscal: "réel" | "simplifie" | "non_soumis",
  tvaAssujetti: true | false,
  tauxTva: 18,  // Pourrait venir du pays
  devise: "XAF",
  langue: "fr",
  facturationNormalisee: false,
  taxeSejourMontant: 0,
  taxeSejourPar: "nuit" | "sejour"
}
```

---

**Dernière mise à jour:** 2026-01-01  
**Version:** 1.0.0
