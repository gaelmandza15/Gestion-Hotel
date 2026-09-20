// ROLE: Point d'entrée principal - Initialisation et orchestration
// INPUT: Aucun
// OUTPUT: Application initialisée dans le DOM
// DEPENDS ON: Tous les services et components

import { get, set, initializeWithMockData } from './services/storage.js'
import { mockClients, mockRooms, mockReservations, defaultEstablishment } from './data/mockData.js'
import { renderMainMenu } from './components/navigation.js'
import { renderDashboard } from './components/dashboard.js'
import { renderReservationsTable } from './components/reservationsTable.js'

// État global de l'application
const appState = {
  currentView: 'dashboard',
  establishment: null,
  rooms: [],
  clients: [],
  reservations: []
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
      // TODO: Implémenter vue chambres
      mainContent.innerHTML = '<div class="p-8"><h1>Gestion des Chambres</h1><p>À venir...</p></div>'
      break
    case 'billing':
      // TODO: Implémenter vue facturation
      mainContent.innerHTML = '<div class="p-8"><h1>Facturation</h1><p>À venir...</p></div>'
      break
    case 'settings':
      // TODO: Implémenter vue paramètres
      mainContent.innerHTML = '<div class="p-8"><h1>Paramètres</h1><p>À venir...</p></div>'
      break
    default:
      renderDashboard(mainContent, appState)
  }
}

// Mettre à jour l'apparence des boutons de navigation
const updateNavButtons = (currentView) => {
  const buttons = ['home', 'reservations', 'rooms', 'billing', 'settings']
  
  buttons.forEach(btnId => {
    const btn = document.getElementById(`nav-${btnId}`)
    if (!btn) return
    
    // Reset classes
    btn.className = 'p-2.5 text-gray-500 hover:text-black transition'
    
    // Active state
    if (
      (btnId === 'home' && currentView === 'dashboard') ||
      (btnId === btnId && currentView === btnId)
    ) {
      btn.className = 'p-2.5 bg-white text-black rounded-2xl shadow-sm'
    }
  })
  
  // Badge réservations confirmées
  const confirmedCount = appState.reservations.filter(r => r.statut === 'confirmee').length
  const badge = document.getElementById('reservations-badge')
  if (badge) {
    badge.classList.toggle('hidden', confirmedCount === 0)
  }
}

// Gestionnaires d'événements de navigation
const setupNavigation = () => {
  document.getElementById('nav-home')?.addEventListener('click', () => navigateTo('dashboard'))
  document.getElementById('nav-reservations')?.addEventListener('click', () => navigateTo('reservations'))
  document.getElementById('nav-rooms')?.addEventListener('click', () => navigateTo('rooms'))
  document.getElementById('nav-billing')?.addEventListener('click', () => navigateTo('billing'))
  document.getElementById('nav-settings')?.addEventListener('click', () => navigateTo('settings'))
}

// Initialisation de l'application
const initApp = () => {
  console.log('🏨 Démarrage GestionHôtel...')
  
  // Initialiser les données
  initializeData()
  
  // Charger les données
  loadData()
  
  // Setup navigation
  setupNavigation()
  
  // Render menu secondaire
  const mainMenu = document.getElementById('main-menu')
  if (mainMenu) {
    renderMainMenu(mainMenu, appState)
  }
  
  // Afficher la vue dashboard par défaut
  navigateTo('dashboard')
  
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
