import React from "react";

type Props = {
  leads?: any[];
  onBack?: () => void;
};

export const Profile: React.FC<Props> = ({ onBack }) => {
  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h2 style={{ marginBottom: 12 }}>Profile (temporary)</h2>
      <p style={{ opacity: 0.7 }}>
        Это временная заглушка, чтобы сборка прошла. Позже вернём настоящий компонент.
      </p>
      <button
        onClick={onBack}
        style={{ marginTop: 16, padding: "10px 14px", cursor: "pointer" }}
      >
        Назад
      </button>
    </div>
  );
};
