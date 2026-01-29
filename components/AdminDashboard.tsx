import React from "react";

type Props = {
  leads?: any[];
  onUpdateStatus?: (...args: any[]) => void;
  onBack?: () => void;
  isSuperAdmin?: boolean;
  adminList?: number[];
  onAddAdmin?: (id: number) => void;
  onRemoveAdmin?: (id: number) => void;
};

export const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h2 style={{ marginBottom: 12 }}>AdminDashboard (temporary)</h2>
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
