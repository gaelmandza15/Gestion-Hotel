import { clientsService } from '../services/clients.js';
import { formatCurrency } from '../utils/currency.js';

export function createClientsView() {
  const view = document.createElement('div');
  view.className = 'view-container';
  view.id = 'clients-view';

  view.innerHTML = `
    <div class="view-header">
      <h2><i class="fas fa-users"></i> Gestion des Clients</h2>
      <button id="btn-add-client" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nouveau Client
      </button>
    </div>

    <div class="filters-bar">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" id="client-search" placeholder="Rechercher un client...">
      </div>
      <div class="stats-summary" id="clients-stats">
        <!-- Statistiques remplies dynamiquement -->
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nom complet</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Ville/Pays</th>
            <th>Séjours</th>
            <th>Total dépensé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="clients-table-body">
          <!-- Rempli dynamiquement -->
        </tbody>
      </table>
    </div>
  `;

  // Charger les données
  loadClientsData(view);

  // Événements
  view.querySelector('#btn-add-client').addEventListener('click', () => openClientModal());
  view.querySelector('#client-search').addEventListener('input', (e) => {
    filterClients(view, e.target.value);
  });

  return view;
}

function loadClientsData(view, searchQuery = '') {
  const clients = searchQuery ? clientsService.search(searchQuery) : clientsService.getAll();
  const tbody = view.querySelector('#clients-table-body');
  const statsDiv = view.querySelector('#clients-stats');

  // Mettre à jour les statistiques
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  
  statsDiv.innerHTML = `
    <span class="stat-badge">
      <i class="fas fa-users"></i> ${totalClients} client${totalClients > 1 ? 's' : ''}
    </span>
    <span class="stat-badge success">
      <i class="fas fa-chart-line"></i> ${formatCurrency(totalRevenue)} au total
    </span>
  `;

  // Remplir le tableau
  if (clients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 10px;"></i>
          <p>Aucun client trouvé</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = clients.map(client => `
    <tr data-client-id="${client.id}">
      <td>
        <strong>${client.firstName} ${client.lastName}</strong>
      </td>
      <td>${client.email || '-'}</td>
      <td>${client.phone || '-'}</td>
      <td>${client.city || ''}${client.city && client.country ? ', ' : ''}${client.country || ''}</td>
      <td><span class="status-badge info">${client.totalStays || 0}</span></td>
      <td><strong>${formatCurrency(client.totalSpent || 0)}</strong></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon btn-edit" title="Modifier" onclick="window.editClient('${client.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-delete" title="Supprimer" onclick="window.deleteClient('${client.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterClients(view, query) {
  loadClientsData(view, query);
}

// Fonctions globales pour les actions du tableau
window.openClientModal = function(clientId = null) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'client-modal';

  const client = clientId ? clientsService.getById(clientId) : null;
  const isEdit = !!client;

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3>${isEdit ? 'Modifier le client' : 'Nouveau client'}</h3>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form id="client-form">
        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="form-group">
            <label>Prénom *</label>
            <input type="text" name="firstName" value="${client?.firstName || ''}" required>
          </div>
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" name="lastName" value="${client?.lastName || ''}" required>
          </div>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${client?.email || ''}">
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" name="phone" value="${client?.phone || ''}" required>
          </div>
        </div>

        <div class="form-group">
          <label>Adresse</label>
          <input type="text" name="address" value="${client?.address || ''}">
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="form-group">
            <label>Ville</label>
            <input type="text" name="city" value="${client?.city || ''}">
          </div>
          <div class="form-group">
            <label>Pays</label>
            <input type="text" name="country" value="${client?.country || 'RDC'}">
          </div>
        </div>

        <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
          <div class="form-group">
            <label>Type de pièce</label>
            <select name="idType">
              <option value="Passeport" ${client?.idType === 'Passeport' ? 'selected' : ''}>Passeport</option>
              <option value="Carte Nationale" ${client?.idType === 'Carte Nationale' ? 'selected' : ''}>Carte Nationale</option>
              <option value="Permis de conduire" ${client?.idType === 'Permis de conduire' ? 'selected' : ''}>Permis de conduire</option>
              <option value="Autre" ${client?.idType === 'Autre' ? 'selected' : ''}>Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label>Numéro de pièce</label>
            <input type="text" name="idNumber" value="${client?.idNumber || ''}">
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> ${isEdit ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Gérer la soumission
  const form = modal.querySelector('#client-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const clientData = Object.fromEntries(formData.entries());

    try {
      if (isEdit) {
        clientsService.update(clientId, clientData);
      } else {
        clientsService.create(clientData);
      }
      
      modal.remove();
      // Rafraîchir la vue actuelle
      const currentView = document.querySelector('.view-container.active');
      if (currentView) {
        loadClientsData(currentView);
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  });
};

window.editClient = function(clientId) {
  window.openClientModal(clientId);
};

window.deleteClient = function(clientId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.')) {
    try {
      clientsService.delete(clientId);
      const currentView = document.querySelector('#clients-view');
      if (currentView) {
        loadClientsData(currentView);
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  }
};
