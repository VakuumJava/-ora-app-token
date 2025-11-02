"use client"

import { useEffect } from "react"

export default function MapTestPage() {
  useEffect(() => {
    
    
    
    
    // Test Yandex Maps script loading
    const script = document.createElement('script')
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
    script.async = true
    
    script.onload = () => {
      
      
    }
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Yandex Maps script:', error)
    }
    
    document.head.appendChild(script)
    
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
        
      }
    }
  }, [])
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'black', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>🧪 Map Test Page</h1>
      <p style={{ marginBottom: '10px' }}>Откройте консоль разработчика (F12)</p>
      <p style={{ marginBottom: '10px' }}>Вы должны увидеть логи:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>✅ MapTestPage mounted</li>
        <li>✅ Yandex Maps script loaded</li>
        <li>✅ window.ymaps available</li>
      </ul>
      <div style={{ marginTop: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#888' }}>
          URL для теста: /map-test
        </p>
      </div>
    </div>
  )
}
