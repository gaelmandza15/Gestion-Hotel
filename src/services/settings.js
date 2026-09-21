import { storage } from './storage.js';

const SETTINGS_KEY = 'hotel_settings';

// Paramètres par défaut
const defaultSettings = {
  hotelName: 'Hôtel Palace',
  address: '123 Avenue Principale',
  city: 'Kinshasa',
  country: 'RDC',
  phone: '+243 81 000 0000',
  email: 'contact@hotelpalace.cd',
  currency: 'CDF',
  taxRate: 16, // TVA en pourcentage
  checkInTime: '14:00',
  checkOutTime: '11:00',
  logo: null,
  invoiceFooter: 'Merci de votre confiance!',
  allowOverbooking: false,
  autoConfirmReservations: true
};

export const settingsService = {
  getAll() {
    const settings = storage.get(SETTINGS_KEY);
    if (!settings) {
      storage.set(SETTINGS_KEY, defaultSettings);
      return defaultSettings;
    }
    return settings;
  },

  get(key) {
    const settings = this.getAll();
    return settings[key];
  },

  update(settingsData) {
    const currentSettings = this.getAll();
    const updatedSettings = { ...currentSettings, ...settingsData };
    storage.set(SETTINGS_KEY, updatedSettings);
    return updatedSettings;
  },

  reset() {
    storage.set(SETTINGS_KEY, defaultSettings);
    return defaultSettings;
  },

  // Obtenir les informations complètes de l'hôtel pour les factures
  getHotelInfo() {
    const settings = this.getAll();
    return {
      name: settings.hotelName,
      address: `${settings.address}, ${settings.city}`,
      country: settings.country,
      phone: settings.phone,
      email: settings.email,
      taxRate: settings.taxRate
    };
  }
};
