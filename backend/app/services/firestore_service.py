import os
import datetime

from google.cloud import firestore

COLLECTION = os.environ.get("FIRESTORE_COLLECTION", "farmguard_logs")


def save_log(feature: str, field_tag: str, notes: str, image_path: str, prediction: dict):
    db = firestore.Client()

    doc = {
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "feature": feature,
        "field_tag": field_tag,
        "notes": notes,
        "image_path": image_path,
        "prediction": prediction,
        "is_uncertain": prediction.get("is_uncertain", False),
    }

    db.collection(COLLECTION).add(doc)
    return doc


def fetch_logs(limit: int = 25, feature: str | None = None):
    db = firestore.Client()

    query = db.collection(COLLECTION)

    if feature:
        query = query.where("feature", "==", feature)

    docs = (
        query.order_by("timestamp", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )

    out = []
    for d in docs:
        item = d.to_dict()
        item["id"] = d.id
        out.append(item)

    return out