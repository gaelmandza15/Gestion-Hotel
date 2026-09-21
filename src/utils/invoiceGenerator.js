/**
 * Service de génération de factures PDF
 * Crée des factures professionnelles prêtes à l'impression
 */

import { formatCurrency } from '../utils/currency.js';
import { formatDate } from '../utils/dates.js';

class InvoiceGenerator {
    /**
     * Génère le contenu HTML d'une facture pour impression
     * @param {Object} reservation - La réservation complète
     * @param {Object} hotelSettings - Paramètres de l'hôtel
     * @returns {string} HTML complet de la facture
     */
    generateInvoiceHTML(reservation, hotelSettings) {
        const invoiceDate = new Date().toISOString();
        const invoiceNumber = `FAC-${reservation.id}-${new Date().getFullYear()}`;
        
        // Calcul des détails
        const nights = this.calculateNights(reservation.checkIn, reservation.checkOut);
        const subtotal = reservation.totalPrice / (1 + (hotelSettings.taxRate || 0.18));
        const taxAmount = reservation.totalPrice - subtotal;
        
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #2563eb;
        }
        
        .hotel-info h1 {
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .hotel-info p {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-meta h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .invoice-meta p {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
        }
        
        .client-section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
        }
        
        .client-section h3 {
            color: #2563eb;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .client-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .detail-row {
            display: flex;
            gap: 10px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #555;
            min-width: 100px;
        }
        
        .detail-value {
            color: #333;
        }
        
        .stay-info {
            margin-bottom: 30px;
        }
        
        .stay-info h3 {
            color: #2563eb;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        tr:nth-child(even) {
            background: #f9fafb;
        }
        
        .totals-section {
            margin-left: auto;
            width: 300px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .total-row.final {
            border-top: 2px solid #2563eb;
            border-bottom: none;
            font-weight: 700;
            font-size: 18px;
            background: #eff6ff;
            border-radius: 4px;
        }
        
        .payment-status {
            margin-top: 30px;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
        }
        
        .paid {
            background: #d1fae5;
            color: #065f46;
        }
        
        .partial {
            background: #fef3c7;
            color: #92400e;
        }
        
        .unpaid {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 13px;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(0,0,0,0.03);
            z-index: -1;
            pointer-events: none;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="watermark">FACTURE</div>
    
    <div class="invoice-header">
        <div class="hotel-info">
            <h1>${hotelSettings.hotelName || 'Hôtel'}</h1>
            <p>${hotelSettings.address || ''}</p>
            <p>${hotelSettings.city || ''} ${hotelSettings.zipCode || ''}</p>
            <p>Tél: ${hotelSettings.phone || ''}</p>
            <p>Email: ${hotelSettings.email || ''}</p>
            ${hotelSettings.taxId ? `<p>NIF: ${hotelSettings.taxId}</p>` : ''}
        </div>
        
        <div class="invoice-meta">
            <h2>FACTURE</h2>
            <p><strong>N°:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${formatDate(invoiceDate)}</p>
            <p><strong>Réservation:</strong> #${reservation.id}</p>
        </div>
    </div>
    
    <div class="client-section">
        <h3>👤 Informations Client</h3>
        <div class="client-details">
            <div class="detail-row">
                <span class="detail-label">Nom:</span>
                <span class="detail-value">${reservation.client?.firstName || ''} ${reservation.client?.lastName || ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${reservation.client?.email || ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Téléphone:</span>
                <span class="detail-value">${reservation.client?.phone || ''}</span>
            </div>
            ${reservation.client?.company ? `
            <div class="detail-row">
                <span class="detail-label">Société:</span>
                <span class="detail-value">${reservation.client.company}</span>
            </div>
            ` : ''}
        </div>
    </div>
    
    <div class="stay-info">
        <h3>📅 Détails du Séjour</h3>
        <table>
            <thead>
                <tr>
                    <th>Chambre</th>
                    <th>Type</th>
                    <th>Arrivée</th>
                    <th>Départ</th>
                    <th>Nuits</th>
                    <th>Prix/Nuit</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>${reservation.room?.number || 'N/A'}</strong></td>
                    <td>${reservation.room?.type || 'N/A'}</td>
                    <td>${formatDate(reservation.checkIn)}</td>
                    <td>${formatDate(reservation.checkOut)}</td>
                    <td>${nights}</td>
                    <td>${formatCurrency(reservation.room?.pricePerNight || 0)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="totals-section">
        <div class="total-row">
            <span>Sous-total</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="total-row">
            <span>TVA (${(hotelSettings.taxRate || 0.18) * 100}%)</span>
            <span>${formatCurrency(taxAmount)}</span>
        </div>
        <div class="total-row final">
            <span>Total TTC</span>
            <span>${formatCurrency(reservation.totalPrice)}</span>
        </div>
        <div class="total-row">
            <span>Déjà payé</span>
            <span style="color: #10b981;">${formatCurrency(reservation.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)}</span>
        </div>
        <div class="total-row" style="border-bottom: none;">
            <span>Restant à payer</span>
            <span style="color: #ef4444; font-weight: 600;">${formatCurrency((reservation.totalPrice || 0) - (reservation.payments?.reduce((sum, p) => sum + p.amount, 0) || 0))}</span>
        </div>
    </div>
    
    <div class="payment-status ${this.getStatusClass(reservation)}">
        ${this.getStatusText(reservation)}
    </div>
    
    <div class="footer">
        <p>Merci de votre confiance !</p>
        <p>${hotelSettings.hotelName || 'Hôtel'} - Tous droits réservés © ${new Date().getFullYear()}</p>
        <p style="margin-top: 10px; font-size: 11px;">
            En cas de litige, merci de nous contacter dans un délai de 48h.<br>
            Cette facture fait office de reçu de paiement.
        </p>
    </div>
    
    <button class="no-print" onclick="window.print()" 
        style="position: fixed; bottom: 20px; right: 20px; background: #2563eb; color: white; 
               border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; 
               font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        🖨️ Imprimer la facture
    </button>
</body>
</html>
        `;
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
     * Obtient la classe CSS pour le statut de paiement
     */
    getStatusClass(reservation) {
        const totalPaid = reservation.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const totalPrice = reservation.totalPrice || 0;
        
        if (totalPaid >= totalPrice) return 'paid';
        if (totalPaid > 0) return 'partial';
        return 'unpaid';
    }

    /**
     * Obtient le texte pour le statut de paiement
     */
    getStatusText(reservation) {
        const totalPaid = reservation.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const totalPrice = reservation.totalPrice || 0;
        
        if (totalPaid >= totalPrice) return '✅ PAYÉ EN TOTALITÉ';
        if (totalPaid > 0) return `⚠️ PAYÉ PARTIELLEMENT (${Math.round((totalPaid / totalPrice) * 100)}%)`;
        return '❌ NON PAYÉ';
    }

    /**
     * Ouvre la facture dans une nouvelle fenêtre pour impression
     */
    printInvoice(reservation, hotelSettings) {
        const html = this.generateInvoiceHTML(reservation, hotelSettings);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();
    }

    /**
     * Télécharge la facture en tant que fichier HTML
     */
    downloadInvoice(reservation, hotelSettings, filename = null) {
        const html = this.generateInvoiceHTML(reservation, hotelSettings);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `Facture_${reservation.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export default new InvoiceGenerator();
