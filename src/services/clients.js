import { generateId } from '../utils/idGenerator.js';
import { storage } from '../utils/storage.js';

const CLIENTS_KEY = 'hotel_clients';

// Données initiales si vides
const initialClients = [
  {
    id: 'c1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    address: '10 Rue de la Paix, Paris',
    city: 'Paris',
    country: 'France',
    idType: 'Passeport',
    idNumber: 'AB123456',
    createdAt: new Date().toISOString(),
    totalStays: 3,
    totalSpent: 450000
  },
  {
    id: 'c2',
    firstName: 'Marie',
    lastName: 'Kabasele',
    email: 'marie.k@email.cd',
    phone: '+243 81 234 5678',
    address: 'Av. de la Libération',
    city: 'Kinshasa',
    country: 'RDC',
    idType: 'Carte Nationale',
    idNumber: 'CN987654',
    createdAt: new Date().toISOString(),
    totalStays: 1,
    totalSpent: 120000
  }
];

export const clientsService = {
  getAll() {
    const clients = storage.get(CLIENTS_KEY);
    if (!clients || clients.length === 0) {
      storage.set(CLIENTS_KEY, initialClients);
      return initialClients;
    }
    return clients;
  },

  getById(id) {
    const clients = this.getAll();
    return clients.find(c => c.id === id);
  },

  search(query) {
    const clients = this.getAll();
    if (!query) return clients;
    
    const lowerQuery = query.toLowerCase();
    return clients.filter(c => 
      c.firstName.toLowerCase().includes(lowerQuery) ||
      c.lastName.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query)
    );
  },

  create(clientData) {
    const clients = this.getAll();
    const newClient = {
      id: generateId('c'),
      ...clientData,
      createdAt: new Date().toISOString(),
      totalStays: 0,
      totalSpent: 0
    };
    
    clients.push(newClient);
    storage.set(CLIENTS_KEY, clients);
    return newClient;
  },

  update(id, clientData) {
    const clients = this.getAll();
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) throw new Error('Client non trouvé');
    
    clients[index] = { ...clients[index], ...clientData };
    storage.set(CLIENTS_KEY, clients);
    return clients[index];
  },

  delete(id) {
    const clients = this.getAll();
    const filtered = clients.filter(c => c.id !== id);
    
    if (filtered.length === clients.length) {
      throw new Error('Client non trouvé');
    }
    
    storage.set(CLIENTS_KEY, filtered);
    return true;
  },

  // Mettre à jour les statistiques du client après un séjour
  updateClientStats(clientId, amountPaid) {
    const clients = this.getAll();
    const client = clients.find(c => c.id === clientId);
    
    if (client) {
      client.totalStays = (client.totalStays || 0) + 1;
      client.totalSpent = (client.totalSpent || 0) + amountPaid;
      storage.set(CLIENTS_KEY, clients);
    }
  }
};
