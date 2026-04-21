export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function handleResponse(res, label) {
  if (!res.ok) {
    let message = `${label} request failed with status ${res.status}`;

    try {
      const errorData = await res.json();
      if (errorData?.detail) {
        message += `: ${errorData.detail}`;
      }
    } catch {
      // ignore JSON parse errors and keep default message
    }

    throw new Error(message);
  }

  return res.json();
}

export async function submitSoilSnap({
  image,
  fieldTag,
  notes,
  texture,
  degradation,
}) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("field_tag", fieldTag);
  formData.append("notes", notes);
  formData.append("texture_selected", texture);
  formData.append("degradation_selected", degradation);

  const res = await fetch(`${API_BASE_URL}/soil-snap`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res, "Soil");
}

export async function submitCropScreen({
  image,
  fieldTag,
  notes,
  cropSelected,
}) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("field_tag", fieldTag);
  formData.append("notes", notes);
  formData.append("crop_selected", cropSelected);

  const res = await fetch(`${API_BASE_URL}/crop-screen`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res, "Crop");
}

export async function submitCowBehavior({ image, fieldTag, notes }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("field_tag", fieldTag);
  formData.append("notes", notes);

  const res = await fetch(`${API_BASE_URL}/cow-behavior`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res, "Cow");
}

export async function getLogs(limit = 25, feature = "") {
  const params = new URLSearchParams({ limit: String(limit) });
  if (feature) params.append("feature", feature);

  const res = await fetch(`${API_BASE_URL}/logs?${params.toString()}`);
  return handleResponse(res, "Logs");
}