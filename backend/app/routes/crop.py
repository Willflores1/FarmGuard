from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.crop_service import predict_crop_image
from app.services.storage_service import upload_image_bytes
from app.services.firestore_service import save_log

router = APIRouter()


@router.post("/crop-screen")
async def crop_screen(
    image: UploadFile = File(...),
    field_tag: str = Form(""),
    notes: str = Form(""),
    crop_selected: str = Form("potato"),
):
    try:
        image_bytes = await image.read()

        ext = "jpg"
        if image.filename and "." in image.filename:
            ext = image.filename.rsplit(".", 1)[-1].lower()

        image_path = upload_image_bytes(
            image_bytes=image_bytes,
            folder="crop",
            extension=ext,
            content_type=image.content_type or "image/jpeg",
        )

        prediction = predict_crop_image(image_bytes, crop_selected)

        log = save_log(
            feature="crop_screening",
            field_tag=field_tag,
            notes=notes,
            image_path=image_path,
            prediction=prediction,
        )

        return {"log": log}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))