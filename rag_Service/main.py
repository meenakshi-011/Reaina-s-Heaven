from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import chromadb
from sentence_transformers import SentenceTransformer

from groq import Groq

from dotenv import load_dotenv
import os

# ==================================================
# LOAD ENV VARIABLES
# ==================================================

load_dotenv()

# ==================================================
# GEMINI CONFIG
# ==================================================

client_groq = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

model = "llama-3.3-70b-versatile"

# ==================================================
# FASTAPI APP
# ==================================================

app = FastAPI()

# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================================================
# LOAD EMBEDDING MODEL
# ==================================================

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# ==================================================
# LOAD CHROMADB
# ==================================================

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_collection(
    name="reainas_heaven_rag"
)

# ==================================================
# REQUEST MODEL
# ==================================================

class ChatRequest(BaseModel):
    message: str

# ==================================================
# RETRIEVE CONTEXT
# ==================================================

def retrieve_context(query, n_results=3):

    query_embedding = embedding_model.encode(
        [query]
    ).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )

    return results["documents"][0]

# ==================================================
# ASK AI
# ==================================================

def ask_ai(question):

    retrieved_docs = retrieve_context(
        question
    )

    context = "\n\n".join(
        retrieved_docs
    )

    prompt = f"""
    You are the AI assistant for Reaina's Heaven.

    Use ONLY the provided context.

    If the answer is not present in context,
    say:
    "I could not find that information."

    Context:
    {context}

    User Question:
    {question}
    """

    response = client_groq.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI shopping assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# ==================================================
# CHAT ENDPOINT
# ==================================================

@app.post("/chat")

def chat(req: ChatRequest):

    try:

        response = ask_ai(
            req.message
        )

        return {
            "response": response
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# ==================================================
# ROOT ROUTE
# ==================================================

@app.get("/")

def home():

    return {
        "message": "Reaina's Heaven RAG API Running"
    }