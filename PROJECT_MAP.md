# 🏨 GestionHôtel - Architecture Orientée Agent

## 📋 Vue d'ensemble
Application de gestion hôtelière légère pour l'Afrique francophone, fonctionnant hors-ligne.

**Technologies:** HTML5, Tailwind CSS (CDN), Vanilla JS (ES Modules)  
**Devise par défaut:** FCFA (XAF/XOF) - sans décimales  
**Mode:** 100% hors-ligne, stockage local (localStorage)

---

## 🗂️ Arborescence du Projet

```
/workspace
├── AI_MAP.md                 # ⭐ Fichier de contexte pour l'IA (à lire en premier)
├── DYNAMIC_RULES.md          # ⭐ Règles métier et configurations dynamiques
├── PROJECT_MAP.md            # ⭐ Carte du projet pour l'IA
├── index.html                # Point d'entrée unique
│
├── public/                   # Assets statiques
│   └── (favicon, images...)
│
└── src/
    ├── main.js               # ⚡ Initialisation de l'application
    │
    ├── services/             # 🧠 Logique métier (NE MODIFIE PAS LE DOM)
    │   ├── storage.js        # Gestion localStorage (CRUD générique)
    │   ├── reservations.js   # Logique des réservations
    │   ├── rooms.js          # Gestion des chambres et statuts
    │   ├── clients.js        # Gestion clients (téléphone obligatoire)
    │   ├── billing.js        # Facturation (TVA, Mobile Money)
    │   └── settings.js       # Configuration (pays, devise, TVA)
    │
    ├── components/           # 🎨 Rendu UI (DOM uniquement)
    │   ├── sidebar.js        # Barre latérale iconique
    │   ├── navigation.js     # Menu secondaire extensible
    │   ├── dashboard.js      # Cartes statistiques
    │   ├── reservationsTable.js # Tableau des réservations
    │   └── modals/           # Modales (nouvelle réservation, facture...)
    │
    ├── data/                 # 💾 Données et constantes
    │   ├── countries.js      # Configurations par pays (TVA, devise, identifiants)
    │   └── mockData.js       # Données de démo (pour initialisation)
    │
    └── utils/                # 🛠️ Utilitaires purs
        ├── currency.js       # Formatage FCFA (sans décimales)
        ├── dates.js          # Formatage dates (DD MMM YYYY)
        └── validators.js     # Validation formulaires (téléphone, NIF...)
```

---

## 🔄 Flux de Données

```
Utilisateur → Composant UI (components/) 
           → Service Métier (services/) 
           → Stockage Local (services/storage.js → localStorage)
           → Mise à jour UI (callback)
```

**Aucune requête réseau** - Tout est local.

---

## 🎯 Règles Métier Critiques (DYNAMIC_RULES.md)

### 1. Devise FCFA
- **Pas de décimales** dans l'affichage (5 000 FCFA, pas 5 000,00)
- Stockage interne: `Number` (flexible)
- Affichage: utilitaire `formatCurrency(amount, currency)`

### 2. Téléphone > Email
- Client: **téléphone obligatoire**, email optionnel
- Format libre (pas de validation stricte internationale)

### 3. Adresse
- Champ texte libre unique (quartier, secteur, BP)
- Pas de découpage rue/code postal/ville

### 4. TVA Paramétrable par Pays
| Pays | Devise | TVA | Identifiant Fiscal |
|------|--------|-----|-------------------|
| Sénégal | XOF | 18% | NINEA |
| Côte d'Ivoire | XOF | 18% | NIF/RCCM |
| Cameroun | XAF | 19.25% | NIU |
| Gabon | XAF | 18% | NIF |
| RDC | CDF | 16% | NIF |
| Maroc | MAD | 20%/10% | IF/RC |

### 5. Paiements
- **Mobile Money dominant** (Orange, MTN, Wave, Moov, Airtel)
- Champs: `mode`, `numeroTransaction`, `operateur`
- Modes: Espèces, Mobile Money, Virement, Chèque, Carte, Autre

### 6. Statuts Réservation
`Devis` → `Confirmée` → `En cours` → `Terminée` | `Annulée`

### 7. Facturation
- Niveau 1 (Simple): Récapitulatif imprimable, numérotation libre
- Champs légaux prêts: NIF établissement, NIF client, RCCM, mentions

---

## 🔑 Points d'Entrée pour l'IA

### Pour modifier l'UI:
1. Lire `src/components/[nom].js`
2. Comprendre la structure DOM
3. Modifier le rendu

### Pour modifier la logique métier:
1. Lire `src/services/[nom].js`
2. Vérifier les dépendances dans `src/data/`
3. Modifier la logique (jamais le DOM ici)

### Pour ajouter une fonctionnalité:
1. Consulter `DYNAMIC_RULES.md` pour les contraintes
2. Créer le service dans `src/services/`
3. Créer le composant dans `src/components/`
4. Importer dans `src/main.js`

---

## 🚫 Contraintes Techniques

- **Aucun appel réseau** (pas de fetch, pas d'API externe)
- **Aucune dépendance npm** (Tailwind via CDN uniquement)
- **ES Modules natifs** (`import`/`export`)
- **Vanilla JS** (pas de framework)
- **Mobile-first** (responsive Tailwind)

---

## 📝 Conventions de Code

### Commentaires "Agent-Friendly"
Chaque fichier commence par:
```javascript
// ROLE: [Description claire du rôle]
// INPUT: [Ce que le fichier/module reçoit]
// OUTPUT: [Ce qu'il produit]
// DEPENDS ON: [Dépendances externes]
```

### Séparation Stricte
- **Services:** Logique pure, tests unitaires faciles, zéro DOM
- **Components:** Rendu DOM uniquement, délègue la logique aux services
- **Utils:** Fonctions pures, déterministes, testables

---

## 🐛 Débogage

1. Ouvrir `index.html` dans un navigateur
2. Console F12 → Voir les erreurs de module
3. Vérifier `localStorage` → Application → Storage
4. Reset: `localStorage.clear()` + recharger

---

**Dernière mise à jour:** 2026-01-01  
**Version:** 1.0.0-alpha
