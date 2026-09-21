/**
 * Modal de détails d'une réservation
 * Affiche les informations complètes et permet les actions (check-in, check-out, modifier, annuler)
 */

import { getReservationById, updateReservation, cancelReservation } from '../../services/reservations.js';
import { getClientById } from '../../services/clients.js';
import { getRoomById } from '../../services/rooms.js';
import { formatDate, calculateNights } from '../../utils/dates.js';
import { formatCurrency } from '../../utils/currency.js';

export function createReservationDetailsModal() {
    const modal = document.createElement('div');
    modal.id = 'reservation-details-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>Détails de la réservation</h2>
                <button class="close-btn" onclick="document.getElementById('reservation-details-modal').style.display='none'">&times;</button>
            </div>
            <div class="modal-body" id="reservation-details-body">
                <!-- Contenu chargé dynamiquement -->
            </div>
            <div class="modal-footer" id="reservation-details-footer">
                <!-- Actions dynamiques -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

export function showReservationDetails(reservationId) {
    const reservation = getReservationById(reservationId);
    if (!reservation) {
        alert('Réservation non trouvée');
        return;
    }

    const client = getClientById(reservation.clientId);
    const room = getRoomById(reservation.roomId);
    const nights = calculateNights(reservation.checkIn, reservation.checkOut);
    const modal = document.getElementById('reservation-details-modal');
    
    // Déterminer le statut et les actions disponibles
    const today = new Date().toISOString().split('T')[0];
    const isCheckedIn = reservation.status === 'checked-in';
    const isCompleted = reservation.status === 'completed';
    const isCancelled = reservation.status === 'cancelled';
    const canCheckIn = !isCheckedIn && !isCompleted && !isCancelled && reservation.checkIn <= today;
    const canCheckOut = isCheckedIn;
    const canModify = !isCheckedIn && !isCompleted && !isCancelled;

    // Générer le contenu HTML
    const bodyContent = `
        <div class="reservation-details-grid">
            <!-- Informations principales -->
            <div class="detail-section">
                <h3>📋 Informations de réservation</h3>
                <div class="detail-row">
                    <span class="label">Numéro de réservation:</span>
                    <span class="value"><strong>#${reservation.id}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="label">Statut:</span>
                    <span class="value">${getStatusBadge(reservation.status)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date de création:</span>
                    <span class="value">${formatDate(reservation.createdAt)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Source:</span>
                    <span class="value">${reservation.source || 'Direct'}</span>
                </div>
            </div>

            <!-- Informations client -->
            <div class="detail-section">
                <h3>👤 Client</h3>
                ${client ? `
                    <div class="detail-row">
                        <span class="label">Nom complet:</span>
                        <span class="value">${client.firstName} ${client.lastName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${client.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Téléphone:</span>
                        <span class="value">${client.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Type de client:</span>
                        <span class="value">${client.type || 'Particulier'}</span>
                    </div>
                ` : '<p class="text-muted">Client non trouvé</p>'}
            </div>

            <!-- Informations chambre -->
            <div class="detail-section">
                <h3>🛏️ Chambre</h3>
                ${room ? `
                    <div class="detail-row">
                        <span class="label">Numéro:</span>
                        <span class="value">${room.number}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Type:</span>
                        <span class="value">${room.type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Capacité:</span>
                        <span class="value">${room.capacity} personne(s)</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Prix par nuit:</span>
                        <span class="value">${formatCurrency(room.pricePerNight)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Statut actuel:</span>
                        <span class="value">${getRoomStatusBadge(room.status)}</span>
                    </div>
                ` : '<p class="text-muted">Chambre non trouvée</p>'}
            </div>

            <!-- Dates et séjour -->
            <div class="detail-section">
                <h3>📅 Séjour</h3>
                <div class="detail-row">
                    <span class="label">Arrivée prévue:</span>
                    <span class="value">${formatDate(reservation.checkIn)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Départ prévu:</span>
                    <span class="value">${formatDate(reservation.checkOut)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Durée:</span>
                    <span class="value">${nights} nuit(s)</span>
                </div>
                <div class="detail-row">
                    <span class="label">Nombre d'adultes:</span>
                    <span class="value">${reservation.adults || 1}</span>
                </div>
                ${reservation.children ? `
                <div class="detail-row">
                    <span class="label">Nombre d'enfants:</span>
                    <span class="value">${reservation.children}</span>
                </div>
                ` : ''}
            </div>

            <!-- Informations financières -->
            <div class="detail-section">
                <h3>💰 Informations financières</h3>
                <div class="detail-row">
                    <span class="label">Prix par nuit:</span>
                    <span class="value">${formatCurrency(reservation.totalAmount / nights)}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Nombre de nuits:</span>
                    <span class="value">${nights}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Sous-total:</span>
                    <span class="value">${formatCurrency(reservation.totalAmount)}</span>
                </div>
                ${reservation.taxAmount ? `
                <div class="detail-row">
                    <span class="label">TVA (${reservation.taxRate || 18}%):</span>
                    <span class="value">${formatCurrency(reservation.taxAmount)}</span>
                </div>
                ` : ''}
                <div class="detail-row total-row">
                    <span class="label">Total TTC:</span>
                    <span class="value"><strong>${formatCurrency(reservation.totalAmount + (reservation.taxAmount || 0))}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="label">Déjà payé:</span>
                    <span class="value" style="color: #27ae60;"><strong>${formatCurrency(reservation.paidAmount || 0)}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="label">Reste à payer:</span>
                    <span class="value" style="color: #e74c3c;"><strong>${formatCurrency((reservation.totalAmount + (reservation.taxAmount || 0)) - (reservation.paidAmount || 0))}</strong></span>
                </div>
            </div>

            <!-- Notes et commentaires -->
            ${reservation.notes ? `
            <div class="detail-section full-width">
                <h3>📝 Notes et commentaires</h3>
                <p class="notes-text">${reservation.notes}</p>
            </div>
            ` : ''}
        </div>
    `;

    // Générer les boutons d'action
    let footerContent = `
        <button class="btn btn-secondary" onclick="document.getElementById('reservation-details-modal').style.display='none'">
            Fermer
        </button>
    `;

    if (canModify) {
        footerContent += `
            <button class="btn btn-primary" onclick="window.editReservation(${reservationId})">
                ✏️ Modifier
            </button>
        `;
    }

    if (canCheckIn) {
        footerContent += `
            <button class="btn btn-success" onclick="window.performCheckIn(${reservationId})">
                ✅ Check-in
            </button>
        `;
    }

    if (canCheckOut) {
        footerContent += `
            <button class="btn btn-warning" onclick="window.performCheckOut(${reservationId})">
                🚪 Check-out
            </button>
        `;
    }

    if (!isCompleted && !isCancelled) {
        footerContent += `
            <button class="btn btn-danger" onclick="window.confirmCancelReservation(${reservationId})">
                ❌ Annuler
            </button>
        `;
    }

    // Injecter le contenu
    document.getElementById('reservation-details-body').innerHTML = bodyContent;
    document.getElementById('reservation-details-footer').innerHTML = footerContent;
    
    // Afficher la modale
    modal.style.display = 'flex';
}

// Fonctions globales pour les actions
window.performCheckIn = function(reservationId) {
    if (confirm('Confirmer le check-in pour cette réservation ?')) {
        const success = updateReservation(reservationId, { status: 'checked-in' });
        if (success) {
            alert('Check-in effectué avec succès !');
            document.getElementById('reservation-details-modal').style.display = 'none';
            // Rafraîchir l'affichage
            if (window.currentView === 'reservations') {
                window.renderReservationsTable();
            }
            if (window.currentView === 'dashboard') {
                window.renderDashboard();
            }
        } else {
            alert('Erreur lors du check-in');
        }
    }
};

window.performCheckOut = function(reservationId) {
    if (confirm('Confirmer le check-out pour cette réservation ?')) {
        const success = updateReservation(reservationId, { status: 'completed' });
        if (success) {
            alert('Check-out effectué avec succès !');
            document.getElementById('reservation-details-modal').style.display = 'none';
            // Rafraîchir l'affichage
            if (window.currentView === 'reservations') {
                window.renderReservationsTable();
            }
            if (window.currentView === 'dashboard') {
                window.renderDashboard();
            }
        } else {
            alert('Erreur lors du check-out');
        }
    }
};

window.confirmCancelReservation = function(reservationId) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.')) {
        const success = cancelReservation(reservationId);
        if (success) {
            alert('Réservation annulée avec succès.');
            document.getElementById('reservation-details-modal').style.display = 'none';
            // Rafraîchir l'affichage
            if (window.currentView === 'reservations') {
                window.renderReservationsTable();
            }
            if (window.currentView === 'dashboard') {
                window.renderDashboard();
            }
        } else {
            alert('Erreur lors de l\'annulation');
        }
    }
};

window.editReservation = function(reservationId) {
    // TODO: Ouvrir la modale de modification
    alert('Fonctionnalité de modification à implémenter');
};

// Helpers pour les badges de statut
function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">En attente</span>',
        'confirmed': '<span class="badge badge-info">Confirmée</span>',
        'checked-in': '<span class="badge badge-success">En cours</span>',
        'completed': '<span class="badge badge-secondary">Terminée</span>',
        'cancelled': '<span class="badge badge-danger">Annulée</span>',
        'no-show': '<span class="badge badge-dark">Non présenté</span>'
    };
    return badges[status] || status;
}

function getRoomStatusBadge(status) {
    const badges = {
        'available': '<span class="badge badge-success">Libre</span>',
        'occupied': '<span class="badge badge-danger">Occupée</span>',
        'maintenance': '<span class="badge badge-warning">Maintenance</span>',
        'reserved': '<span class="badge badge-info">Réservée</span>',
        'out-of-order': '<span class="badge badge-dark">Hors service</span>'
    };
    return badges[status] || status;
}

// Styles CSS pour la modale
const style = document.createElement('style');
style.textContent = `
    .reservation-details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        padding: 20px;
    }
    
    .detail-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #3498db;
    }
    
    .detail-section.full-width {
        grid-column: 1 / -1;
    }
    
    .detail-section h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 16px;
        color: #2c3e50;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .detail-row .label {
        color: #7f8c8d;
        font-weight: 500;
    }
    
    .detail-row .value {
        color: #2c3e50;
        font-weight: 600;
        text-align: right;
    }
    
    .total-row {
        background: #ecf0f1;
        padding: 12px;
        margin-top: 10px;
        border-radius: 4px;
    }
    
    .notes-text {
        background: #fff;
        padding: 15px;
        border-radius: 4px;
        border: 1px solid #ddd;
        font-style: italic;
        color: #555;
    }
    
    .text-muted {
        color: #95a5a6;
        font-style: italic;
    }
    
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: white;
    }
    
    .badge-warning { background: #f39c12; }
    .badge-info { background: #3498db; }
    .badge-success { background: #27ae60; }
    .badge-secondary { background: #95a5a6; }
    .badge-danger { background: #e74c3c; }
    .badge-dark { background: #34495e; }
`;
document.head.appendChild(style);
