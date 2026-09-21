/**
 * Service d'export et d'import des données
 * Permet la sauvegarde et la restauration complète des données
 */

import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dates.js';

class ExportService {
    /**
     * Exporte toutes les données en JSON
     * @returns {Object} Toutes les données de l'application
     */
    exportAllData() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            reservations: JSON.parse(localStorage.getItem('reservations') || '[]'),
            clients: JSON.parse(localStorage.getItem('clients') || '[]'),
            rooms: JSON.parse(localStorage.getItem('rooms') || '[]'),
            settings: JSON.parse(localStorage.getItem('hotelSettings') || '{}'),
            statistics: JSON.parse(localStorage.getItem('statistics') || '{}')
        };

        return data;
    }

    /**
     * Télécharge les données en fichier JSON
     */
    downloadBackup() {
        const data = this.exportAllData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `backup_hotel_${date}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Importe des données depuis un fichier JSON
     * @param {File} file - Le fichier JSON à importer
     * @returns {Promise<Object>} Les données importées
     */
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Validation basique
                    if (!data.version || !data.reservations) {
                        throw new Error('Format de fichier invalide');
                    }

                    // Sauvegarde les données
                    if (data.reservations) {
                        localStorage.setItem('reservations', JSON.stringify(data.reservations));
                    }
                    if (data.clients) {
                        localStorage.setItem('clients', JSON.stringify(data.clients));
                    }
                    if (data.rooms) {
                        localStorage.setItem('rooms', JSON.stringify(data.rooms));
                    }
                    if (data.settings) {
                        localStorage.setItem('hotelSettings', JSON.stringify(data.settings));
                    }
                    if (data.statistics) {
                        localStorage.setItem('statistics', JSON.stringify(data.statistics));
                    }

                    resolve(data);
                } catch (error) {
                    reject(new Error(`Erreur lors de l'import: ${error.message}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('Erreur de lecture du fichier'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Exporte les réservations en CSV
     */
    exportReservationsCSV(reservations) {
        const headers = [
            'ID',
            'Client',
            'Email',
            'Téléphone',
            'Chambre',
            'Type',
            'Arrivée',
            'Départ',
            'Nuits',
            'Prix Total',
            'Statut',
            'Date Création'
        ];

        const rows = reservations.map(r => {
            const nights = this.calculateNights(r.checkIn, r.checkOut);
            return [
                r.id,
                `${r.client?.firstName || ''} ${r.client?.lastName || ''}`,
                r.client?.email || '',
                r.client?.phone || '',
                r.room?.number || '',
                r.room?.type || '',
                r.checkIn,
                r.checkOut,
                nights,
                r.totalPrice || 0,
                this.translateStatus(r.status),
                r.createdAt || ''
            ].map(cell => `"${cell}"`).join(',');
        });

        const csv = [headers.join(','), ...rows].join('\n');
        this.downloadFile(csv, 'reservations.csv', 'text/csv');
    }

    /**
     * Exporte les clients en CSV
     */
    exportClientsCSV(clients) {
        const headers = [
            'ID',
            'Prénom',
            'Nom',
            'Email',
            'Téléphone',
            'Pays',
            'Ville',
            'Société',
            'Total Dépensé',
            'Nombre Séjours'
        ];

        const rows = clients.map(c => [
            c.id,
            c.firstName || '',
            c.lastName || '',
            c.email || '',
            c.phone || '',
            c.country || '',
            c.city || '',
            c.company || '',
            c.totalSpent || 0,
            c.stayCount || 0
        ].map(cell => `"${cell}"`).join(','));

        const csv = [headers.join(','), ...rows].join('\n');
        this.downloadFile(csv, 'clients.csv', 'text/csv');
    }

    /**
     * Calcule le nombre de nuits
     */
    calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    /**
     * Traduit le statut
     */
    translateStatus(status) {
        const translations = {
            confirmed: 'Confirmée',
            checked_in: 'En cours',
            checked_out: 'Terminée',
            cancelled: 'Annulée',
            no_show: 'Non présenté'
        };
        return translations[status] || status;
    }

    /**
     * Télécharge un fichier
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Génère un rapport statistique
     */
    generateReport(reservations, clients, rooms) {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.substring(0, 7);
        
        // Réservations du mois
        const monthReservations = reservations.filter(r => r.createdAt?.startsWith(currentMonth));
        const monthRevenue = monthReservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
        
        // Taux d'occupation
        const activeReservations = reservations.filter(r => 
            r.status === 'checked_in' || (r.checkIn <= today && r.checkOut > today && r.status !== 'cancelled')
        );
        const occupancyRate = ((activeReservations.length / rooms.length) * 100).toFixed(1);
        
        // Clients actifs
        const activeClients = new Set(activeReservations.map(r => r.clientId)).size;
        
        const report = {
            period: currentMonth,
            generatedAt: new Date().toISOString(),
            metrics: {
                totalReservations: monthReservations.length,
                revenue: monthRevenue,
                occupancyRate: parseFloat(occupancyRate),
                activeClients,
                totalRooms: rooms.length,
                availableRooms: rooms.length - activeReservations.length
            },
            topClients: clients
                .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
                .slice(0, 10)
                .map(c => ({
                    name: `${c.firstName} ${c.lastName}`,
                    totalSpent: c.totalSpent,
                    stays: c.stayCount
                }))
        };

        return report;
    }

    /**
     * Télécharge le rapport en PDF (version texte simple)
     */
    downloadReport(reservations, clients, rooms) {
        const report = this.generateReport(reservations, clients, rooms);
        
        const content = `
RAPPORT MENSUEL - GESTION HÔTEL
================================
Période: ${report.period}
Généré le: ${new Date(report.generatedAt).toLocaleDateString('fr-FR')}

MÉTRIQUES CLÉS
--------------
📊 Réservations totales: ${report.metrics.totalReservations}
💰 Revenu du mois: ${this.formatMoney(report.metrics.revenue)}
📈 Taux d'occupation: ${report.metrics.occupancyRate}%
👥 Clients actifs: ${report.metrics.activeClients}
🚪 Chambres totales: ${report.metrics.totalRooms}
🛏️ Chambres disponibles: ${report.metrics.availableRooms}

TOP 10 CLIENTS
--------------
${report.topClients.map((c, i) => 
    `${i + 1}. ${c.name} - ${this.formatMoney(c.totalSpent)} (${c.stays} séjours)`
).join('\n')}

================================
Merci d'utiliser GestionHôtel!
        `.trim();

        this.downloadFile(content, `rapport_${report.period}.txt`, 'text/plain');
    }

    /**
     * Formate l'argent
     */
    formatMoney(amount) {
        return formatCurrency(amount);
    }
}

export default new ExportService();
