# 🤖 AI_MAP.md - Guide de Contexte pour l'IA

> **⚠️ LIRE CE FICHIER EN PREMIER À CHAQUE SESSION**

Ce fichier contient le contexte nécessaire pour travailler sur ce projet sans gaspiller de tokens.

---

## 🎯 En Une Phrase

Application de **gestion hôtelière hors-ligne** pour l'Afrique francophone, en **Vanilla JS + Tailwind**, avec stockage **localStorage**.

---

## 📁 Structure (5 Fichiers Principaux)

```
index.html              # Point d'entrée (importe main.js)
src/main.js            # Initialisation + orchestration
src/services/          # Logique métier (5 fichiers)
src/components/        # Rendu UI (4 fichiers + modals)
src/data/              # Configurations (2 fichiers)
src/utils/             # Utilitaires (3 fichiers)
```

---

## 🔑 Règles d'Or (À Respecter Strictement)

### 1. JAMAIS de Réseau
```javascript
// ❌ INTERDIT
fetch('/api/...')
axios.get(...)
XMLHttpRequest

// ✅ AUTORISÉ
localStorage.getItem('reservations')
```

### 2. FCFA = Zéro Décimale
```javascript
// ❌ INTERDIT
format(5000.00)  // "5 000,00 FCFA"

// ✅ AUTORISÉ
formatCurrency(5000, 'XAF')  // "5 000 FCFA"
```

### 3. Téléphone Obligatoire
```javascript
// Client schema
{
  nom: "Jean Kouassi",
  telephone: "+225 07 07 07 07",  // OBLIGATOIRE
  email: "optionnel@email.com"     // OPTIONNEL
}
```

### 4. Séparation Stricte
```
services/     → Logique pure, tests faciles, ZÉRO DOM
components/   → DOM uniquement, délègue aux services
utils/        → Fonctions pures
```

### 5. ES Modules Uniquement
```javascript
// Toujours utiliser
import { getReservations } from './services/reservations.js'
export function createReservation(data) { ... }
```

---

## 🧠 Cerveau Central (Fichiers à Connaître)

| Fichier | Rôle | Quand le Modifier |
|---------|------|-------------------|
| `DYNAMIC_RULES.md` | Toutes les règles métier configurables | Pour ajouter un pays, un mode de paiement |
| `PROJECT_MAP.md` | Architecture du projet | Rarement (seulement si nouvelle feature majeure) |
| `src/data/countries.js` | Configs par pays (TVA, devise) | Pour ajouter/modifier un pays |
| `src/services/storage.js` | CRUD localStorage | Pour changer le schéma de données |

---

## 🛠️ Tâches Courantes et Fichiers Associés

### Ajouter une réservation
1. `src/components/modals/NewReservationModal.js` (UI)
2. `src/services/reservations.js` (logique)
3. `src/services/clients.js` (si nouveau client)

### Modifier affichage tableau
1. `src/components/reservationsTable.js` (rendu)
2. `src/utils/currency.js` (formatage prix)
3. `src/utils/dates.js` (formatage dates)

### Ajouter un moyen de paiement
1. `DYNAMIC_RULES.md` section 3 (définition)
2. `src/data/countries.js` (si spécifique pays)
3. `src/services/billing.js` (intégration)

### Changer taux TVA
1. `src/data/countries.js` (taux par pays)
2. `src/services/settings.js` (paramètres établissement)

---

## 🐛 Débogage Rapide

### Erreur de module
```
Erreur: Cannot use import statement outside a module
→ Vérifier: <script type="module" src="src/main.js">
```

### localStorage vide
```javascript
// Reset complet
localStorage.clear()
// Recharger la page → mockData sera chargé
```

### Données corrompues
```javascript
// Voir le contenu
console.log(JSON.parse(localStorage.getItem('reservations')))

// Supprimer une clé
localStorage.removeItem('reservations')
```

---

## 📝 Convention de Commentaires

Chaque fichier DOIT commencer par:
```javascript
// ROLE: [Description en 1 phrase]
// INPUT: [Ce qui entre]
// OUTPUT: [Ce qui sort]
// DEPENDS ON: [Dépendances]
```

Exemple réel:
```javascript
// ROLE: Gestion des réservations (CRUD + statuts)
// INPUT: Objets réservation depuis components/
// OUTPUT: Réservations sauvegardées dans localStorage
// DEPENDS ON: storage.js, clients.js
```

---

## 🚀 Workflow Type avec l'IA

### Session 1: Créer nouvelle feature
```
1. Donner AI_MAP.md en contexte
2. Décrire la feature
3. L'IA identifie les fichiers à modifier
4. Tester dans navigateur
5. Commit
```

### Session 2: Corriger bug
```
1. Donner AI_MAP.md + fichier buggy
2. Décrire le bug
3. L'IA corrige uniquement le fichier cible
4. Tester
5. Commit
```

### Session 3: Ajouter pays
```
1. Ouvrir DYNAMIC_RULES.md
2. Copier template pays existant
3. Modifier valeurs
4. Tester sélection pays
```

---

## ⚡ Astuces Tokens

### ✅ BON (Peu de tokens)
```
Contexte: AI_MAP.md (500 tokens)
Fichier cible: src/services/reservations.js (200 tokens)
Dépendance: src/services/storage.js (150 tokens)
Total: 850 tokens
```

### ❌ MAUVAIS (Trop de tokens)
```
Contexte: Tout le projet (5000+ tokens)
Historique: 10 messages précédents (2000 tokens)
Total: 7000+ tokens
```

### 🎯 MEILLEUR PRATIQUE
```
1. Reset chat entre chaque tâche
2. Donner uniquement: AI_MAP.md + 2-3 fichiers max
3. Si besoin de plus → sous-task séparée
```

---

## 🔒 Secrets et Sécurité

- **Aucun secret** dans le code (app 100% locale)
- **Pas d'API keys** (pas de connexion internet)
- **Données sensibles** dans localStorage (chiffrement futur si besoin)

---

## 📞 Support Mental

Si l'IA semble "perdue":
1. Lui redonner AI_MAP.md
2. Lui demander de lire PROJECT_MAP.md
3. Lui faire identifier LE fichier à modifier
4. Ne jamais lui donner tout le code d'un coup

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-01-01  
**Prochain review:** Après première session de dev
