import { reservationsService } from '../services/reservations.js';
import { roomsService } from '../services/rooms.js';
import { clientsService } from '../services/clients.js';
import { settingsService } from '../services/settings.js';
import { formatCurrency } from '../utils/currency.js';
import { formatDate, calculateNights } from '../utils/dates.js';

export function createBillingView() {
  const view = document.createElement('div');
  view.className = 'view-container';
  view.id = 'billing-view';

  view.innerHTML = `
    <div class="view-header">
      <h2><i class="fas fa-file-invoice-dollar"></i> Facturation</h2>
    </div>

    <div class="filters-bar">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" id="billing-search" placeholder="Rechercher par nom, numéro de réservation...">
      </div>
      <div class="filter-group">
        <select id="billing-status-filter">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="partial">Partiellement payé</option>
          <option value="paid">Payé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Réservation</th>
            <th>Client</th>
            <th>Chambre</th>
            <th>Séjour</th>
            <th>Montant total</th>
            <th>Payé</th>
            <th>Reste à payer</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="billing-table-body">
          <!-- Rempli dynamiquement -->
        </tbody>
      </table>
    </div>
  `;

  // Charger les données
  loadBillingData(view);

  // Événements
  view.querySelector('#billing-search').addEventListener('input', (e) => {
    filterBilling(view, e.target.value, view.querySelector('#billing-status-filter').value);
  });
  
  view.querySelector('#billing-status-filter').addEventListener('change', (e) => {
    filterBilling(view, view.querySelector('#billing-search').value, e.target.value);
  });

  return view;
}

function loadBillingData(view, searchQuery = '', statusFilter = '') {
  const reservations = reservationsService.getAll();
  const tbody = view.querySelector('#billing-table-body');

  // Filtrer les réservations avec facturation
  let filtered = reservations.filter(r => 
    r.status !== 'cancelled' || r.paymentStatus === 'partial'
  );

  // Appliquer le filtre de statut
  if (statusFilter) {
    filtered = filtered.filter(r => r.paymentStatus === statusFilter);
  }

  // Appliquer la recherche
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(r => {
      const client = clientsService.getById(r.clientId);
      const room = roomsService.getById(r.roomId);
      return (
        r.id.toLowerCase().includes(query) ||
        (client && (client.firstName + ' ' + client.lastName).toLowerCase().includes(query)) ||
        (room && room.number.toLowerCase().includes(query))
      );
    });
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
          <p>Aucune facture trouvée</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(reservation => {
    const client = clientsService.getById(reservation.clientId);
    const room = roomsService.getById(reservation.roomId);
    const totalAmount = reservation.totalAmount || 0;
    const paidAmount = reservation.paidAmount || 0;
    const remainingAmount = totalAmount - paidAmount;

    return `
      <tr data-reservation-id="${reservation.id}">
        <td><strong>#${reservation.id.toUpperCase()}</strong></td>
        <td>${client ? `${client.firstName} ${client.lastName}` : 'Inconnu'}</td>
        <td>${room ? `Chambre ${room.number}` : 'N/A'}</td>
        <td>
          <small>${formatDate(reservation.checkIn)}</small><br>
          <small>au ${formatDate(reservation.checkOut)}</small>
        </td>
        <td><strong>${formatCurrency(totalAmount)}</strong></td>
        <td class="text-success">${formatCurrency(paidAmount)}</td>
        <td class="${remainingAmount > 0 ? 'text-danger' : ''}">
          <strong>${formatCurrency(remainingAmount)}</strong>
        </td>
        <td>
          ${getPaymentStatusBadge(reservation.paymentStatus)}
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-info" title="Voir détails" onclick="window.viewInvoice('${reservation.id}')">
              <i class="fas fa-eye"></i>
            </button>
            ${remainingAmount > 0 ? `
              <button class="btn-icon btn-success" title="Payer" onclick="window.openPaymentModal('${reservation.id}')">
                <i class="fas fa-credit-card"></i>
              </button>
            ` : ''}
            <button class="btn-icon btn-secondary" title="Imprimer" onclick="window.printInvoice('${reservation.id}')">
              <i class="fas fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getPaymentStatusBadge(status) {
  const badges = {
    'pending': '<span class="status-badge warning">En attente</span>',
    'partial': '<span class="status-badge info">Partiel</span>',
    'paid': '<span class="status-badge success">Payé</span>',
    'cancelled': '<span class="status-badge danger">Annulé</span>'
  };
  return badges[status] || '<span class="status-badge">Inconnu</span>';
}

function filterBilling(view, query, status) {
  loadBillingData(view, query, status);
}

// Fonction globale pour voir la facture
window.viewInvoice = function(reservationId) {
  const reservation = reservationsService.getById(reservationId);
  if (!reservation) return;

  const client = clientsService.getById(reservation.clientId);
  const room = roomsService.getById(reservation.roomId);
  const settings = settingsService.getAll();

  const totalAmount = reservation.totalAmount || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;
  const nights = calculateNights(reservation.checkIn, reservation.checkOut);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'invoice-modal';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <div class="modal-header">
        <h3><i class="fas fa-file-invoice"></i> Facture #${reservation.id.toUpperCase()}</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="invoice-preview" id="invoice-content">
        <div class="invoice-header">
          <div class="hotel-info">
            <h2>${settings.hotelName}</h2>
            <p>${settings.address}, ${settings.city}</p>
            <p>${settings.country} | Tél: ${settings.phone}</p>
            <p>Email: ${settings.email}</p>
          </div>
          <div class="invoice-meta">
            <h3>FACTURE</h3>
            <p><strong>N°:</strong> ${reservation.id.toUpperCase()}</p>
            <p><strong>Date:</strong> ${formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        <div class="invoice-parties">
          <div class="bill-to">
            <h4>Facturé à:</h4>
            <p><strong>${client?.firstName || ''} ${client?.lastName || ''}</strong></p>
            <p>${client?.address || ''}</p>
            <p>${client?.city || ''}, ${client?.country || ''}</p>
            <p>${client?.email || ''} | ${client?.phone || ''}</p>
          </div>
          <div class="stay-info">
            <h4>Détails du séjour:</h4>
            <p><strong>Chambre:</strong> ${room ? room.number : 'N/A'} (${room?.type || ''})</p>
            <p><strong>Arrivée:</strong> ${formatDate(reservation.checkIn)}</p>
            <p><strong>Départ:</strong> ${formatDate(reservation.checkOut)}</p>
            <p><strong>Durée:</strong> ${nights} nuit(s)</p>
          </div>
        </div>

        <table class="invoice-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix unitaire</th>
              <th>Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hébergement - ${room?.type || 'Chambre'}</td>
              <td>${nights}</td>
              <td>${formatCurrency(room?.pricePerNight || 0)}</td>
              <td>${formatCurrency(totalAmount / (1 + settings.taxRate/100))}</td>
            </tr>
            ${reservation.extraServices && reservation.extraServices.length > 0 ? 
              reservation.extraServices.map(service => `
                <tr>
                  <td>${service.name}</td>
                  <td>${service.quantity || 1}</td>
                  <td>${formatCurrency(service.price)}</td>
                  <td>${formatCurrency(service.price * (service.quantity || 1))}</td>
                </tr>
              `).join('') : ''}
          </tbody>
        </table>

        <div class="invoice-totals">
          <div class="total-row">
            <span>Total HT:</span>
            <span>${formatCurrency(totalAmount / (1 + settings.taxRate/100))}</span>
          </div>
          <div class="total-row">
            <span>TVA (${settings.taxRate}%):</span>
            <span>${formatCurrency(totalAmount - (totalAmount / (1 + settings.taxRate/100)))}</span>
          </div>
          <div class="total-row grand-total">
            <span><strong>Total TTC:</strong></span>
            <span><strong>${formatCurrency(totalAmount)}</strong></span>
          </div>
          <div class="total-row">
            <span>Déjà payé:</span>
            <span class="text-success">${formatCurrency(paidAmount)}</span>
          </div>
          <div class="total-row ${remainingAmount > 0 ? 'text-danger' : ''}">
            <span><strong>Reste à payer:</strong></span>
            <span><strong>${formatCurrency(remainingAmount)}</strong></span>
          </div>
        </div>

        <div class="invoice-footer">
          <p>${settings.invoiceFooter}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
          Fermer
        </button>
        ${remainingAmount > 0 ? `
          <button type="button" class="btn btn-success" onclick="window.openPaymentModal('${reservation.id}')">
            <i class="fas fa-credit-card"></i> Effectuer un paiement
          </button>
        ` : ''}
        <button type="button" class="btn btn-primary" onclick="window.printInvoice('${reservation.id}')">
          <i class="fas fa-print"></i> Imprimer
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
};

// Fonction globale pour ouvrir la modale de paiement
window.openPaymentModal = function(reservationId) {
  const reservation = reservationsService.getById(reservationId);
  if (!reservation) return;

  const totalAmount = reservation.totalAmount || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'payment-modal';

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h3><i class="fas fa-credit-card"></i> Effectuer un paiement</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="payment-form">
        <div class="form-group">
          <label>Réservation</label>
          <p><strong>#${reservation.id.toUpperCase()}</strong></p>
        </div>

        <div class="form-group">
          <label>Montant total</label>
          <p>${formatCurrency(totalAmount)}</p>
        </div>

        <div class="form-group">
          <label>Déjà payé</label>
          <p class="text-success">${formatCurrency(paidAmount)}</p>
        </div>

        <div class="form-group">
          <label>Reste à payer</label>
          <p class="text-danger"><strong>${formatCurrency(remainingAmount)}</strong></p>
        </div>

        <div class="form-group">
          <label for="payment-amount">Montant à payer *</label>
          <input type="number" id="payment-amount" name="amount" min="1" max="${remainingAmount}" 
                 value="${remainingAmount}" required step="100">
        </div>

        <div class="form-group">
          <label for="payment-method">Moyen de paiement *</label>
          <select id="payment-method" name="method" required>
            <option value="">Sélectionner...</option>
            <option value="cash">Espèces</option>
            <option value="card">Carte bancaire</option>
            <option value="mobile">Mobile Money</option>
            <option value="bank">Virement bancaire</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div class="form-group">
          <label for="payment-notes">Notes (optionnel)</label>
          <textarea name="notes" rows="3" placeholder="Référence de transaction, remarques..."></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            Annuler
          </button>
          <button type="submit" class="btn btn-success">
            <i class="fas fa-check"></i> Confirmer le paiement
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Gérer la soumission
  const form = modal.querySelector('#payment-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const paymentData = {
      amount: parseFloat(formData.get('amount')),
      method: formData.get('method'),
      notes: formData.get('notes'),
      date: new Date().toISOString()
    };

    try {
      // Enregistrer le paiement
      reservationsService.addPayment(reservationId, paymentData);
      
      modal.remove();
      
      // Rafraîchir la vue
      const currentView = document.querySelector('#billing-view');
      if (currentView) {
        loadBillingData(currentView);
      }
      
      alert('Paiement enregistré avec succès!');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  });
};

// Fonction globale pour imprimer la facture
window.printInvoice = function(reservationId) {
  const reservation = reservationsService.getById(reservationId);
  if (!reservation) return;

  const client = clientsService.getById(reservation.clientId);
  const room = roomsService.getById(reservation.roomId);
  const settings = settingsService.getAll();

  const totalAmount = reservation.totalAmount || 0;
  const paidAmount = reservation.paidAmount || 0;
  const remainingAmount = totalAmount - paidAmount;
  const nights = calculateNights(reservation.checkIn, reservation.checkOut);

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Facture ${reservation.id.toUpperCase()}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .hotel-info h2 { margin: 0 0 10px 0; color: #2c3e50; }
        .invoice-meta { text-align: right; }
        .invoice-meta h3 { margin: 0 0 10px 0; color: #2c3e50; }
        .invoice-parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        .invoice-totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 12px; }
        .grand-total { font-size: 1.2em; border-top: 2px solid #2c3e50; margin-top: 10px; padding-top: 10px; }
        .invoice-footer { margin-top: 50px; text-align: center; color: #666; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="hotel-info">
          <h2>${settings.hotelName}</h2>
          <p>${settings.address}, ${settings.city}</p>
          <p>${settings.country} | Tél: ${settings.phone}</p>
          <p>Email: ${settings.email}</p>
        </div>
        <div class="invoice-meta">
          <h3>FACTURE</h3>
          <p><strong>N°:</strong> ${reservation.id.toUpperCase()}</p>
          <p><strong>Date:</strong> ${formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      <div class="invoice-parties">
        <div class="bill-to">
          <h4>Facturé à:</h4>
          <p><strong>${client?.firstName || ''} ${client?.lastName || ''}</strong></p>
          <p>${client?.address || ''}</p>
          <p>${client?.city || ''}, ${client?.country || ''}</p>
        </div>
        <div class="stay-info">
          <h4>Détails du séjour:</h4>
          <p><strong>Chambre:</strong> ${room ? room.number : 'N/A'}</p>
          <p><strong>Arrivée:</strong> ${formatDate(reservation.checkIn)}</p>
          <p><strong>Départ:</strong> ${formatDate(reservation.checkOut)}</p>
          <p><strong>Durée:</strong> ${nights} nuit(s)</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qté</th>
            <th>Prix unitaire</th>
            <th>Total HT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hébergement - ${room?.type || 'Chambre'}</td>
            <td>${nights}</td>
            <td>${formatCurrency(room?.pricePerNight || 0)}</td>
            <td>${formatCurrency(totalAmount / (1 + settings.taxRate/100))}</td>
          </tr>
        </tbody>
      </table>

      <div class="invoice-totals">
        <div class="total-row">
          <span>Total HT:</span>
          <span>${formatCurrency(totalAmount / (1 + settings.taxRate/100))}</span>
        </div>
        <div class="total-row">
          <span>TVA (${settings.taxRate}%):</span>
          <span>${formatCurrency(totalAmount - (totalAmount / (1 + settings.taxRate/100)))}</span>
        </div>
        <div class="total-row grand-total">
          <span><strong>Total TTC:</strong></span>
          <span><strong>${formatCurrency(totalAmount)}</strong></span>
        </div>
        <div class="total-row">
          <span>Payé:</span>
          <span>${formatCurrency(paidAmount)}</span>
        </div>
        <div class="total-row">
          <span>Reste à payer:</span>
          <span>${formatCurrency(remainingAmount)}</span>
        </div>
      </div>

      <div class="invoice-footer">
        <p>${settings.invoiceFooter}</p>
      </div>

      <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">Imprimer</button>
    </body>
    </html>
  `);
  printWindow.document.close();
};
