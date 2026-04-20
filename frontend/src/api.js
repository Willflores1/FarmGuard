export const API_BASE_URL = "http://127.0.0.1:8000";

export async function submitSoilSnap({ image, fieldTag, notes, texture, degradation }) {
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

  if (!res.ok) {
    throw new Error(`Soil request failed with status ${res.status}`);
  }

  return res.json();
}

export async function submitCropScreen({ image, fieldTag, notes, cropSelected }) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("field_tag", fieldTag);
  formData.append("notes", notes);
  formData.append("crop_selected", cropSelected);

  const res = await fetch(`${API_BASE_URL}/crop-screen`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Crop request failed with status ${res.status}`);
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error(`Cow request failed with status ${res.status}`);
  }

  return res.json();
}

export async function getLogs(limit = 25, feature = "") {
  const url = feature
    ? `${API_BASE_URL}/logs?limit=${limit}&feature=${feature}`
    : `${API_BASE_URL}/logs?limit=${limit}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Logs request failed with status ${res.status}`);
  }

  return res.json();
}