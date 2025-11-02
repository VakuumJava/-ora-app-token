import React from 'react';

const MintIntegrationInstruction: React.FC = () => (
  <main style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Inter, Arial, sans-serif', padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0001' }}>
    <h1 style={{ fontSize: 32, marginBottom: 16 }}>Инструкция по рабочему минту NFT на TON</h1>
    <ol style={{ fontSize: 18, lineHeight: 1.7 }}>
      <li>
        <b>Создайте свою NFT коллекцию на TON:</b><br />
        <span style={{ color: '#555' }}>
          Для полноценного рабочего минта NFT через сайт нужна коллекция, развернутая вручную.<br />
          <b>Варианты:</b> <br />
          — <b>Getgems.io</b> (минт только через их UI)<br />
          — <b>Ручной деплой через toncli/blueprint</b> (минт через ваш сайт)
        </span>
      </li>
      <li>
        <b>Ручной деплой коллекции (рекомендуется для сайта):</b><br />
        <span style={{ color: '#555' }}>
          1. Скачайте <a href="https://github.com/ton-community/blueprint" target="_blank" rel="noopener noreferrer">TON Blueprint</a> или <a href="https://github.com/ton-core/toncli" target="_blank" rel="noopener noreferrer">toncli</a>.<br />
          2. Скомпилируйте и задеплойте стандартный контракт NFT Collection.<br />
          3. Получите адрес коллекции и добавьте его в Railway переменную <code>NEXT_PUBLIC_TON_COLLECTION_ADDRESS</code>.<br />
          4. После этого минт через ваш сайт будет работать.
        </span>
      </li>
      <li>
        <b>Если используете Getgems:</b><br />
        <span style={{ color: '#555' }}>
          Минт NFT возможен только через интерфейс Getgems, не через ваш сайт.<br />
          Для интеграции минта через API — нужен контракт, развернутый вами вручную.
        </span>
      </li>
      <li>
        <b>Проверьте минт:</b><br />
        <span style={{ color: '#555' }}>
          После деплоя коллекции и обновления переменной — минт через сайт будет работать, NFT появится в кошельке и на Getgems.
        </span>
      </li>
      <li>
        <b>Ресурсы:</b><br />
        <ul>
          <li><a href="https://github.com/ton-community/blueprint" target="_blank" rel="noopener noreferrer">TON Blueprint (GitHub)</a></li>
          <li><a href="https://github.com/ton-core/toncli" target="_blank" rel="noopener noreferrer">toncli (GitHub)</a></li>
          <li><a href="https://getgems.io/" target="_blank" rel="noopener noreferrer">Getgems Marketplace</a></li>
        </ul>
      </li>
    </ol>
    <hr style={{ margin: '32px 0' }} />
    <div style={{ fontSize: 16, color: '#888' }}>
      Если нужна помощь с деплоем или интеграцией — напишите в Telegram: <a href="https://t.me/tondev" target="_blank" rel="noopener noreferrer">@tondev</a>
    </div>
  </main>
);

export default MintIntegrationInstruction;
