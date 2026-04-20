from fastapi import APIRouter, UploadFile, File, Form

from backend.app.services.cow_service import predict_cow_image
from backend.app.services.storage_service import upload_image_bytes
from backend.app.services.firestore_service import save_log

router = APIRouter()


@router.post("/cow-behavior")
async def cow_behavior(
    image: UploadFile = File(...),
    field_tag: str = Form(""),
    notes: str = Form("")
):
    image_bytes = await image.read()

    ext = "jpg"
    if image.filename and "." in image.filename:
        ext = image.filename.rsplit(".", 1)[-1].lower()

    image_path = upload_image_bytes(
        image_bytes=image_bytes,
        folder="cow",
        extension=ext,
        content_type=image.content_type or "image/jpeg",
    )

    prediction = predict_cow_image(image_bytes)

    log = save_log(
        feature="cow_behavior",
        field_tag=field_tag,
        notes=notes,
        image_path=image_path,
        prediction=prediction,
    )

    return {"log": log}