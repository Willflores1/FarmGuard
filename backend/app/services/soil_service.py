from pathlib import Path
import io

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "soil"
MODEL_PATH = MODEL_DIR / "soil_moisture_binary.keras"

_model = None


def load_model_once():
    global _model
    if _model is None:
        import tensorflow as tf
        _model = tf.keras.models.load_model(MODEL_PATH)
    return _model


def predict_soil_image(image_bytes: bytes):
    import numpy as np
    from PIL import Image

    model = load_model_once()

    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))

    x = np.array(img, dtype=np.float32)
    x = (x / 127.5) - 1.0
    x = np.expand_dims(x, axis=0)

    p_wet = float(model.predict(x, verbose=0)[0][0])

    WET_TH = 0.85
    DRY_TH = 0.15

    if p_wet >= WET_TH:
        moisture = "wet"
        is_uncertain = False
        next_step = "avoid_compaction_risk / consider waiting"
    elif p_wet <= DRY_TH:
        moisture = "not_wet"
        is_uncertain = False
        next_step = "ok_to_proceed / log_and_monitor"
    else:
        moisture = "uncertain"
        is_uncertain = True
        next_step = "retake_photo_or_take_measurement"

    return {
        "texture_proxy": "tbd",
        "moisture": moisture,
        "degradation": "tbd",
        "confidence": {
            "p_wet": p_wet
        },
        "is_uncertain": is_uncertain,
        "next_step": next_step,
    }