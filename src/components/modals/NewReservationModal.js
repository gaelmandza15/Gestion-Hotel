/**
 * Modal de Nouvelle Réservation
 * Gère la création d'une nouvelle réservation
 */

import { generateId } from '../../utils/idGenerator.js';
import { formatDateForStorage } from '../../utils/dates.js';
import { formatCurrency } from '../../utils/currency.js';
import { createClient, getClients } from '../../services/clients.js';
import { getRooms, updateRoom } from '../../services/rooms.js';
import { createReservation } from '../../services/reservations.js';

// Variable pour stocker l'instance du modal
let modalInstance = null;

/**
 * Ouvre la modale de nouvelle réservation
 */
export function openNewReservationModal() {
    if (!modalInstance) {
        modalInstance = new NewReservationModal((reservation) => {
            handleSaveReservation(reservation);
        });
    }
    modalInstance.open();
}

/**
 * Gère la sauvegarde d'une réservation
 */
function handleSaveReservation(reservationData) {
    try {
        // 1. Créer ou récupérer le client
        let client = getClients().find(c => 
            c.nom === reservationData.client.nom && 
            c.prenom === reservationData.client.prenom
        );
        
        if (!client) {
            client = createClient({
                nom: reservationData.client.nom,
                prenom: reservationData.client.prenom,
                email: reservationData.client.email,
                telephone: reservationData.client.telephone
            });
        }
        
        // 2. Créer la réservation
        const reservation = createReservation({
            clientId: client.id,
            roomId: reservationData.chambre.id,
            checkIn: reservationData.checkin,
            checkOut: reservationData.checkout,
            adults: parseInt(reservationData.nbPersons) || 1,
            children: 0,
            totalAmount: reservationData.prixTotal,
            paidAmount: 0,
            status: 'confirmed',
            notes: reservationData.notes
        });
        
        // 3. Mettre à jour le statut de la chambre
        updateRoom(reservationData.chambre.id, {
            status: 'reserved'
        });
        
        // 4. Rafraîchir l'affichage si nécessaire
        if (window.currentView === 'reservations') {
            window.renderReservationsTable();
        } else if (window.currentView === 'dashboard') {
            window.renderDashboard();
        }
        
        console.log('Réservation créée:', reservation);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        alert('Une erreur est survenue lors de la création de la réservation');
    }
}

export class NewReservationModal {
    constructor(onSave) {
        this.onSave = onSave;
        this.modal = null;
        this.clients = [];
        this.rooms = [];
        this.init();
    }

    init() {
        // Charger les données nécessaires
        this.loadClients();
        this.loadRooms();
        
        this.createModal();
        this.attachEventListeners();
    }

    loadClients() {
        this.clients = getClients();
        if (this.clients.length === 0) {
            // Clients par défaut si aucun n'existe
            this.clients = [
                { id: '1', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', telephone: '+33612345678' },
                { id: '2', nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.com', telephone: '+33698765432' }
            ];
        }
    }

    loadRooms() {
        this.rooms = getRooms();
        if (this.rooms.length === 0) {
            // Chambres par défaut
            this.rooms = [
                { id: '101', numero: '101', type: 'Simple', prix: 50000, etage: 1, statut: 'Disponible' },
                { id: '102', numero: '102', type: 'Double', prix: 75000, etage: 1, statut: 'Disponible' },
                { id: '201', numero: '201', type: 'Suite', prix: 120000, etage: 2, statut: 'Disponible' },
                { id: '202', numero: '202', type: 'Simple', prix: 50000, etage: 2, statut: 'Disponible' }
            ];
        }
    }

    createModal() {
        const modalHTML = `
            <div id="new-reservation-modal" class="modal-overlay" style="display: none;">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h2>Nouvelle Réservation</h2>
                        <button class="modal-close" id="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="reservation-form">
                            <!-- Informations Client -->
                            <div class="form-section">
                                <h3>Client</h3>
                                <div class="form-group">
                                    <label for="client-select">Client existant</label>
                                    <select id="client-select">
                                        <option value="">-- Sélectionner un client --</option>
                                        ${this.clients.map(client => 
                                            `<option value="${client.id}">${client.nom} ${client.prenom}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div class="form-divider">ou</div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="client-nom">Nom *</label>
                                        <input type="text" id="client-nom" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="client-prenom">Prénom *</label>
                                        <input type="text" id="client-prenom" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="client-email">Email</label>
                                        <input type="email" id="client-email">
                                    </div>
                                    <div class="form-group">
                                        <label for="client-telephone">Téléphone *</label>
                                        <input type="tel" id="client-telephone" required>
                                    </div>
                                </div>
                            </div>

                            <!-- Informations Réservation -->
                            <div class="form-section">
                                <h3>Réservation</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="room-select">Chambre *</label>
                                        <select id="room-select" required>
                                            <option value="">-- Sélectionner une chambre --</option>
                                            ${this.rooms.filter(r => r.statut === 'Disponible').map(room => 
                                                `<option value="${room.id}" data-prix="${room.prix}">
                                                    Chambre ${room.numero} - ${room.type} (${formatCurrency(room.prix)}/nuit)
                                                </option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="room-type">Type</label>
                                        <input type="text" id="room-type" readonly>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="checkin-date">Date d'arrivée *</label>
                                        <input type="date" id="checkin-date" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="checkout-date">Date de départ *</label>
                                        <input type="date" id="checkout-date" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="nb-persons">Nombre de personnes</label>
                                        <input type="number" id="nb-persons" min="1" max="10" value="1">
                                    </div>
                                    <div class="form-group">
                                        <label for="nb-nights">Nombre de nuits</label>
                                        <input type="number" id="nb-nights" readonly value="0">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="total-price">Prix total</label>
                                    <input type="text" id="total-price" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="notes">Notes / Commentaires</label>
                                    <textarea id="notes" rows="3" placeholder="Demandes spéciales, remarques..."></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-btn">Annuler</button>
                        <button type="button" class="btn btn-primary" id="save-btn">Enregistrer</button>
                    </div>
                </div>
            </div>
        `;

        // Ajouter le modal au DOM
        const container = document.querySelector('#modal-container') || document.body;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHTML;
        this.modal = tempDiv.firstElementChild;
        container.appendChild(this.modal);

        // Initialiser la date minimum pour check-in à aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkin-date').min = today;
    }

    attachEventListeners() {
        // Fermeture du modal
        document.getElementById('close-modal').addEventListener('click', () => this.close());
        document.getElementById('cancel-btn').addEventListener('click', () => this.close());
        
        // Sauvegarde
        document.getElementById('save-btn').addEventListener('click', () => this.save());

        // Sélection client existant
        document.getElementById('client-select').addEventListener('change', (e) => {
            const clientId = e.target.value;
            if (clientId) {
                const client = this.clients.find(c => c.id === clientId);
                if (client) {
                    document.getElementById('client-nom').value = client.nom;
                    document.getElementById('client-prenom').value = client.prenom;
                    document.getElementById('client-email').value = client.email || '';
                    document.getElementById('client-telephone').value = client.telephone;
                }
            } else {
                // Vider les champs si aucun client sélectionné
                document.getElementById('client-nom').value = '';
                document.getElementById('client-prenom').value = '';
                document.getElementById('client-email').value = '';
                document.getElementById('client-telephone').value = '';
            }
        });

        // Sélection chambre - mise à jour type et prix
        document.getElementById('room-select').addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const roomType = selectedOption.text.split(' - ')[1]?.split(' (')[0] || '';
            document.getElementById('room-type').value = roomType;
            this.calculateTotal();
        });

        // Calcul automatique des nuits et du prix
        document.getElementById('checkin-date').addEventListener('change', () => this.calculateTotal());
        document.getElementById('checkout-date').addEventListener('change', () => this.calculateTotal());

        // Empêcher la soumission classique du formulaire
        document.getElementById('reservation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.save();
        });
    }

    calculateTotal() {
        const checkinDate = document.getElementById('checkin-date').value;
        const checkoutDate = document.getElementById('checkout-date').value;
        const roomSelect = document.getElementById('room-select');
        const selectedOption = roomSelect.options[roomSelect.selectedIndex];
        
        if (checkinDate && checkoutDate && roomSelect.value) {
            const start = new Date(checkinDate);
            const end = new Date(checkoutDate);
            const diffTime = end - start;
            const nbNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (nbNights > 0) {
                const pricePerNight = parseFloat(selectedOption.dataset.prix) || 0;
                const totalPrice = nbNights * pricePerNight;
                
                document.getElementById('nb-nights').value = nbNights;
                document.getElementById('total-price').value = formatCurrency(totalPrice);
                return { nbNights, totalPrice };
            }
        }
        
        document.getElementById('nb-nights').value = 0;
        document.getElementById('total-price').value = '';
        return null;
    }

    open() {
        this.modal.style.display = 'flex';
        // Réinitialiser le formulaire
        document.getElementById('reservation-form').reset();
        document.getElementById('client-select').value = '';
        
        // Mettre à jour la liste des chambres disponibles
        this.updateAvailableRooms();
    }

    close() {
        this.modal.style.display = 'none';
    }

    updateAvailableRooms() {
        const roomSelect = document.getElementById('room-select');
        const availableRooms = this.rooms.filter(r => r.statut === 'Disponible');
        
        roomSelect.innerHTML = `
            <option value="">-- Sélectionner une chambre --</option>
            ${availableRooms.map(room => 
                `<option value="${room.id}" data-prix="${room.prix}">
                    Chambre ${room.numero} - ${room.type} (${formatCurrency(room.prix)}/nuit)
                </option>`
            ).join('')}
        `;
    }

    save() {
        // Validation
        const clientNom = document.getElementById('client-nom').value.trim();
        const clientPrenom = document.getElementById('client-prenom').value.trim();
        const clientTelephone = document.getElementById('client-telephone').value.trim();
        const roomId = document.getElementById('room-select').value;
        const checkinDate = document.getElementById('checkin-date').value;
        const checkoutDate = document.getElementById('checkout-date').value;
        const nbPersons = document.getElementById('nb-persons').value;

        if (!clientNom || !clientPrenom || !clientTelephone) {
            alert('Veuillez remplir les informations du client (nom, prénom, téléphone)');
            return;
        }

        if (!roomId) {
            alert('Veuillez sélectionner une chambre');
            return;
        }

        if (!checkinDate || !checkoutDate) {
            alert('Veuillez sélectionner les dates d\'arrivée et de départ');
            return;
        }

        const calculation = this.calculateTotal();
        if (!calculation || calculation.nbNights <= 0) {
            alert('Les dates sélectionnées sont invalides');
            return;
        }

        // Création de la réservation
        const reservationData = {
            id: generateId(),
            client: {
                nom: clientNom,
                prenom: clientPrenom,
                email: document.getElementById('client-email').value.trim(),
                telephone: clientTelephone
            },
            chambre: {
                id: roomId,
                numero: document.getElementById('room-select').options[document.getElementById('room-select').selectedIndex].text.split(' - ')[0].replace('Chambre ', '')
            },
            checkin: formatDateForStorage(checkinDate),
            checkout: formatDateForStorage(checkoutDate),
            nbNuits: calculation.nbNights,
            prixTotal: calculation.totalPrice,
            nbPersons: nbPersons,
            statut: 'Confirmée',
            notes: document.getElementById('notes').value.trim(),
            createdAt: new Date().toISOString()
        };

        // Appel au callback de sauvegarde
        if (this.onSave) {
            this.onSave(reservationData);
        }

        this.close();
        
        // Notification de succès
        alert('Réservation créée avec succès !');
    }
}

// Export par défaut
export default NewReservationModal;
