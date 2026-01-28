import React from 'react';
import Assistant from './components/Assistant';

const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0f',
        color: '#ffffff',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div>
        <Assistant
          message="Привет! ✨ Я Вспышка. Приложение успешно запущено 🚀"
          avatarUrl=""
          side="center"
        />

        <p
          style={{
            marginTop: 24,
            opacity: 0.7,
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Временный режим.<br />
          Идёт настройка системы 🛠
        </p>
      </div>
    </div>
  );
};

export default App;
