import os
import uuid

from google.cloud import storage

BUCKET_NAME = os.environ.get("BUCKET_NAME", "pacific-droplet-457300-p6-farmguard-images")


def upload_image_bytes(
    image_bytes: bytes,
    folder: str,
    extension: str = "jpg",
    content_type: str = "image/jpeg",
):
    if not BUCKET_NAME:
        raise ValueError("BUCKET_NAME environment variable is not set.")

    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)

    blob_name = f"{folder}/{uuid.uuid4()}.{extension}"
    blob = bucket.blob(blob_name)
    blob.upload_from_string(image_bytes, content_type=content_type)

    return f"gs://{BUCKET_NAME}/{blob_name}"