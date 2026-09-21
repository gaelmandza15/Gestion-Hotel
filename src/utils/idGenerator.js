/**
 * Générateur d'IDs uniques
 */

/**
 * Génère un ID unique avec préfixe optionnel
 * @param {string} prefix - Préfixe optionnel (ex: 'c' pour client, 'r' pour room)
 * @returns {string} ID unique
 */
export function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    return `${prefix}${timestamp}-${randomPart}`;
}

/**
 * Génère un numéro de réservation unique
 * @returns {string} Numéro de réservation formaté (ex: RES-20240101-ABC123)
 */
export function generateReservationNumber() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RES-${date}-${random}`;
}
