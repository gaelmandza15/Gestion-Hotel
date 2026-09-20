// ROLE: Données de démo pour initialisation
// INPUT: Aucun
// OUTPUT: Objets mock (reservations, rooms, clients)
// DEPENDS ON: DYNAMIC_RULES.md (respect des règles métier)

import { format } from 'date-fns'

// Génération de dates relatives à aujourd'hui
const today = new Date()
const addDays = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
const formatDate = (date) => format(date, 'yyyy-MM-dd')

export const mockClients = [
  {
    id: 'client_001',
    nom: 'Marc Mba',
    telephone: '+241 77 88 99 00',
    email: 'marc.mba@email.ga',
    adresse: 'Quartier Louis, Libreville',
    ville: 'Libreville',
    pays: 'gabon',
    typeClient: 'particulier',
    vip: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_002',
    nom: 'Sarah Kassa',
    telephone: '+225 07 08 09 10',
    email: 'sarah.kassa@email.ci',
    adresse: 'Cocody Riviera 2, Abidjan',
    ville: 'Abidjan',
    pays: 'coteDivoire',
    typeClient: 'particulier',
    vip: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_003',
    nom: 'Jean-Paul Biyogho',
    telephone: '+237 677 88 99 00',
    email: 'jp.biyogho@company.cm',
    adresse: 'Bastos, Yaoundé',
    ville: 'Yaoundé',
    pays: 'cameroun',
    typeClient: 'entreprise',
    nif: 'CM123456789',
    vip: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'client_004',
    nom: 'Chantal Nziengui',
    telephone: '+241 66 55 44 33',
    email: '',
    adresse: 'Akanda, BP 1234',
    ville: 'Akanda',
    pays: 'gabon',
    typeClient: 'particulier',
    vip: false,
    createdAt: new Date().toISOString()
  }
]

export const mockRooms = [
  {
    id: 'room_101',
    numero: '101',
    nom: 'Chambre 101',
    type: 'Standard Simple',
    capacite: 1,
    prixBase: 50000,
    statut: 'disponible',
    etage: 1,
    caracteristiques: ['Climatisation', 'WiFi', 'TV'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_102',
    numero: '102',
    nom: 'Chambre 102',
    type: 'Suite Deluxe',
    capacite: 2,
    prixBase: 87500,
    statut: 'occupee',
    etage: 1,
    caracteristiques: ['Climatisation', 'WiFi', 'TV', 'Mini-bar', 'Balcon'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_201',
    numero: '201',
    nom: 'Chambre 201',
    type: 'Standard Double',
    capacite: 2,
    prixBase: 60000,
    statut: 'disponible',
    etage: 2,
    caracteristiques: ['Climatisation', 'WiFi', 'TV'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_204',
    numero: '204',
    nom: 'Chambre 204',
    type: 'Standard Double',
    capacite: 2,
    prixBase: 60000,
    statut: 'occupee',
    etage: 2,
    caracteristiques: ['Climatisation', 'WiFi', 'TV'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_301',
    numero: '301',
    nom: 'Chambre 301',
    type: 'Penthouse',
    capacite: 4,
    prixBase: 170000,
    statut: 'occupee',
    etage: 3,
    caracteristiques: ['Climatisation', 'WiFi', 'TV', 'Mini-bar', 'Jacuzzi', 'Vue panoramique'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'room_108',
    numero: '108',
    nom: 'Chambre 108',
    type: 'Standard Simple',
    capacite: 1,
    prixBase: 40000,
    statut: 'nettoyage',
    etage: 1,
    caracteristiques: ['Climatisation', 'WiFi', 'TV'],
    createdAt: new Date().toISOString()
  }
]

export const mockReservations = [
  {
    id: 'res_001',
    clientId: 'client_001',
    roomId: 'room_102',
    dateArrivee: formatDate(addDays(-2)),
    dateDepart: formatDate(addDays(2)),
    statut: 'confirmee',
    nbNuits: 4,
    nbAdultes: 1,
    nbEnfants: 0,
    montantTotal: 350000,
    montantPaye: 100000,
    resteAPayer: 250000,
    modePaiement: 'orange_money',
    numeroTransaction: 'OM202609180001',
    notes: 'Client fidèle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res_002',
    clientId: 'client_002',
    roomId: 'room_204',
    dateArrivee: formatDate(addDays(-1)),
    dateDepart: formatDate(addDays(1)),
    statut: 'en_cours',
    nbNuits: 2,
    nbAdultes: 2,
    nbEnfants: 0,
    montantTotal: 180000,
    montantPaye: 180000,
    resteAPayer: 0,
    modePaiement: 'especes',
    numeroTransaction: '',
    notes: '',
    checkInAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res_003',
    clientId: 'client_003',
    roomId: 'room_301',
    dateArrivee: formatDate(addDays(-5)),
    dateDepart: formatDate(addDays(0)),
    statut: 'en_cours',
    nbNuits: 5,
    nbAdultes: 2,
    nbEnfants: 2,
    montantTotal: 850000,
    montantPaye: 400000,
    resteAPayer: 450000,
    modePaiement: 'virement',
    referenceVirement: 'VIR2026091501',
    notes: 'Client VIP - Entreprise',
    checkInAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res_004',
    clientId: 'client_004',
    roomId: 'room_108',
    dateArrivee: formatDate(addDays(0)),
    dateDepart: formatDate(addDays(2)),
    statut: 'confirmee',
    nbNuits: 2,
    nbAdultes: 1,
    nbEnfants: 0,
    montantTotal: 120000,
    montantPaye: 0,
    resteAPayer: 120000,
    modePaiement: 'especes',
    numeroTransaction: '',
    notes: 'Arrivée aujourd\'hui',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Données d'établissement par défaut
export const defaultEstablishment = {
  nom: 'Hôtel Le Palmier',
  adresse: 'Quartier Industriel, BP 5678',
  ville: 'Libreville',
  pays: 'gabon',
  telephone: '+241 77 00 00 00',
  email: 'contact@hotelpalmier.ga',
  nif: 'GA20240001234',
  rccm: 'RB/LBV/2024/B/12345',
  regimeFiscal: 'reel',
  tvaAssujetti: true,
  tauxTva: 18,
  devise: 'XAF',
  langue: 'fr',
  facturationNormalisee: false,
  taxeSejourMontant: 0,
  taxeSejourPar: 'nuit',
  prefixeFacture: 'FAC',
  exerciceComptable: new Date().getFullYear()
}
