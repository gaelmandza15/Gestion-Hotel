import { settingsService } from '../services/settings.js';

export function createSettingsView() {
  const view = document.createElement('div');
  view.className = 'view-container';
  view.id = 'settings-view';

  const settings = settingsService.getAll();

  view.innerHTML = `
    <div class="view-header">
      <h2><i class="fas fa-cog"></i> Paramètres de l'établissement</h2>
      <button id="btn-save-settings" class="btn btn-primary">
        <i class="fas fa-save"></i> Enregistrer les modifications
      </button>
    </div>

    <div class="settings-grid">
      <!-- Informations générales -->
      <div class="card">
        <h3><i class="fas fa-hotel"></i> Informations de l'hôtel</h3>
        <form id="hotel-info-form">
          <div class="form-group">
            <label>Nom de l'hôtel *</label>
            <input type="text" name="hotelName" value="${settings.hotelName}" required>
          </div>

          <div class="form-group">
            <label>Adresse *</label>
            <input type="text" name="address" value="${settings.address}" required>
          </div>

          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label>Ville *</label>
              <input type="text" name="city" value="${settings.city}" required>
            </div>
            <div class="form-group">
              <label>Pays *</label>
              <input type="text" name="country" value="${settings.country}" required>
            </div>
          </div>

          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label>Téléphone</label>
              <input type="tel" name="phone" value="${settings.phone}">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" value="${settings.email}">
            </div>
          </div>
        </form>
      </div>

      <!-- Configuration -->
      <div class="card">
        <h3><i class="fas fa-sliders-h"></i> Configuration</h3>
        <form id="config-form">
          <div class="form-group">
            <label>Devise</label>
            <select name="currency">
              <option value="CDF" ${settings.currency === 'CDF' ? 'selected' : ''}>Franc Congolais (CDF)</option>
              <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>Dollar US (USD)</option>
              <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>Euro (EUR)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Taux de TVA (%)</label>
            <input type="number" name="taxRate" value="${settings.taxRate}" min="0" max="50" step="0.1">
          </div>

          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="form-group">
              <label>Heure d'arrivée (Check-in)</label>
              <input type="time" name="checkInTime" value="${settings.checkInTime}">
            </div>
            <div class="form-group">
              <label>Heure de départ (Check-out)</label>
              <input type="time" name="checkOutTime" value="${settings.checkOutTime}">
            </div>
          </div>

          <div class="form-group">
            <label>Pied de page des factures</label>
            <textarea name="invoiceFooter" rows="3">${settings.invoiceFooter}</textarea>
          </div>
        </form>
      </div>

      <!-- Options avancées -->
      <div class="card">
        <h3><i class="fas fa-toggle-on"></i> Options avancées</h3>
        <div class="toggle-options">
          <div class="toggle-option">
            <label>
              <input type="checkbox" name="allowOverbooking" ${settings.allowOverbooking ? 'checked' : ''}>
              <span>Autoriser le surbooking</span>
            </label>
            <p class="help-text">Permet de réserver une chambre déjà occupée pour des dates futures</p>
          </div>

          <div class="toggle-option">
            <label>
              <input type="checkbox" name="autoConfirmReservations" ${settings.autoConfirmReservations ? 'checked' : ''}>
              <span>Confirmation automatique des réservations</span>
            </label>
            <p class="help-text">Les nouvelles réservations sont automatiquement confirmées sans validation manuelle</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card">
        <h3><i class="fas fa-tools"></i> Actions système</h3>
        <div class="action-buttons-vertical">
          <button id="btn-reset-settings" class="btn btn-warning">
            <i class="fas fa-undo"></i> Réinitialiser les paramètres par défaut
          </button>
          <button id="btn-export-data" class="btn btn-info">
            <i class="fas fa-download"></i> Exporter toutes les données
          </button>
          <button id="btn-import-data" class="btn btn-secondary">
            <i class="fas fa-upload"></i> Importer des données
          </button>
        </div>
      </div>
    </div>
  `;

  // Événements
  view.querySelector('#btn-save-settings').addEventListener('click', () => saveSettings(view));
  view.querySelector('#btn-reset-settings').addEventListener('click', () => resetSettings(view));
  view.querySelector('#btn-export-data').addEventListener('click', () => exportData());
  view.querySelector('#btn-import-data').addEventListener('click', () => importData());

  return view;
}

function saveSettings(view) {
  try {
    const hotelForm = view.querySelector('#hotel-info-form');
    const configForm = view.querySelector('#config-form');
    const toggleOptions = view.querySelectorAll('.toggle-option input[type="checkbox"]');

    // Récupérer les données des formulaires
    const hotelData = new FormData(hotelForm);
    const configData = new FormData(configForm);

    const allData = {};
    
    // Fusionner les données
    for (let [key, value] of hotelData.entries()) {
      allData[key] = value;
    }
    for (let [key, value] of configData.entries()) {
      allData[key] = value;
    }
    
    // Ajouter les options booléennes
    toggleOptions.forEach(checkbox => {
      allData[checkbox.name] = checkbox.checked;
    });

    // Convertir les valeurs numériques
    allData.taxRate = parseFloat(allData.taxRate) || 0;

    // Sauvegarder
    settingsService.update(allData);

    // Feedback visuel
    const btn = view.querySelector('#btn-save-settings');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Enregistré!';
    btn.classList.add('btn-success');
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-success');
    }, 2000);

  } catch (error) {
    alert('Erreur lors de l\'enregistrement: ' + error.message);
  }
}

function resetSettings(view) {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?')) {
    settingsService.reset();
    // Recharger la vue
    location.reload();
  }
}

function exportData() {
  const data = {
    settings: settingsService.getAll(),
    reservations: JSON.parse(localStorage.getItem('hotel_reservations') || '[]'),
    rooms: JSON.parse(localStorage.getItem('hotel_rooms') || '[]'),
    clients: JSON.parse(localStorage.getItem('hotel_clients') || '[]'),
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_hotel_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (confirm('Cette action va remplacer les données actuelles. Continuer ?')) {
          if (data.settings) localStorage.setItem('hotel_settings', JSON.stringify(data.settings));
          if (data.reservations) localStorage.setItem('hotel_reservations', JSON.stringify(data.reservations));
          if (data.rooms) localStorage.setItem('hotel_rooms', JSON.stringify(data.rooms));
          if (data.clients) localStorage.setItem('hotel_clients', JSON.stringify(data.clients));
          
          alert('Données importées avec succès! La page va se recharger.');
          location.reload();
        }
      } catch (error) {
        alert('Erreur lors de l\'import: fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  input.click();
}
