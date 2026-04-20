import { useState } from "react";
import SoilSnap from "./components/SoilSnap";
import Logs from "./components/Logs";
import CropScreen from "./components/CropScreen";
import CowBehavior from "./components/CowBehavior";

function App() {
  const [activeTab, setActiveTab] = useState("soilsnap");

  const styles = {
    pageStyle: {
      minHeight: "100vh",
      background: "#111827",
      color: "#f9fafb",
      fontFamily: "Arial, sans-serif",
      padding: "32px",
    },
    containerStyle: {
      width: "100%",
      maxWidth: "1500px",
      margin: "0 auto",
    },
    tabRowStyle: {
      display: "flex",
      gap: "12px",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    tabButton: (active) => ({
      padding: "12px 18px",
      borderRadius: "10px",
      border: active ? "1px solid #10b981" : "1px solid #374151",
      background: active ? "#10b981" : "#1f2937",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
    }),
    cardStyle: {
      background: "#1f2937",
      border: "1px solid #374151",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    },
    gridStyle: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      width: "100%",
    },
    inputStyle: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #4b5563",
      background: "#111827",
      color: "#fff",
      marginTop: "8px",
      marginBottom: "16px",
      boxSizing: "border-box",
    },
    labelStyle: {
      fontWeight: "600",
      color: "#d1d5db",
    },
    buttonStyle: {
      padding: "12px 18px",
      borderRadius: "10px",
      border: "none",
      background: "#10b981",
      color: "#fff",
      fontWeight: "700",
      cursor: "pointer",
    },
    secondaryButtonStyle: {
      padding: "12px 18px",
      borderRadius: "10px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      fontWeight: "700",
      cursor: "pointer",
    },
    resultRow: {
      marginBottom: "10px",
      lineHeight: "1.5",
    },
    badgeStyle: (uncertain) => ({
      display: "inline-block",
      marginTop: "12px",
      padding: "8px 12px",
      borderRadius: "999px",
      background: uncertain ? "#92400e" : "#065f46",
      color: "#fff",
      fontWeight: "700",
      fontSize: "14px",
    }),
    logCardStyle: {
      background: "#111827",
      border: "1px solid #374151",
      borderRadius: "14px",
      padding: "16px",
      marginTop: "14px",
    },
  };

  return (
    <div style={styles.pageStyle}>
      <div style={styles.containerStyle}>
        <h1 style={{ fontSize: "42px", marginBottom: "8px" }}>FarmGuard UI</h1>
        <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
          Soil, crop, and livestock monitoring dashboard
        </p>

        <div style={styles.tabRowStyle}>
          <button
            style={styles.tabButton(activeTab === "soilsnap")}
            onClick={() => setActiveTab("soilsnap")}
          >
            SoilSnap
          </button>

          <button
            style={styles.tabButton(activeTab === "crop")}
            onClick={() => setActiveTab("crop")}
          >
            Crop Screening
          </button>

          <button
            style={styles.tabButton(activeTab === "cow")}
            onClick={() => setActiveTab("cow")}
          >
            Cow Behaviour
          </button>

          <button
            style={styles.tabButton(activeTab === "logs")}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </button>
        </div>

        {activeTab === "soilsnap" && <SoilSnap styles={styles} />}
        {activeTab === "crop" && <CropScreen styles={styles} />}
        {activeTab === "cow" && <CowBehavior styles={styles} />}
        {activeTab === "logs" && <Logs styles={styles} />}
      </div>
    </div>
  );
}

export default App;