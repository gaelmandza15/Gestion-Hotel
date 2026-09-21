/**
 * Vue de gestion des chambres
 * Affiche toutes les chambres avec leurs statuts et permet les actions
 */

import { roomsService } from '../services/rooms.js';
import { formatCurrency } from '../utils/currency.js';

export class RoomsView {
    constructor() {
        this.service = roomsService;
        this.container = null;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const stats = this.service.getStats();
        const rooms = this.getFilteredRooms();

        const html = `
            <div class="view-container">
                <div class="view-header">
                    <h1>Gestion des Chambres</h1>
                    <button class="btn btn-primary" id="add-room-btn">
                        <span class="icon">+</span> Nouvelle Chambre
                    </button>
                </div>

                <!-- Statistiques -->
                <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                    <div class="stat-card">
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-card available">
                        <div class="stat-value">${stats.disponible}</div>
                        <div class="stat-label">Disponibles</div>
                    </div>
                    <div class="stat-card occupied">
                        <div class="stat-value">${stats.occupee}</div>
                        <div class="stat-label">Occupées</div>
                    </div>
                    <div class="stat-card maintenance">
                        <div class="stat-value">${stats.maintenance}</div>
                        <div class="stat-label">Maintenance</div>
                    </div>
                    <div class="stat-card cleaning">
                        <div class="stat-value">${stats.nettoyage}</div>
                        <div class="stat-label">Nettoyage</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.tauxOccupation}%</div>
                        <div class="stat-label">Taux d'occupation</div>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="filters-bar" style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                        Toutes
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'Disponible' ? 'active' : ''}" data-filter="Disponible">
                        Disponibles
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'Occupée' ? 'active' : ''}" data-filter="Occupée">
                        Occupées
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'Maintenance' ? 'active' : ''}" data-filter="Maintenance">
                        Maintenance
                    </button>
                    <button class="filter-btn ${this.currentFilter === 'Nettoyage' ? 'active' : ''}" data-filter="Nettoyage">
                        Nettoyage
                    </button>
                    <input type="text" id="search-room" placeholder="Rechercher une chambre..." 
                           style="margin-left: auto; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 4px; min-width: 200px;">
                </div>

                <!-- Grille des chambres -->
                <div class="rooms-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${rooms.map(room => this.renderRoomCard(room)).join('')}
                </div>

                ${rooms.length === 0 ? '<p style="text-align: center; color: #666; padding: 2rem;">Aucune chambre trouvée</p>' : ''}
            </div>
        `;

        this.container = document.getElementById('app');
        this.container.innerHTML = html;
    }

    renderRoomCard(room) {
        const statutColors = {
            'Disponible': '#28a745',
            'Occupée': '#dc3545',
            'Maintenance': '#ffc107',
            'Réservée': '#17a2b8',
            'Nettoyage': '#fd7e14'
        };

        return `
            <div class="room-card" data-room-id="${room.id}" style="
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 1.5rem;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="margin: 0; font-size: 1.5rem; color: #333;">Chambre ${room.numero}</h3>
                    <span style="
                        padding: 0.25rem 0.75rem;
                        border-radius: 20px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        background: ${statutColors[room.statut] || '#6c757d'};
                        color: white;
                    ">${room.statut}</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
                    <div>
                        <small style="color: #666;">Type</small>
                        <div style="font-weight: 600;">${room.type}</div>
                    </div>
                    <div>
                        <small style="color: #666;">Étage</small>
                        <div style="font-weight: 600;">${room.etage}</div>
                    </div>
                    <div>
                        <small style="color: #666;">Capacité</small>
                        <div style="font-weight: 600;">${room.capacite || 1} pers.</div>
                    </div>
                    <div>
                        <small style="color: #666;">Prix/nuit</small>
                        <div style="font-weight: 600; color: #28a745;">${formatCurrency(room.prix)}</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    ${this.renderActionButtons(room)}
                </div>
            </div>
        `;
    }

    renderActionButtons(room) {
        let buttons = '';

        if (room.statut === 'Disponible') {
            buttons += `
                <button class="btn btn-sm btn-success" onclick="window.roomsView.updateRoomStatut('${room.id}', 'Occupée')" 
                        style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">
                    Check-in
                </button>
                <button class="btn btn-sm btn-warning" onclick="window.roomsView.updateRoomStatut('${room.id}', 'Nettoyage')"
                        style="padding: 0.5rem; font-size: 0.85rem;">
                    Nettoyer
                </button>
            `;
        } else if (room.statut === 'Occupée') {
            buttons += `
                <button class="btn btn-sm btn-danger" onclick="window.roomsView.updateRoomStatut('${room.id}', 'Nettoyage')"
                        style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">
                    Check-out
                </button>
            `;
        } else if (room.statut === 'Nettoyage') {
            buttons += `
                <button class="btn btn-sm btn-success" onclick="window.roomsView.updateRoomStatut('${room.id}', 'Disponible')"
                        style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">
                    Terminé
                </button>
            `;
        } else if (room.statut === 'Maintenance') {
            buttons += `
                <button class="btn btn-sm btn-success" onclick="window.roomsView.updateRoomStatut('${room.id}', 'Disponible')"
                        style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">
                    Réparer
                </button>
            `;
        }

        buttons += `
            <button class="btn btn-sm btn-secondary" onclick="window.roomsView.editRoom('${room.id}')"
                    style="padding: 0.5rem; font-size: 0.85rem;">
                ✏️
            </button>
        `;

        return buttons;
    }

    getFilteredRooms() {
        let rooms = this.service.getAll();
        
        if (this.currentFilter !== 'all') {
            rooms = rooms.filter(room => room.statut === this.currentFilter);
        }

        return rooms;
    }

    attachEventListeners() {
        // Délégation d'événements pour les filtres
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.currentFilter = e.target.dataset.filter;
                this.render();
                this.attachEventListeners();
            }

            if (e.target.id === 'add-room-btn') {
                this.addRoom();
            }
        });

        // Recherche
        const searchInput = document.getElementById('search-room');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                this.renderSearchResults(query);
            });
        }
    }

    renderSearchResults(query) {
        const filtered = this.service.search(query);
        const grid = document.querySelector('.rooms-grid');
        
        if (grid) {
            grid.innerHTML = filtered.map(room => this.renderRoomCard(room)).join('');
            
            if (filtered.length === 0) {
                grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem; grid-column: 1/-1;">Aucune chambre trouvée</p>';
            }
        }
    }

    updateRoomStatut(roomId, newStatut) {
        try {
            this.service.updateStatut(roomId, newStatut);
            this.render();
            this.attachEventListeners();
            
            // Mettre à jour les réservations associées si nécessaire
            this.updateReservationsStatut(roomId, newStatut);
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    }

    updateReservationsStatut(roomId, newStatut) {
        const reservations = JSON.parse(localStorage.getItem('hotel_reservations') || '[]');
        const updated = false;

        // Trouver la réservation active pour cette chambre
        const reservationIndex = reservations.findIndex(r => 
            r.chambre.id === roomId && 
            (r.statut === 'Confirmée' || r.statut === 'En cours')
        );

        if (reservationIndex !== -1) {
            if (newStatut === 'Occupée') {
                reservations[reservationIndex].statut = 'En cours';
                reservations[reservationIndex].checkinRealise = true;
            } else if (newStatut === 'Nettoyage' && reservations[reservationIndex].statut === 'En cours') {
                reservations[reservationIndex].statut = 'Terminée';
                reservations[reservationIndex].checkoutRealise = true;
                reservations[reservationIndex].checkoutDate = new Date().toISOString();
            }
            
            localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
        }
    }

    addRoom() {
        const numero = prompt('Numéro de la chambre:');
        if (!numero) return;

        const type = prompt('Type de chambre (Simple, Double, Suite):', 'Simple');
        if (!type) return;

        const prix = prompt('Prix par nuit (FCFA):', '50000');
        if (!prix) return;

        const etage = prompt('Étage:', '1');
        const capacite = prompt('Capacité (nombre de personnes):', '1');

        try {
            this.service.add({
                numero,
                type,
                prix: parseFloat(prix),
                etage: parseInt(etage),
                capacite: parseInt(capacite)
            });
            
            this.render();
            this.attachEventListeners();
            alert('Chambre ajoutée avec succès!');
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    }

    editRoom(roomId) {
        const room = this.service.getById(roomId);
        if (!room) return;

        const nouveauNumero = prompt('Numéro de la chambre:', room.numero);
        if (nouveauNumero === null) return;

        const nouveauType = prompt('Type de chambre:', room.type);
        const nouveauPrix = prompt('Prix par nuit:', room.prix);
        const nouvelEtage = prompt('Étage:', room.etage);
        const nouvelleCapacite = prompt('Capacité:', room.capacite || 1);

        try {
            this.service.update(roomId, {
                numero: nouveauNumero,
                type: nouveauType,
                prix: parseFloat(nouveauPrix),
                etage: parseInt(nouvelEtage),
                capacite: parseInt(nouvelleCapacite)
            });

            this.render();
            this.attachEventListeners();
            alert('Chambre modifiée avec succès!');
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    }
}

// Exporter une instance globale pour les callbacks inline
window.roomsView = null;

export default RoomsView;
