import fs from 'fs'
import path from 'path'

// Путь к файлу для хранения данных
const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'app-data.json')

export interface PersistedData {
  spawnPoints: any[]
  userInventory: any[]
  userCards: any[]
  userProfiles: any[]
  lastSaved: string
}

/**
 * Создает директорию data если не существует
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    console.log('📁 Создана директория:', DATA_DIR)
  }
}

/**
 * Загружает данные из файла
 */
export function loadPersistedData(): PersistedData | null {
  try {
    ensureDataDir()
    
    if (!fs.existsSync(DATA_FILE)) {
      console.log('⚠️ Файл данных не найден, создаем новый')
      return null
    }

    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)
    
    console.log('✅ Данные загружены из файла:', {
      spawnPoints: data.spawnPoints?.length || 0,
      userInventory: data.userInventory?.length || 0,
      userCards: data.userCards?.length || 0,
      userProfiles: data.userProfiles?.length || 0,
      lastSaved: data.lastSaved
    })
    
    return data
  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error)
    return null
  }
}

/**
 * Сохраняет данные в файл
 */
export function savePersistedData(data: PersistedData): boolean {
  try {
    ensureDataDir()
    
    const dataToSave = {
      ...data,
      lastSaved: new Date().toISOString()
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8')
    
    console.log('💾 Данные сохранены в файл:', {
      spawnPoints: data.spawnPoints.length,
      userInventory: data.userInventory.length,
      userCards: data.userCards.length,
      userProfiles: data.userProfiles.length
    })
    
    return true
  } catch (error) {
    console.error('❌ Ошибка сохранения данных:', error)
    return false
  }
}

/**
 * Автосохранение каждые N минут
 */
let autoSaveInterval: NodeJS.Timeout | null = null

export function startAutoSave(getData: () => PersistedData, intervalMinutes = 5) {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }
  
  autoSaveInterval = setInterval(() => {
    const data = getData()
    savePersistedData(data)
    console.log('🔄 Автосохранение выполнено')
  }, intervalMinutes * 60 * 1000)
  
  console.log(`⏰ Автосохранение запущено (каждые ${intervalMinutes} минут)`)
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
    autoSaveInterval = null
    console.log('⏹️ Автосохранение остановлено')
  }
}
