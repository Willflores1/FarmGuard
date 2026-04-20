import { useState } from "react";
import { submitCropScreen } from "../api";

function CropScreen({ styles }) {
  const [image, setImage] = useState(null);
  const [fieldTag, setFieldTag] = useState("");
  const [notes, setNotes] = useState("");
  const [cropSelected, setCropSelected] = useState("potato");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload a crop image first.");
      return;
    }

    if (!fieldTag.trim()) {
      alert("Please enter a field tag.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await submitCropScreen({
        image,
        fieldTag,
        notes,
        cropSelected,
      });
      setResult(data.log || null);
    } catch (err) {
      console.error(err);
      alert("Crop screening failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.gridStyle}>
      <div style={styles.cardStyle}>
        <h2 style={{ marginTop: 0 }}>Crop Screening</h2>
        <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
          Upload a crop image to detect likely disease.
        </p>

        <label style={styles.labelStyle}>Crop Type</label>
        <select
          style={styles.inputStyle}
          value={cropSelected}
          onChange={(e) => setCropSelected(e.target.value)}
        >
          <option value="potato">Potato</option>
          <option value="bell_pepper">Bell Pepper</option>
        </select>

        <label style={styles.labelStyle}>Plant Image</label>
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
          placeholder="e.g. Plot B"
          value={fieldTag}
          onChange={(e) => setFieldTag(e.target.value)}
        />

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
          {submitting ? "Submitting..." : "Analyze Crop"}
        </button>
      </div>

      <div style={styles.cardStyle}>
        <h2 style={{ marginTop: 0 }}>Returned Result</h2>

        {!result ? (
          <p style={{ color: "#9ca3af" }}>
            No result yet. Submit a crop image to see prediction data.
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
              <strong>Crop:</strong> {result.prediction?.crop}
            </div>
            <div style={styles.resultRow}>
              <strong>Disease:</strong> {result.prediction?.disease}
            </div>
            <div style={styles.resultRow}>
              <strong>Confidence:</strong> {result.prediction?.confidence}
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

export default CropScreen;