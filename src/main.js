// ROLE: Point d'entrée principal - Initialisation et orchestration
// INPUT: Aucun
// OUTPUT: Application initialisée dans le DOM
// DEPENDS ON: Tous les services et components

import './styles.css'
import { get, set, initializeWithMockData } from './services/storage.js'
import { mockClients, mockRooms, mockReservations, defaultEstablishment } from './data/mockData.js'
import { renderMainMenu } from './components/navigation.js'
import { renderDashboard } from './components/dashboard.js'
import { renderReservationsTable } from './components/reservationsTable.js'
import { RoomsView } from './components/roomsView.js'
import { NewReservationModal } from './components/modals/NewReservationModal.js'
import { createClientsView } from './components/clientsView.js'
import { createBillingView } from './components/billingView.js'
import { createSettingsView } from './components/settingsView.js'
import notificationService from './services/notifications.js'
import exportService from './services/export.js'
import invoiceGenerator from './utils/invoiceGenerator.js'

// État global de l'application
const appState = {
  currentView: 'dashboard',
  establishment: null,
  rooms: [],
  clients: [],
  reservations: [],
  roomsViewInstance: null,
  reservationModal: null
}

// Initialiser les données par défaut si vide
const initializeData = () => {
  // Établissement
  if (!get('establishment')) {
    set('establishment', defaultEstablishment)
  }
  
  // Rooms
  if (!get('rooms')) {
    set('rooms', mockRooms)
  }
  
  // Clients
  if (!get('clients')) {
    set('clients', mockClients)
  }
  
  // Reservations
  if (!get('reservations')) {
    set('reservations', mockReservations)
  }
  
  console.log('✅ Données initialisées')
}

// Charger les données depuis localStorage
const loadData = () => {
  appState.establishment = get('establishment', defaultEstablishment)
  appState.rooms = get('rooms', [])
  appState.clients = get('clients', [])
  appState.reservations = get('reservations', [])
  
  console.log('📦 Données chargées:', {
    rooms: appState.rooms.length,
    clients: appState.clients.length,
    reservations: appState.reservations.length
  })
}

// Navigation entre les vues
const navigateTo = (view) => {
  appState.currentView = view
  const mainContent = document.getElementById('main-content')
  
  // Mettre à jour les boutons de navigation
  updateNavButtons(view)
  
  // Rendu selon la vue
  switch(view) {
    case 'dashboard':
      renderDashboard(mainContent, appState)
      break
    case 'reservations':
      renderReservationsTable(mainContent, appState)
      break
    case 'rooms':
      // Initialiser et afficher la vue chambres
      if (!appState.roomsViewInstance) {
        appState.roomsViewInstance = new RoomsView()
        window.roomsView = appState.roomsViewInstance
      } else {
        appState.roomsViewInstance.render()
        appState.roomsViewInstance.attachEventListeners()
      }
      break
    case 'clients':
      // Vue gestion des clients
      mainContent.innerHTML = ''
      mainContent.appendChild(createClientsView())
      break
    case 'billing':
      // Vue facturation
      mainContent.innerHTML = ''
      mainContent.appendChild(createBillingView())
      break
    case 'settings':
      // Vue paramètres
      mainContent.innerHTML = ''
      mainContent.appendChild(createSettingsView())
      break
    default:
      renderDashboard(mainContent, appState)
  }
}

// Mettre à jour l'apparence des boutons de navigation dans le menu secondaire
const updateNavButtons = (currentView) => {
  // Mettre à jour tous les éléments du menu avec data-route
  document.querySelectorAll('[data-route]').forEach(el => {
    const route = el.dataset.route
    const isActive = 
      (route === 'dashboard' && currentView === 'dashboard') ||
      (route === currentView)
    
    if (el.tagName === 'BUTTON') {
      // Pour les boutons avec sous-menu
      el.className = `flex items-center justify-between px-4 py-3 rounded-full transition w-full ${
        isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-white/50'
      }`
    } else if (el.tagName === 'A') {
      // Pour les liens simples
      el.className = `flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
        isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-white/50'
      }`
    }
  })
}

// Initialisation de l'application
const initApp = () => {
  console.log('🏨 Démarrage GestionHôtel...')
  
  // Initialiser les données
  initializeData()
  
  // Charger les données
  loadData()
  
  // Render menu secondaire
  const mainMenu = document.getElementById('main-menu')
  if (mainMenu) {
    renderMainMenu(mainMenu, appState)
  }
  
  // Initialiser le modal de nouvelle réservation
  appState.reservationModal = new NewReservationModal((reservation) => {
    // Callback de sauvegarde
    const reservations = get('reservations', [])
    reservations.push(reservation)
    set('reservations', reservations)
    
    // Mettre à jour l'état local
    appState.reservations = reservations
    
    // Mettre à jour le statut de la chambre
    const rooms = get('rooms', [])
    const roomIndex = rooms.findIndex(r => r.id === reservation.chambre.id)
    if (roomIndex !== -1) {
      rooms[roomIndex].statut = 'Occupée'
      set('rooms', rooms)
      
      // Rafraîchir la vue chambres si active
      if (appState.roomsViewInstance && appState.currentView === 'rooms') {
        appState.roomsViewInstance.render()
        appState.roomsViewInstance.attachEventListeners()
      }
    }
    
    // Rafraîchir le dashboard si actif
    if (appState.currentView === 'dashboard') {
      const mainContent = document.getElementById('main-content')
      renderDashboard(mainContent, appState)
    }
    
    // Rafraîchir la table des réservations si active
    if (appState.currentView === 'reservations') {
      const mainContent = document.getElementById('main-content')
      renderReservationsTable(mainContent, appState)
    }
    
    console.log('✅ Réservation enregistrée:', reservation)
  })
  
  // Exposer le modal globalement pour le dashboard
  window.newReservationModal = appState.reservationModal
  
  // Afficher la vue dashboard par défaut
  navigateTo('dashboard')
  
  // Afficher les notifications importantes (arrivées/départs du jour)
  notificationService.checkDailyEvents(appState.reservations)
  
  console.log('✅ Application prête')
}

// Démarrer quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

// Export pour débogage
window.appState = appState
window.loadData = loadData
window.navigateTo = navigateTo
