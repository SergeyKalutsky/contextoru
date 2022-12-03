# pip install -r requirements.txt
# python -m uvicorn main:app --reload
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

