# pip install -r requirements.txt
# python -m uvicorn main:app --reload
from fastapi import FastAPI
from gensim.models import KeyedVectors
from pydantic import BaseModel


class Guess(BaseModel):
    word: str


app = FastAPI()
w2v = KeyedVectors.load_word2vec_format('custom_wiki_ru355texts.txt')
secret = 'нога'
vals = w2v.most_similar(secret, topn=100000)
d = {k: i+2 for i, (k, v) in enumerate(vals)}


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/check_guess")
async def check_guess(guess: Guess):
    if guess.word == secret:
        return {'rating': 1, 'error': 'ok'}
    elif guess.word in d:
        return {'rating': d[guess.word], 'error': 'ok'}
    return {"error": 'word is not found'}

