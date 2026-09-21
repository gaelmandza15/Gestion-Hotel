// ROLE: Rendu du tableau de bord (cartes statistiques)
// INPUT: Element DOM, appState
// OUTPUT: Dashboard HTML injecté dans le DOM
// DEPENDS ON: utils/currency.js, utils/dates.js

import { formatCurrency } from '../utils/currency.js'
import { formatDateLong, isToday, getDaysDifference } from '../utils/dates.js'

// Calculer les statistiques depuis les réservations
const calculateStats = (reservations, rooms) => {
  const today = new Date()
  
  // Taux d'occupation
  const occupiedRooms = rooms.filter(r => r.statut === 'occupee').length
  const totalRooms = rooms.length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  
  // Arrivées du jour
  const arrivalsToday = reservations.filter(r => {
    const arrivalDate = new Date(r.dateArrivee)
    return isToday(arrivalDate) && r.statut !== 'annulee'
  }).length
  
  // Départs du jour
  const departuresToday = reservations.filter(r => {
    const departureDate = new Date(r.dateDepart)
    return isToday(departureDate) && r.statut !== 'annulee'
  }).length
  
  // Revenu journalier (réservations en cours)
  const dailyRevenue = reservations
    .filter(r => r.statut === 'en_cours' || r.statut === 'confirmee')
    .reduce((sum, r) => sum + (r.montantTotal || 0), 0)
  
  // Check-ins faits
  const checkInsDone = reservations.filter(r => r.checkInAt && isToday(new Date(r.checkInAt))).length
  
  return {
    occupancyRate,
    arrivalsToday,
    departuresToday,
    dailyRevenue,
    checkInsDone,
    occupiedRooms,
    totalRooms
  }
}

// Générer le HTML du dashboard
export const renderDashboard = (container, appState) => {
  if (!container) return
  
  const stats = calculateStats(appState.reservations, appState.rooms)
  const currency = appState.establishment?.devise || 'XAF'
  
  const html = `
    <!-- En-tête de la page principale -->
    <header class="flex justify-between items-center pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Tableau de Bord</h1>
        <p class="text-xs text-gray-400 mt-1">Vue d'ensemble de l'activité hôtelière</p>
      </div>
      <div class="flex items-center space-x-4">
        <button id="btn-new-reservation" class="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm">
          + Nouvelle Réservation
        </button>
      </div>
    </header>

    <!-- Cartes de Statistiques Rapides -->
    <div class="grid grid-cols-4 gap-4 my-6">
      <!-- Taux d'occupation -->
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <span class="text-xs text-gray-400 font-medium">Taux d'occupation</span>
        <div class="text-2xl font-bold text-gray-900 mt-1">${stats.occupancyRate}%</div>
        <div class="flex items-center mt-2 space-x-2">
          <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            ${stats.occupiedRooms}/${stats.totalRooms} chambres
          </span>
        </div>
      </div>
      
      <!-- Arrivées Prévues -->
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <span class="text-xs text-gray-400 font-medium">Arrivées Prévues</span>
        <div class="text-2xl font-bold text-gray-900 mt-1">${stats.arrivalsToday}</div>
        <span class="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
          ${stats.checkInsDone} check-ins faits
        </span>
      </div>
      
      <!-- Départs du jour -->
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <span class="text-xs text-gray-400 font-medium">Départs du jour</span>
        <div class="text-2xl font-bold text-gray-900 mt-1">${stats.departuresToday}</div>
        <span class="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
          À préparer
        </span>
      </div>
      
      <!-- Revenu Journalier -->
      <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <span class="text-xs text-gray-400 font-medium">Revenu Journalier</span>
        <div class="text-2xl font-bold text-gray-900 mt-1">${formatCurrency(stats.dailyRevenue, currency)}</div>
        <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
          Réservations confirmées
        </span>
      </div>
    </div>

    <!-- Section réservations récentes -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">Réservations Récentes</h2>
        <button id="btn-view-all-reservations" class="text-sm text-gray-600 hover:text-black transition">
          Voir tout →
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        ${renderMiniReservationsTable(appState.reservations.slice(0, 5), currency)}
      </div>
    </div>
  `
  
  container.innerHTML = html
  
  // Attacher les gestionnaires d'événements
  attachDashboardListeners(container)
}

// Mini tableau des réservations
const renderMiniReservationsTable = (reservations, currency) => {
  if (!reservations || reservations.length === 0) {
    return '<div class="text-center text-gray-400 py-8">Aucune réservation</div>'
  }
  
  const statusLabels = {
    devis: { label: 'Devis', color: 'bg-gray-100 text-gray-700' },
    confirmee: { label: 'Confirmée', color: 'bg-amber-50 text-amber-700' },
    en_cours: { label: 'En séjour', color: 'bg-blue-50 text-blue-700' },
    terminee: { label: 'Terminée', color: 'bg-emerald-50 text-emerald-700' },
    annulee: { label: 'Annulée', color: 'bg-rose-50 text-rose-700' }
  }
  
  let html = `
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs text-gray-400 border-b border-gray-100">
          <th class="pb-3 font-medium">Client</th>
          <th class="pb-3 font-medium">Chambre</th>
          <th class="pb-3 font-medium">Arrivée</th>
          <th class="pb-3 font-medium">Départ</th>
          <th class="pb-3 font-medium">Statut</th>
          <th class="pb-3 font-medium text-right">Montant</th>
        </tr>
      </thead>
      <tbody class="text-sm divide-y divide-gray-50">
  `
  
  reservations.forEach(res => {
    const client = res.clientNom || 'Client inconnu'
    const room = res.roomNom || 'Chambre non définie'
    const status = statusLabels[res.statut] || { label: res.statut, color: 'bg-gray-100 text-gray-700' }
    
    html += `
      <tr class="hover:bg-gray-50/50 transition cursor-pointer" data-reservation-id="${res.id}">
        <td class="py-3.5 font-medium text-gray-900">${client}</td>
        <td class="py-3.5 text-gray-600">${room}</td>
        <td class="py-3.5 text-gray-600">${formatDateLong(res.dateArrivee)}</td>
        <td class="py-3.5 text-gray-600">${formatDateLong(res.dateDepart)}</td>
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

// Gestionnaires d'événements du dashboard
const attachDashboardListeners = (container) => {
  // Bouton nouvelle réservation
  container.querySelector('#btn-new-reservation')?.addEventListener('click', () => {
    console.log('Nouvelle réservation')
    // Ouvrir la modale de nouvelle réservation
    if (window.newReservationModal) {
      window.newReservationModal.open()
    }
  })
  
  // Lien voir toutes les réservations
  container.querySelector('#btn-view-all-reservations')?.addEventListener('click', () => {
    if (window.navigateTo) {
      window.navigateTo('reservations')
    }
  })
  
  // Clic sur une ligne de réservation
  container.querySelectorAll('[data-reservation-id]').forEach(row => {
    row.addEventListener('click', () => {
      const reservationId = row.dataset.reservationId
      console.log('Réservation cliquée:', reservationId)
      // TODO: Ouvrir les détails de la réservation
    })
  })
}

export default {
  renderDashboard
}
