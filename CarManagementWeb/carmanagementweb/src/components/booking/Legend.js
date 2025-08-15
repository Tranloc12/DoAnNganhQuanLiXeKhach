import React from "react";

const legendData = [
  { color: "#339AF4", label: "Ghế trống" },
  { color: "#EF5222", label: "Ghế đang chọn" },
  { color: "#A2ABB3", label: "Ghế đã bán" },
];

const Legend = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    flexWrap: "wrap",
    padding: "8px 0"
  }}>
    {legendData.map((item, idx) => (
      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-block",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: item.color,
            border: "2px solid #e0e0e0",
            marginRight: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.07)"
          }}
        />
        <span style={{ fontWeight: 600, color: "#444", fontSize: 15 }}>{item.label}</span>
      </div>
    ))}
  </div>
);

export default Legend;