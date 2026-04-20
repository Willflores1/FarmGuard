import { useState } from "react";
import { submitSoilSnap } from "../api";

function SoilSnap({ styles }) {
  const [image, setImage] = useState(null);
  const [fieldTag, setFieldTag] = useState("");
  const [notes, setNotes] = useState("");
  const [texture, setTexture] = useState("");
  const [degradation, setDegradation] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    if (!fieldTag.trim()) {
      alert("Please enter a field tag.");
      return;
    }

    if (!texture) {
      alert("Please select a soil texture.");
      return;
    }

    if (!degradation) {
      alert("Please select a soil condition.");
      return;
    }

    try {
      setSubmitting(true);

      const data = await submitSoilSnap({
        image,
        fieldTag,
        notes,
        texture,
        degradation,
      });

      setResult(data.log || null);
    } catch (err) {
      console.error(err);
      alert("Submit failed. Check console or backend response.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.gridStyle}>
      <div style={styles.cardStyle}>
        <h2 style={{ marginTop: 0 }}>SoilSnap Screen</h2>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          Upload a soil image, let the model estimate moisture, and record field observations.
        </p>

        <label style={styles.labelStyle}>Soil Image</label>
        <input
          style={styles.inputStyle}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label style={styles.labelStyle}>Field Tag</label>
        <input
          style={styles.inputStyle}
          type="text"
          placeholder="e.g. Plot A"
          value={fieldTag}
          onChange={(e) => setFieldTag(e.target.value)}
        />

        <label style={styles.labelStyle}>Soil Texture</label>
        <select
          style={styles.inputStyle}
          value={texture}
          onChange={(e) => setTexture(e.target.value)}
        >
          <option value="">Select texture</option>
          <option value="sand">Sand</option>
          <option value="loam">Loam</option>
          <option value="clay">Clay</option>
          <option value="silt">Silt</option>
        </select>

        <label style={styles.labelStyle}>Soil Condition</label>
        <select
          style={styles.inputStyle}
          value={degradation}
          onChange={(e) => setDegradation(e.target.value)}
        >
          <option value="">Select condition</option>
          <option value="healthy_cover">Healthy Cover</option>
          <option value="bare_soil">Bare Soil</option>
          <option value="compacted">Compacted</option>
          <option value="crusted">Crusted</option>
          <option value="erosion_risk">Erosion Risk</option>
        </select>

        <label style={styles.labelStyle}>Notes</label>
        <textarea
          style={{ ...styles.inputStyle, minHeight: "110px", resize: "vertical" }}
          placeholder="Optional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          style={styles.buttonStyle}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Scan"}
        </button>
      </div>

      <div style={styles.cardStyle}>
        <h2 style={{ marginTop: 0 }}>Returned Result</h2>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          Shows the saved log object returned by the backend.
        </p>

        {!result ? (
          <p style={{ color: "#9ca3af" }}>
            No result yet. Submit a scan to see backend response data.
          </p>
        ) : (
          <>
            <div style={styles.resultRow}>
              <strong>Field Tag:</strong> {result.field_tag}
            </div>
            <div style={styles.resultRow}>
              <strong>Notes:</strong> {result.notes}
            </div>
            <div style={styles.resultRow}>
              <strong>Timestamp:</strong> {result.timestamp}
            </div>
            <div style={styles.resultRow}>
              <strong>Image Path:</strong> {result.image_path}
            </div>

            <hr style={{ borderColor: "#374151", margin: "18px 0" }} />

            <div style={styles.resultRow}>
              <strong>Selected Texture:</strong>{" "}
              {result.prediction?.texture_selected || "Not provided"}
            </div>
            <div style={styles.resultRow}>
              <strong>Selected Condition:</strong>{" "}
              {result.prediction?.degradation_selected || "Not provided"}
            </div>
            <div style={styles.resultRow}>
              <strong>Moisture:</strong> {result.prediction?.moisture}
            </div>

            <div style={styles.resultRow}>
              <strong>Confidence:</strong>
              <div>p_wet: {result.prediction?.confidence?.p_wet}</div>
            </div>

            <div style={styles.badgeStyle(result.is_uncertain)}>
              {result.is_uncertain ? "Uncertain Result" : "Confident Result"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SoilSnap;