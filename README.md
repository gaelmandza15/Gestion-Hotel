# 🏨 GestionHôtel - Système de Gestion Hôtelière Léger

> Application de gestion hôtelière conçue pour l'Afrique francophone, fonctionnant **100% hors-ligne**.

## 🚀 Démarrage Rapide

### Option 1: Serveur Local (Recommandé)
```bash
# Depuis la racine du projet
python3 -m http.server 8080

# Ouvrir dans le navigateur
http://localhost:8080
```

### Option 2: Ouvrir Directement
Ouvrez simplement `index.html` dans votre navigateur moderne (Chrome, Firefox, Edge).

## 📁 Architecture du Projet

```
/workspace
├── AI_MAP.md                 # 🤖 Guide de contexte pour l'IA
├── PROJECT_MAP.md            # 🗺️ Carte architecturale du projet
├── DYNAMIC_RULES.md          # 📜 Règles métier configurables
├── index.html                # Point d'entrée unique
│
└── src/
    ├── main.js               # ⚡ Initialisation application
    │
    ├── services/             # 🧠 Logique métier
    │   ├── storage.js        # Gestion localStorage
    │   ├── reservations.js   # (À venir) Logique réservations
    │   ├── rooms.js          # (À venir) Gestion chambres
    │   ├── clients.js        # (À venir) Gestion clients
    │   ├── billing.js        # (À venir) Facturation
    │   └── settings.js       # (À venir) Paramètres
    │
    ├── components/           # 🎨 Rendu UI
    │   ├── navigation.js     # Menu secondaire
    │   ├── dashboard.js      # Tableau de bord
    │   ├── reservationsTable.js # Tableau réservations
    │   └── modals/           # (À venir) Modales
    │
    ├── data/                 # 💾 Données
    │   ├── countries.js      # Configs par pays (TVA, devise)
    │   └── mockData.js       # Données de démo
    │
    └── utils/                # 🛠️ Utilitaires
        ├── currency.js       # Formatage FCFA (sans décimales)
        ├── dates.js          # Formatage dates
        └── validators.js     # Validation formulaires
```

## 🎯 Fonctionnalités Implémentées

### ✅ Actuellement Fonctionnel

- **Tableau de Bord**
  - Taux d'occupation en temps réel
  - Arrivées et départs du jour
  - Revenu journalier estimé
  - Navigation vers toutes les réservations

- **Gestion des Réservations**
  - Tableau complet avec tous les détails
  - Recherche instantanée par client/chambre
  - Statuts colorés (Devis, Confirmée, En séjour, Terminée, Annulée)
  - Indicateurs "Aujourd'hui" pour arrivées/départs

- **Navigation**
  - Barre latérale iconique (design moderne)
  - Menu secondaire contextuel
  - Filtres rapides par statut de chambre
  - Badge de notifications sur les réservations

- **Données**
  - Stockage local persistant (localStorage)
  - Données de démo pré-chargées
  - Support multi-pays (TVA, devises, identifiants fiscaux)

### 🔨 À Venir (Prochaines Itérations)

- [ ] Modale de création/modification de réservation
- [ ] Gestion complète des chambres (grid view, statuts)
- [ ] Fiche client détaillée
- [ ] Génération de factures (PDF)
- [ ] Check-in / Check-out
- [ ] Planning calendrier
- [ ] Export/import des données (USB)
- [ ] Paramètres établissement complets

## 🌍 Spécificités Afrique Francophone

### Devise FCFA
- **Zéro décimale** : Affichage `5 000 FCFA` (pas `5 000,00`)
- Séparateur de milliers : espace (`5 000`)
- Support XAF, XOF, CDF, GNF, MGA

### Téléphone Prioritaire
- Téléphone **obligatoire** pour les clients
- Email optionnel
- Format libre (pas de validation stricte)

### Adresses Simplifiées
- Champ texte unique (quartier, BP, secteur)
- Pas de code postal obligatoire
- Ville et pays optionnels

### Mobile Money
- Modes de paiement intégrés :
  - Orange Money
  - MTN Mobile Money
  - Wave
  - Moov Money
  - Airtel Money
- Champ `numeroTransaction` requis

### TVA par Pays
Pré-configurée pour 16 pays :

| Pays | Devise | TVA | Identifiant |
|------|--------|-----|-------------|
| Sénégal | XOF | 18% | NINEA |
| Côte d'Ivoire | XOF | 18% | NIF/RCCM |
| Cameroun | XAF | 19.25% | NIU |
| Gabon | XAF | 18% | NIF |
| RDC | CDF | 16% | NIF |
| Maroc | MAD | 20%/10% | IF/RC |
| ... | ... | ... | ... |

Voir `DYNAMIC_RULES.md` pour la liste complète.

## 🛠️ Technologies

- **HTML5** - Structure sémantique
- **Tailwind CSS** (CDN) - Styling utilitaire
- **Vanilla JS** (ES Modules) - Logique sans framework
- **localStorage** - Persistance des données
- **Google Fonts** - Plus Jakarta Sans

## 🔒 Confidentialité & Sécurité

- **Aucune donnée ne sort de l'appareil**
- Pas de connexion internet requise
- Pas de cookies tiers
- Pas de tracking
- Sauvegarde manuelle possible (export JSON)

## 📝 Conventions de Développement

### Commentaires "Agent-Friendly"
Chaque fichier commence par un en-tête décrivant :
```javascript
// ROLE: [Description du rôle]
// INPUT: [Ce qui entre]
// OUTPUT: [Ce qui sort]
// DEPENDS ON: [Dépendances]
```

### Séparation Stricte
- **Services** : Logique pure, zéro DOM
- **Components** : Rendu DOM uniquement
- **Utils** : Fonctions pures testables

### Imports/Exports
Utilisation exclusive des ES Modules :
```javascript
import { maFonction } from './monModule.js'
export const maConstante = 'valeur'
```

## 🐛 Débogage

### Console Navigateur
```javascript
// Voir l'état actuel
console.log(window.appState)

// Recharger les données
window.loadData()

// Naviguer vers une vue
window.navigateTo('reservations')
```

### Reset Complet
```javascript
// Dans la console
localStorage.clear()
location.reload()
```

### Vérifier le Storage
```javascript
// Liste des clés
Object.keys(localStorage).filter(k => k.startsWith('gestion_hotel_'))

// Voir une donnée spécifique
JSON.parse(localStorage.getItem('gestion_hotel_reservations'))
```

## 📄 Documentation Complète

| Fichier | Description |
|---------|-------------|
| `AI_MAP.md` | Guide pour travailler avec une IA sur ce projet |
| `PROJECT_MAP.md` | Architecture détaillée et flux de données |
| `DYNAMIC_RULES.md` | Toutes les règles métier configurables |

## 🤝 Contribution

Pour ajouter une fonctionnalité :

1. Lire `AI_MAP.md` pour comprendre l'architecture
2. Consulter `DYNAMIC_RULES.md` pour les contraintes métier
3. Créer le service dans `src/services/`
4. Créer le component dans `src/components/`
5. Importer dans `src/main.js`

## 📫 Support

Pour toute question ou problème, consulter la documentation dans les fichiers `.md` à la racine.

---

**Version:** 1.0.0-alpha  
**Licence:** MIT  
**Dernière mise à jour:** 2026-01-01
