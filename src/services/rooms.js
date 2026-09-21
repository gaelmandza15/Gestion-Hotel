/**
 * Service de gestion des chambres
 * Gère le CRUD des chambres et leurs statuts
 */

import { generateId } from '../utils/idGenerator.js';

export class RoomsService {
    constructor() {
        this.storageKey = 'hotel_rooms';
        this.rooms = this.loadRooms();
    }

    loadRooms() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Données par défaut si aucune chambre n'existe
        const defaultRooms = [
            { id: '101', numero: '101', type: 'Simple', prix: 50000, etage: 1, statut: 'Disponible', capacite: 1 },
            { id: '102', numero: '102', type: 'Double', prix: 75000, etage: 1, statut: 'Disponible', capacite: 2 },
            { id: '103', numero: '103', type: 'Double', prix: 75000, etage: 1, statut: 'Disponible', capacite: 2 },
            { id: '201', numero: '201', type: 'Suite', prix: 120000, etage: 2, statut: 'Disponible', capacite: 3 },
            { id: '202', numero: '202', type: 'Simple', prix: 50000, etage: 2, statut: 'Disponible', capacite: 1 },
            { id: '203', numero: '203', type: 'Double', prix: 75000, etage: 2, statut: 'Disponible', capacite: 2 }
        ];
        
        this.saveRooms(defaultRooms);
        return defaultRooms;
    }

    saveRooms(rooms) {
        localStorage.setItem(this.storageKey, JSON.stringify(rooms));
        this.rooms = rooms;
    }

    getAll() {
        return this.rooms;
    }

    getById(id) {
        return this.rooms.find(room => room.id === id);
    }

    getByNumero(numero) {
        return this.rooms.find(room => room.numero === numero);
    }

    getAvailable() {
        return this.rooms.filter(room => room.statut === 'Disponible');
    }

    getOccupied() {
        return this.rooms.filter(room => room.statut === 'Occupée');
    }

    getMaintenance() {
        return this.rooms.filter(room => room.statut === 'Maintenance');
    }

    add(roomData) {
        // Vérifier que le numéro est unique
        if (this.getByNumero(roomData.numero)) {
            throw new Error('Une chambre avec ce numéro existe déjà');
        }

        const newRoom = {
            id: generateId(),
            numero: roomData.numero,
            type: roomData.type || 'Simple',
            prix: parseFloat(roomData.prix) || 0,
            etage: parseInt(roomData.etage) || 1,
            statut: 'Disponible',
            capacite: parseInt(roomData.capacite) || 1,
            createdAt: new Date().toISOString()
        };

        this.rooms.push(newRoom);
        this.saveRooms(this.rooms);
        return newRoom;
    }

    update(id, updates) {
        const index = this.rooms.findIndex(room => room.id === id);
        if (index === -1) {
            throw new Error('Chambre non trouvée');
        }

        // Vérifier l'unicité du numéro si modifié
        if (updates.numero && updates.numero !== this.rooms[index].numero) {
            if (this.getByNumero(updates.numero)) {
                throw new Error('Une chambre avec ce numéro existe déjà');
            }
        }

        this.rooms[index] = {
            ...this.rooms[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveRooms(this.rooms);
        return this.rooms[index];
    }

    delete(id) {
        const index = this.rooms.findIndex(room => room.id === id);
        if (index === -1) {
            throw new Error('Chambre non trouvée');
        }

        // Vérifier si la chambre est occupée
        if (this.rooms[index].statut === 'Occupée') {
            throw new Error('Impossible de supprimer une chambre occupée');
        }

        this.rooms.splice(index, 1);
        this.saveRooms(this.rooms);
        return true;
    }

    updateStatut(id, statut) {
        const validStatuts = ['Disponible', 'Occupée', 'Maintenance', 'Réservée', 'Nettoyage'];
        if (!validStatuts.includes(statut)) {
            throw new Error(`Statut invalide. Options: ${validStatuts.join(', ')}`);
        }

        return this.update(id, { statut });
    }

    getStats() {
        const total = this.rooms.length;
        const disponible = this.rooms.filter(r => r.statut === 'Disponible').length;
        const occupee = this.rooms.filter(r => r.statut === 'Occupée').length;
        const maintenance = this.rooms.filter(r => r.statut === 'Maintenance').length;
        const nettoyage = this.rooms.filter(r => r.statut === 'Nettoyage').length;
        const tauxOccupation = total > 0 ? Math.round((occupee / total) * 100) : 0;

        return {
            total,
            disponible,
            occupee,
            maintenance,
            nettoyage,
            tauxOccupation
        };
    }

    search(query) {
        const searchTerm = query.toLowerCase();
        return this.rooms.filter(room => 
            room.numero.toLowerCase().includes(searchTerm) ||
            room.type.toLowerCase().includes(searchTerm) ||
            room.statut.toLowerCase().includes(searchTerm)
        );
    }
}

// Instance singleton
export const roomsService = new RoomsService();
export default roomsService;
