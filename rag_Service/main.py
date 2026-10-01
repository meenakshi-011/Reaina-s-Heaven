from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

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
    history: Optional[List[Dict[str, str]]] = None

# ==================================================
# RETRIEVE CONTEXT
# ==================================================

def retrieve_context(query, n_results=3):
    query_embedding = embedding_model.encode([query]).tolist()
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )
    return results["documents"][0]

# ==================================================
# QUERY REWRITER FOR CONVERSATIONAL RAG
# ==================================================

def rewrite_query(question: str, history: Optional[List[Dict[str, str]]] = None) -> str:
    if not history:
        return question
    
    history_str = ""
    for msg in history:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        history_str += f"{role.capitalize()}: {content}\n"
        
    prompt = f"""Given the following conversation history and a follow-up question, rewrite the follow-up question to be a standalone search query that can be used to search in a vector database. Do NOT answer the question. Just output the rewritten query and nothing else.

Conversation History:
{history_str}

Follow-up Question: {question}
Standalone Query:"""
    
    try:
        response = client_groq.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that rewrites search queries based on chat history to be standalone search terms."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        rewritten = response.choices[0].message.content.strip()
        if rewritten.startswith('"') and rewritten.endswith('"'):
            rewritten = rewritten[1:-1].strip()
        return rewritten
    except Exception:
        return question

# ==================================================
# ASK AI
# ==================================================

def ask_groq(question: str, context: str, history: Optional[List[Dict[str, str]]] = None) -> str:
    system_content = """You are Haven AI for Reaina's Heaven.

You are a warm, intelligent AI shopping assistant.

You help customers with:
- flowers
- cafe items
- books
- hampers
- delivery
- refunds
- customization
- gifting support

Always answer politely, naturally, and professionally.
"""

    prompt = f"""You are Haven AI, the AI assistant for Reaina's Heaven.

Reaina's Heaven is a cozy gifting, flowers, cafe, books, and hamper platform based in Jabalpur.

Your job is to help users with:
- products
- delivery
- refunds
- customization
- policies
- orders
- cafe items
- gifting suggestions

Answer naturally, warmly, and professionally using the provided context.

If exact information is not available, use the closest relevant information from the context to provide a helpful response.

Do NOT make up fake policies or false claims.

If absolutely nothing relevant exists, then say:
"I could not find that information."

Context:
{context}

User Question:
{question}"""

    messages = [{"role": "system", "content": system_content}]
    
    if history:
        for msg in history:
            role = msg.get("role")
            content = msg.get("content")
            if role in ["user", "assistant"] and content:
                messages.append({"role": role, "content": content})
                
    messages.append({"role": "user", "content": prompt})

    response = client_groq.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.5
    )
    return response.choices[0].message.content

# ==================================================
# CHAT ENDPOINT
# ==================================================

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        # 1. Rewrite query to standalone query using history
        standalone_query = rewrite_query(req.message, req.history)
        
        # 2. Retrieve relevant context
        retrieved_docs = retrieve_context(standalone_query)
        context = "\n\n".join(retrieved_docs)
        
        # 3. Get answer from Groq
        response = ask_groq(req.message, context, req.history)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}

# ==================================================
# ROOT ROUTE
# ==================================================

@app.get("/")
def home():
    return {
        "message": "Reaina's Heaven RAG API Running"
    }