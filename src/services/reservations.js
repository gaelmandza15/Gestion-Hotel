import { storage } from '../utils/storage.js';
import { generateId } from '../utils/idGenerator.js';

const RESERVATIONS_KEY = 'hotel_reservations';

// Données initiales si vides
const initialReservations = [
  {
    id: 'r1',
    clientId: 'c1',
    roomId: '101',
    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    totalAmount: 250000,
    paidAmount: 0,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    notes: ''
  },
  {
    id: 'r2',
    clientId: 'c2',
    roomId: '201',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    adults: 1,
    children: 1,
    totalAmount: 360000,
    paidAmount: 100000,
    status: 'checked-in',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Chambre non-fumeur'
  }
];

export const reservationsService = {
  getAll() {
    const reservations = storage.get(RESERVATIONS_KEY);
    if (!reservations || reservations.length === 0) {
      storage.set(RESERVATIONS_KEY, initialReservations);
      return initialReservations;
    }
    return reservations;
  },

  getById(id) {
    const reservations = this.getAll();
    return reservations.find(r => r.id === id);
  },

  create(reservationData) {
    const reservations = this.getAll();
    const newReservation = {
      id: generateId('r'),
      ...reservationData,
      createdAt: new Date().toISOString()
    };
    reservations.push(newReservation);
    storage.set(RESERVATIONS_KEY, reservations);
    return newReservation;
  },

  update(id, reservationData) {
    const reservations = this.getAll();
    const index = reservations.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Réservation non trouvée');
    
    reservations[index] = { ...reservations[index], ...reservationData };
    storage.set(RESERVATIONS_KEY, reservations);
    return reservations[index];
  },

  delete(id) {
    const reservations = this.getAll();
    const filtered = reservations.filter(r => r.id !== id);
    
    if (filtered.length === reservations.length) {
      throw new Error('Réservation non trouvée');
    }
    
    storage.set(RESERVATIONS_KEY, filtered);
    return true;
  },

  // Actions de statut
  checkIn(id) {
    return this.update(id, { 
      status: 'checked-in',
      checkInDate: new Date().toISOString()
    });
  },

  checkOut(id) {
    return this.update(id, { 
      status: 'completed',
      checkOutDate: new Date().toISOString()
    });
  },

  cancel(id) {
    return this.update(id, { 
      status: 'cancelled',
      cancelledAt: new Date().toISOString()
    });
  },

  confirm(id) {
    return this.update(id, { 
      status: 'confirmed',
      confirmedAt: new Date().toISOString()
    });
  },

  // Gestion des paiements
  addPayment(id, paymentData) {
    const reservation = this.getById(id);
    if (!reservation) throw new Error('Réservation non trouvée');

    const payments = reservation.payments || [];
    payments.push(paymentData);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = reservation.totalAmount || 0;

    let paymentStatus = 'pending';
    if (totalPaid > 0 && totalPaid < totalAmount) {
      paymentStatus = 'partial';
    } else if (totalPaid >= totalAmount) {
      paymentStatus = 'paid';
    }

    return this.update(id, {
      payments,
      paidAmount: totalPaid,
      paymentStatus
    });
  },

  // Recherche et filtres
  search(query) {
    const reservations = this.getAll();
    if (!query) return reservations;
    
    const lowerQuery = query.toLowerCase();
    return reservations.filter(r => 
      r.id.toLowerCase().includes(lowerQuery) ||
      (r.clientName && r.clientName.toLowerCase().includes(lowerQuery))
    );
  },

  getByStatus(status) {
    const reservations = this.getAll();
    return reservations.filter(r => r.status === status);
  },

  getUpcomingCheckIns() {
    const reservations = this.getAll();
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return reservations.filter(r => {
      const checkIn = new Date(r.checkIn);
      return checkIn >= today && checkIn <= nextWeek && r.status !== 'cancelled';
    });
  },

  getCurrentStays() {
    const reservations = this.getAll();
    const today = new Date();
    
    return reservations.filter(r => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return today >= checkIn && today <= checkOut && r.status === 'confirmed';
    });
  }
};

// Export des fonctions utilitaires pour compatibilité
export function getReservationById(id) {
  return reservationsService.getById(id);
}

export function updateReservation(id, data) {
  try {
    reservationsService.update(id, data);
    return true;
  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    return false;
  }
}

export function cancelReservation(id) {
  try {
    reservationsService.cancel(id);
    return true;
  } catch (error) {
    console.error('Erreur annulation réservation:', error);
    return false;
  }
}

export function createReservation(data) {
  return reservationsService.create(data);
}

export function getAllReservations() {
  return reservationsService.getAll();
}
