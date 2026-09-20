// ROLE: Rendu du menu de navigation secondaire
// INPUT: Element DOM, appState
// OUTPUT: Menu HTML injecté dans le DOM
// DEPENDS ON: DYNAMIC_RULES.md section 4, 5

import { formatCurrency } from '../utils/currency.js'
import { formatDateLong } from '../utils/dates.js'

// Configuration du menu principal
const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'home',
    route: 'dashboard'
  },
  {
    id: 'reservations',
    label: 'Réservations',
    icon: 'calendar',
    route: 'reservations',
    subItems: [
      { id: 'arrivals', label: 'Arrivées du jour', filter: 'arrivals' },
      { id: 'inhouse', label: 'En cours / Séjour', filter: 'inhouse' },
      { id: 'history', label: 'Historique & Factures', filter: 'history' }
    ]
  },
  {
    id: 'rooms',
    label: 'Gestion des Chambres',
    icon: 'room',
    route: 'rooms'
  },
  {
    id: 'clients',
    label: 'Clients & VIP',
    icon: 'users',
    route: 'clients'
  }
]

// Icônes SVG
const ICONS = {
  home: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
  calendar: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  room: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
  users: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
}

// Statuts de chambre pour les filtres
const ROOM_STATUS_FILTERS = [
  { id: 'disponible', label: 'Disponibles', countKey: 'disponible', color: 'bg-emerald-500' },
  { id: 'occupee', label: 'Occupées', countKey: 'occupee', color: 'bg-amber-500' },
  { id: 'nettoyage', label: 'En Nettoyage', countKey: 'nettoyage', color: 'bg-rose-500' }
]

// Générer le HTML du menu principal
export const renderMainMenu = (container, appState) => {
  if (!container) return
  
  let html = ''
  
  MENU_ITEMS.forEach(item => {
    const isActive = appState.currentView === item.route
    
    if (item.subItems) {
      // Élément avec sous-menu (comme Réservations)
      html += `
        <div class="mb-2">
          <button data-route="${item.route}" class="flex items-center justify-between px-4 py-3 rounded-full ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-white/50'} transition w-full">
            <span class="flex items-center space-x-3">
              ${ICONS[item.icon]}
              <span class="font-medium">${item.label}</span>
            </span>
            <span>-</span>
          </button>
          
          ${item.subItems.map(sub => `
            <a href="#" data-filter="${sub.filter}" class="block px-6 py-2 rounded-xl text-gray-600 hover:bg-white/50 transition text-xs ml-4 ${sub.id === 'inhouse' ? 'bg-white text-black font-semibold shadow-sm' : ''}">
              ${sub.label}
            </a>
          `).join('')}
        </div>
      `
    } else {
      // Élément simple
      html += `
        <a href="#" data-route="${item.route}" class="flex items-center justify-between px-3 py-2.5 rounded-xl ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-white/50'} transition">
          <span class="flex items-center space-x-3">
            ${ICONS[item.icon]}
            <span>${item.label}</span>
          </span>
          <span>+</span>
        </a>
      `
    }
  })
  
  container.innerHTML = html
  
  // Attacher les gestionnaires d'événements
  attachMenuListeners(container, appState)
}

// Attacher les listeners sur le menu
const attachMenuListeners = (container, appState) => {
  // Routes principales
  container.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const route = el.dataset.route
      if (window.navigateTo) {
        window.navigateTo(route)
      }
    })
  })
  
  // Filtres secondaires
  container.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const filter = el.dataset.filter
      console.log('Filtre appliqué:', filter)
      // TODO: Appliquer le filtre au tableau des réservations
    })
  })
}

// Générer les filtres de statut des chambres
export const renderRoomStatusFilters = (container, rooms) => {
  if (!container || !rooms) return
  
  // Compter les chambres par statut
  const counts = {
    disponible: rooms.filter(r => r.statut === 'disponible').length,
    occupee: rooms.filter(r => r.statut === 'occupee').length,
    nettoyage: rooms.filter(r => r.statut === 'nettoyage').length,
    total: rooms.length
  }
  
  // Mettre à jour le total
  const totalEl = document.getElementById('total-rooms')
  if (totalEl) {
    totalEl.textContent = counts.total
  }
  
  let html = ''
  
  ROOM_STATUS_FILTERS.forEach(filter => {
    const count = counts[filter.countKey] || 0
    const isActive = filter.id === 'occupee' // Par défaut, occupées est actif
    
    html += `
      <a href="#" data-status="${filter.id}" class="flex items-center space-x-3 px-3 py-2 rounded-xl ${isActive ? 'bg-white text-black font-medium shadow-sm' : 'text-gray-600 hover:bg-white/50'} transition">
        <span class="w-2 h-2 rounded-full ${filter.color}"></span>
        <span class="text-xs ${isActive ? '' : 'font-medium'}">${filter.label} (${count})</span>
      </a>
    `
  })
  
  container.innerHTML = html
  
  // Attacher les listeners
  container.querySelectorAll('[data-status]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const status = el.dataset.status
      console.log('Filtre statut:', status)
      // TODO: Filtrer les chambres par statut
    })
  })
}

// Exporter pour utilisation dans main.js
export default {
  renderMainMenu,
  renderRoomStatusFilters
}
