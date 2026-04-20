import { useState } from "react";
import { getLogs } from "../api";

function Logs({ styles }) {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [feature, setFeature] = useState("");

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await getLogs(25, feature);
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load logs.");
    } finally {
      setLoadingLogs(false);
    }
  };

  const renderPrediction = (log) => {
    const p = log.prediction || {};

if (log.feature === "soil") {
  return (
    <>
      <div style={styles.resultRow}>
        <strong>Selected Texture:</strong> {p.texture_selected || "Not provided"}
      </div>
      <div style={styles.resultRow}>
        <strong>Selected Condition:</strong> {p.degradation_selected || "Not provided"}
      </div>
      <div style={styles.resultRow}>
        <strong>Moisture:</strong> {p.moisture}
      </div>
      <div style={styles.resultRow}>
        <strong>p_wet:</strong> {p.confidence?.p_wet}
      </div>
    </>
  );
}

  if (log.feature === "crop_screening") {
    return (
    <>
        <div style={styles.resultRow}><strong>Crop:</strong> {p.crop}</div>
        <div style={styles.resultRow}><strong>Disease:</strong> {p.disease}</div>
        <div style={styles.resultRow}><strong>Confidence:</strong> {p.confidence}</div>
      </>
    );
  }

    if (log.feature === "cow_behavior") {
      return (
        <>
          <div style={styles.resultRow}><strong>Behavior:</strong> {p.behavior}</div>
          <div style={styles.resultRow}><strong>Confidence:</strong> {p.confidence}</div>
        </>
      );
    }

    return <div style={styles.resultRow}><strong>Prediction:</strong> {JSON.stringify(p)}</div>;
  };

  return (
    <div style={{ ...styles.cardStyle, width: "100%", maxWidth: "1100px" }}>
      <h2 style={{ marginTop: 0 }}>Logs Screen</h2>
      <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
        View recent saved entries from all FarmGuard features.
      </p>

      <label style={styles.labelStyle}>Filter by Feature</label>
      <select
        style={styles.inputStyle}
        value={feature}
        onChange={(e) => setFeature(e.target.value)}
      >
        <option value="">All</option>
        <option value="soil">Soil</option>
        <option value="crop_screening">Crop Screening</option>
        <option value="cow_behavior">Cow Behaviour</option>
      </select>

      <button
        style={styles.secondaryButtonStyle}
        onClick={fetchLogs}
        disabled={loadingLogs}
      >
        {loadingLogs ? "Loading Logs..." : "Refresh Logs"}
      </button>

      {logs.length === 0 ? (
        <p style={{ color: "#9ca3af", marginTop: "20px" }}>
          No logs loaded yet.
        </p>
      ) : (
        logs.map((log, index) => (
          <div key={log.id || index} style={styles.logCardStyle}>
            <div style={styles.resultRow}><strong>ID:</strong> {log.id || "No ID"}</div>
            <div style={styles.resultRow}><strong>Feature:</strong> {log.feature || "unknown"}</div>
            <div style={styles.resultRow}><strong>Field Tag:</strong> {log.field_tag}</div>
            <div style={styles.resultRow}><strong>Timestamp:</strong> {log.timestamp}</div>
            <div style={styles.resultRow}><strong>Notes:</strong> {log.notes}</div>
            {renderPrediction(log)}
            <div style={styles.resultRow}>
              <strong>Status:</strong> {log.is_uncertain ? "Uncertain" : "Confident"}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Logs;