from fastapi import APIRouter, UploadFile, File, Form

from backend.app.services.soil_service import predict_soil_image
from backend.app.services.storage_service import upload_image_bytes
from backend.app.services.firestore_service import save_log

router = APIRouter()


@router.post("/soil-snap")
async def soil_snap(
    image: UploadFile = File(...),
    field_tag: str = Form(""),
    notes: str = Form(""),
    texture_selected: str = Form(""),
    degradation_selected: str = Form(""),
):
    image_bytes = await image.read()

    ext = "jpg"
    if image.filename and "." in image.filename:
        ext = image.filename.rsplit(".", 1)[-1].lower()

    image_path = upload_image_bytes(
        image_bytes=image_bytes,
        folder="soil",
        extension=ext,
        content_type=image.content_type or "image/jpeg",
    )

    prediction = predict_soil_image(image_bytes)
    prediction["texture_selected"] = texture_selected
    prediction["degradation_selected"] = degradation_selected

    log = save_log(
        feature="soil",
        field_tag=field_tag,
        notes=notes,
        image_path=image_path,
        prediction=prediction,
    )

    return {"log": log}