import React from "react";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const baseBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  fontWeight: 800,
  cursor: "pointer",
};

export const PrimaryButton: React.FC<BtnProps> = ({ children, style, ...props }) => (
  <button
    {...props}
    style={{
      ...baseBtn,
      background: "#37d9ff",
      color: "#0b0b0f",
      border: "none",
      ...style,
      opacity: props.disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

export const SecondaryButton: React.FC<BtnProps> = ({ children, style, ...props }) => (
  <button
    {...props}
    style={{
      ...baseBtn,
      background: "transparent",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.2)",
      ...style,
      opacity: props.disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

export const WarmButton: React.FC<BtnProps> = ({ children, style, ...props }) => (
  <button
    {...props}
    style={{
      ...baseBtn,
      background: "rgba(255,79,216,0.15)",
      color: "#fff",
      border: "1px solid rgba(255,79,216,0.35)",
      ...style,
      opacity: props.disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

export const Card: React.FC<{ selected?: boolean; onClick?: () => void; children: React.ReactNode }> = ({
  selected,
  onClick,
  children,
}) => (
  <div
    onClick={onClick}
    style={{
      padding: 16,
      borderRadius: 20,
      border: selected ? "2px solid #37d9ff" : "1px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.03)",
      cursor: onClick ? "pointer" : "default",
    }}
  >
    {children}
  </div>
);

export const Input: React.FC<{
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}> = ({ label, value, onChange, placeholder, required, type }) => (
  <label style={{ display: "block" }}>
    {label && (
      <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.7 }}>
        {label} {required ? "*" : ""}
      </div>
    )}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      type={type || "text"}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        outline: "none",
      }}
    />
  </label>
);

export const BottomBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 16,
      background: "rgba(11,11,15,0.85)",
      backdropFilter: "blur(10px)",
    }}
  >
    <div style={{ maxWidth: 520, margin: "0 auto" }}>{children}</div>
  </div>
);
