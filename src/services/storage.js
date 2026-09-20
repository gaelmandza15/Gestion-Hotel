// ROLE: Gestion du stockage local (CRUD générique localStorage)
// INPUT: Clés et données
// OUTPUT: Données depuis/sur localStorage
// DEPENDS ON: Aucun (couche base niveau)

const STORAGE_PREFIX = 'gestion_hotel_'

// Obtenir une clé complète avec prefix
const getKey = (key) => `${STORAGE_PREFIX}${key}`

// Lire des données depuis localStorage
export const get = (key, defaultValue = null) => {
  try {
    const fullKey = getKey(key)
    const item = localStorage.getItem(fullKey)
    
    if (!item) {
      return defaultValue
    }
    
    return JSON.parse(item)
  } catch (error) {
    console.error(`Erreur lecture localStorage [${key}]:`, error)
    return defaultValue
  }
}

// Écrire des données dans localStorage
export const set = (key, value) => {
  try {
    const fullKey = getKey(key)
    localStorage.setItem(fullKey, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Erreur écriture localStorage [${key}]:`, error)
    return false
  }
}

// Supprimer des données de localStorage
export const remove = (key) => {
  try {
    const fullKey = getKey(key)
    localStorage.removeItem(fullKey)
    return true
  } catch (error) {
    console.error(`Erreur suppression localStorage [${key}]:`, error)
    return false
  }
}

// Vider tout le storage
export const clear = () => {
  try {
    // Seulement nos clés avec prefix
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
    return true
  } catch (error) {
    console.error('Erreur vidage localStorage:', error)
    return false
  }
}

// Vérifier si une clé existe
export const exists = (key) => {
  const fullKey = getKey(key)
  return localStorage.getItem(fullKey) !== null
}

// Obtenir toutes les clés
export const getAllKeys = () => {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keys.push(key.replace(STORAGE_PREFIX, ''))
    }
  }
  return keys
}

// Export pour initialisation avec mock data
export const initializeWithMockData = (mockData) => {
  try {
    for (const [key, value] of Object.entries(mockData)) {
      const fullKey = getKey(key)
      if (!localStorage.getItem(fullKey)) {
        localStorage.setItem(fullKey, JSON.stringify(value))
      }
    }
    return true
  } catch (error) {
    console.error('Erreur initialisation mock data:', error)
    return false
  }
}

// Obtenir la taille utilisée (en octets)
export const getSize = () => {
  let totalSize = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const value = localStorage.getItem(key)
      totalSize += (key.length + value.length) * 2 // UTF-16
    }
  }
  return totalSize
}

// Obtenir la limite approximative (5MB typiquement)
export const getLimit = () => {
  try {
    localStorage.setItem('__test__', new Array(5000000).fill('a').join(''))
    localStorage.removeItem('__test__')
    return 5000000 // 5MB
  } catch (e) {
    return 2500000 // Fallback 2.5MB
  }
}

// Vérifier l'espace restant
export const getRemainingSpace = () => {
  return Math.max(0, getLimit() - getSize())
}

// Backup complet des données
export const backup = () => {
  try {
    const backup = {}
    const keys = getAllKeys()
    
    for (const key of keys) {
      backup[key] = get(key)
    }
    
    return {
      success: true,
      data: backup,
      timestamp: new Date().toISOString(),
      size: getSize()
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Restore complet des données
export const restore = (backupData) => {
  try {
    if (!backupData || typeof backupData !== 'object') {
      return { success: false, error: 'Données de backup invalides' }
    }
    
    for (const [key, value] of Object.entries(backupData)) {
      set(key, value)
    }
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Exporter en JSON téléchargeable
export const exportToFile = (filename = 'backup_gestion_hotel.json') => {
  const backup = backupAll()
  
  if (!backup.success) {
    return backup
  }
  
  const blob = new Blob([JSON.stringify(backup.data, null, 2)], { 
    type: 'application/json' 
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  
  return { success: true }
}

// Importer depuis un fichier JSON
export const importFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        const result = restore(data)
        resolve(result)
      } catch (error) {
        reject({ success: false, error: 'Fichier JSON invalide' })
      }
    }
    
    reader.onerror = () => {
      reject({ success: false, error: 'Erreur de lecture du fichier' })
    }
    
    reader.readAsText(file)
  })
}
