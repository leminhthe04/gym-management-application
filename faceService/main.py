# uvicorn main:app --port 8000 --reload

from fastapi import FastAPI, File, UploadFile
import face_recognition
import io

app = FastAPI()

@app.post("/vectorize")
async def vectorize(file: UploadFile = File(...)):
    try:
        content = await file.read()
        image_stream = io.BytesIO(content)

        image = face_recognition.load_image_file(image_stream)

        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            return {
                "status": "error",
                "message": "No face detected in the image.",
                "vector": None
            }
        
        if len(encodings) > 1:
            return {
                "status": "error",
                "message": "Multiple faces detected in the image.",
                "vector": None
            }
        
        vector = encodings[0].tolist()

        return {
            "status": "success",
            "message": "Face vector extracted successfully.",
            "vector": vector
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"An error occurred: {str(e)}",
            "vector": None
        }