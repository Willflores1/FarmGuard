from pathlib import Path
import json
import io

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "crop"
IMAGE_SIZE = 224

_device = None
_loaded_models = {}


def get_device():
    global _device
    if _device is None:
        import torch
        _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return _device


def build_model(num_classes: int):
    from torchvision import models
    import torch.nn as nn

    model = models.resnet18(weights=None)
    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)
    return model


def get_transform():
    from torchvision import transforms

    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
    ])


def get_crop_assets(crop_name: str):
    if crop_name == "potato":
        return {
            "model_path": MODEL_DIR / "potato_disease_resnet18.pth",
            "class_names_path": MODEL_DIR / "potato_class_names.json",
            "display_crop": "potato",
        }

    if crop_name == "bell_pepper":
        return {
            "model_path": MODEL_DIR / "pepper_disease_resnet18_v2.pth",
            "class_names_path": MODEL_DIR / "pepper_class_names.json",
            "display_crop": "bell pepper",
        }

    raise ValueError(f"Unsupported crop: {crop_name}")


def load_model_once(crop_name: str):
    global _loaded_models

    if crop_name in _loaded_models:
        return _loaded_models[crop_name]

    import torch

    device = get_device()
    assets = get_crop_assets(crop_name)

    with open(assets["class_names_path"], "r", encoding="utf-8") as f:
        class_names = json.load(f)

    model = build_model(len(class_names))
    model.load_state_dict(torch.load(assets["model_path"], map_location=device))
    model.to(device)
    model.eval()

    _loaded_models[crop_name] = (model, class_names, assets["display_crop"])
    return _loaded_models[crop_name]


def clean_label(label: str):
    return (
        label.replace("___", " - ")
        .replace("__", " ")
        .replace("_", " ")
        .replace(",", "")
        .strip()
    )


def predict_crop_image(image_bytes: bytes, crop_name: str):
    import torch
    from PIL import Image

    device = get_device()
    model, class_names, display_crop = load_model_once(crop_name)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = get_transform()(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    predicted_idx = torch.argmax(probabilities).item()
    raw_class = class_names[predicted_idx]
    confidence = float(probabilities[predicted_idx].item())

    per_class_probs = {
        clean_label(class_names[i]): float(probabilities[i].item())
        for i in range(len(class_names))
    }

    return {
        "crop": display_crop,
        "crop_selected": crop_name,
        "disease": clean_label(raw_class),
        "raw_class": raw_class,
        "confidence": confidence,
        "class_probabilities": per_class_probs,
        "is_uncertain": confidence < 0.60,
    }