from pathlib import Path
import json
import io

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "cow"
IMAGE_SIZE = 224

_device = None
_model = None
_class_names = None


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


def load_model_once():
    global _model, _class_names

    if _model is not None and _class_names is not None:
        return _model, _class_names

    import torch

    device = get_device()

    class_names_path = MODEL_DIR / "cow_behavior_class_names.json"
    with open(class_names_path, "r", encoding="utf-8") as f:
        _class_names = json.load(f)

    _model = build_model(len(_class_names))
    model_path = MODEL_DIR / "cow_behavior_resnet18.pth"
    _model.load_state_dict(torch.load(model_path, map_location=device))
    _model.to(device)
    _model.eval()

    return _model, _class_names


def predict_cow_image(image_bytes: bytes):
    import torch
    from PIL import Image

    device = get_device()
    model, class_names = load_model_once()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = get_transform()(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    predicted_idx = torch.argmax(probabilities).item()
    predicted_class = class_names[predicted_idx]
    confidence = float(probabilities[predicted_idx].item())

    per_class_probs = {
        class_names[i]: float(probabilities[i].item())
        for i in range(len(class_names))
    }

    return {
        "behavior": predicted_class,
        "confidence": confidence,
        "class_probabilities": per_class_probs,
        "is_uncertain": confidence < 0.60,
    }