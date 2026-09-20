// ROLE: Rendu du tableau des réservations
// INPUT: Element DOM, appState
// OUTPUT: Tableau HTML injecté dans le DOM
// DEPENDS ON: utils/currency.js, utils/dates.js

import { formatCurrency } from '../utils/currency.js'
import { formatDateLong, isToday } from '../utils/dates.js'

// Configuration des statuts
const STATUS_CONFIG = {
  devis: { label: 'Devis', color: 'bg-gray-100 text-gray-700' },
  confirmee: { label: 'Confirmée', color: 'bg-amber-50 text-amber-700' },
  en_cours: { label: 'En séjour', color: 'bg-blue-50 text-blue-700' },
  terminee: { label: 'Terminée', color: 'bg-emerald-50 text-emerald-700' },
  annulee: { label: 'Annulée', color: 'bg-rose-50 text-rose-700' }
}

// Générer le HTML complet de la vue réservations
export const renderReservationsTable = (container, appState) => {
  if (!container) return
  
  const currency = appState.establishment?.devise || 'XAF'
  const reservations = enrichReservations(appState.reservations, appState.clients, appState.rooms)
  
  const html = `
    <!-- En-tête de la page principale -->
    <header class="flex justify-between items-center pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Gestion des Réservations</h1>
        <p class="text-xs text-gray-400 mt-1">${reservations.length} réservation(s) trouvée(s)</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input 
            type="text" 
            id="search-reservation"
            placeholder="Rechercher client, chambre..." 
            class="bg-gray-100 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none w-64"
          >
          <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <button id="btn-new-reservation" class="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm">
          + Nouvelle Réservation
        </button>
      </div>
    </header>

    <!-- Tableau des données -->
    <div class="flex-1 overflow-y-auto mt-2">
      ${renderTableContent(reservations, currency)}
    </div>
  `
  
  container.innerHTML = html
  
  // Attacher les gestionnaires d'événements
  attachTableListeners(container, appState)
}

// Enrichir les réservations avec les infos clients et chambres
const enrichReservations = (reservations, clients, rooms) => {
  return reservations.map(res => {
    const client = clients.find(c => c.id === res.clientId)
    const room = rooms.find(r => r.id === res.roomId)
    
    return {
      ...res,
      clientNom: client?.nom || 'Client inconnu',
      clientTelephone: client?.telephone || '',
      roomNom: room?.nom || 'Chambre non définie',
      roomType: room?.type || ''
    }
  })
}

// Générer le contenu du tableau
const renderTableContent = (reservations, currency) => {
  if (!reservations || reservations.length === 0) {
    return `
      <div class="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p class="text-lg font-medium">Aucune réservation</p>
        <p class="text-sm mt-1">Créez votre première réservation</p>
      </div>
    `
  }
  
  let html = `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs text-gray-400 border-b border-gray-100 sticky top-0 bg-white">
          <th class="pb-3 font-medium">Client</th>
          <th class="pb-3 font-medium">Chambre</th>
          <th class="pb-3 font-medium">Type</th>
          <th class="pb-3 font-medium">Arrivée</th>
          <th class="pb-3 font-medium">Départ</th>
          <th class="pb-3 font-medium">Statut</th>
          <th class="pb-3 font-medium text-right">Montant</th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-50">
  `
  
  reservations.forEach(res => {
    const status = STATUS_CONFIG[res.statut] || { label: res.statut, color: 'bg-gray-100 text-gray-700' }
    const isArrivalToday = isToday(new Date(res.dateArrivee))
    const isDepartureToday = isToday(new Date(res.dateDepart))
    
    html += `
      <tr class="hover:bg-gray-50/50 transition cursor-pointer group" data-reservation-id="${res.id}">
        <td class="py-3.5">
          <div class="font-medium text-gray-900">${res.clientNom}</div>
          <div class="text-xs text-gray-500">${res.clientTelephone}</div>
        </td>
        <td class="py-3.5 text-gray-600">${res.roomNom}</td>
        <td class="py-3.5 text-gray-500 text-xs">${res.roomType}</td>
        <td class="py-3.5 text-gray-600">
          ${formatDateLong(res.dateArrivee)}
          ${isArrivalToday ? '<span class="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Aujourd\'hui</span>' : ''}
        </td>
        <td class="py-3.5 text-gray-600">
          ${formatDateLong(res.dateDepart)}
          ${isDepartureToday ? '<span class="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Aujourd\'hui</span>' : ''}
        </td>
        <td class="py-3.5">
          <span class="px-2.5 py-1 text-xs ${status.color} rounded-full font-medium">${status.label}</span>
        </td>
        <td class="py-3.5 text-right font-semibold">${formatCurrency(res.montantTotal, currency)}</td>
      </tr>
    `
  })
  
  html += `
      </tbody>
    </table>
  `
  
  return html
}

// Gestionnaires d'événements
const attachTableListeners = (container, appState) => {
  // Recherche
  const searchInput = container.querySelector('#search-reservation')
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase()
      filterReservations(query, appState)
    })
  }
  
  // Nouvelle réservation
  container.querySelector('#btn-new-reservation')?.addEventListener('click', () => {
    console.log('Nouvelle réservation')
    // TODO: Ouvrir modale
  })
  
  // Clic sur une ligne
  container.querySelectorAll('[data-reservation-id]').forEach(row => {
    row.addEventListener('click', () => {
      const reservationId = row.dataset.reservationId
      console.log('Réservation sélectionnée:', reservationId)
      // TODO: Ouvrir détails ou actions
    })
  })
}

// Filtrer les réservations
const filterReservations = (query, appState) => {
  const rows = document.querySelectorAll('[data-reservation-id]')
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase()
    const matches = text.includes(query)
    row.style.display = matches ? '' : 'none'
  })
}

export default {
  renderReservationsTable
}
