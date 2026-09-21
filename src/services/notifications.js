/**
 * Service de gestion des notifications
 * Gère les alertes pour l'utilisateur (arrivées, départs, erreurs, succès)
 */

import { formatDate } from '../utils/dates.js';

class NotificationService {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Création du conteneur de notifications
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }

    /**
     * Affiche une notification
     * @param {string} message - Le message à afficher
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {number} duration - Durée en ms (défaut 3000)
     */
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.style.cssText = `
            background: white;
            border-left: 4px solid ${colors[type] || colors.info};
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            min-width: 300px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        notification.innerHTML = `
            <span style="font-size: 18px; color: ${colors[type] || colors.info}">${icons[type] || icons.info}</span>
            <span style="flex: 1; color: #1f2937;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none; border:none; cursor:pointer; color:#9ca3af; font-size:18px;">&times;</button>
        `;

        this.container.appendChild(notification);

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        // Ajout des keyframes si pas déjà présents
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }

    /**
     * Vérifie et affiche les notifications importantes au chargement
     */
    checkDailyEvents(reservations) {
        const today = new Date().toISOString().split('T')[0];
        
        const arrivals = reservations.filter(r => r.checkIn === today && r.status !== 'checked_out');
        const departures = reservations.filter(r => r.checkOut === today && r.status === 'checked_in');
        
        if (arrivals.length > 0) {
            setTimeout(() => {
                this.info(`📅 ${arrivals.length} arrivée(s) prévue(s) aujourd'hui`);
            }, 1000);
        }
        
        if (departures.length > 0) {
            setTimeout(() => {
                this.warning(`🚪 ${departures.length} départ(s) prévu(s) aujourd'hui`);
            }, 1500);
        }
    }
}

export default new NotificationService();
