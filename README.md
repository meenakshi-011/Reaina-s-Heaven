# 🌸 Reaina's Heaven — AI Powered Lifestyle & Gifting Platform

## 🔗 Live Demo
🚀 Frontend: https://reaina-s-heaven-frontend.onrender.com/


> “Where gifting meets emotion, comfort, and intelligent experiences.”

Reaina's Heaven is a modern AI-powered lifestyle, gifting, and cozy café platform built to deliver personalized and emotionally meaningful shopping experiences. The platform combines handcrafted café products, fresh flowers, curated books, luxury hampers, and intelligent AI assistance into one seamless full-stack ecosystem.

This project is designed as a next-generation conversational commerce platform that blends:
- E-commerce
- AI-powered customer support
- Personalized gifting
- Semantic search
- RAG (Retrieval-Augmented Generation)
- Real-time conversational AI

The platform focuses on creating a cozy luxury shopping experience through thoughtful products, elegant UI design, and AI-driven interactions.

---

# ✨ Key Features

## 🛍️ E-Commerce Features
- User Authentication & Authorization
- Product Browsing & Filtering
- Dynamic Categories
- Shopping Cart
- Wishlist
- Razorpay Payment Gateway Integration
- Responsive UI
- Secure Checkout Flow
- Order Placement System

---

# 🌸 Product Categories

## 💐 Flowers & Bouquets
- Fresh flower bouquets
- Occasion-based gifting
- Personalized bouquets
- Luxury floral arrangements

## ☕ Handmade Café Goods
- Handmade desserts & treats
- Healthy alternatives
- Eggless & vegan options
- Gluten-free & sugar-free customization

## 📚 Curated Books
- Genre-based recommendations
- Personalized book packs
- Reading theme collections

## 🎁 Luxury Gift Hampers
- Customizable hampers
- Corporate gifting
- Personalized message cards
- Premium packaging

---

# 🤖 AI Features

## Haven AI Assistant
An intelligent AI shopping assistant integrated directly into the platform.

### Capabilities:
- Product recommendations
- Shipping support
- Refund policy assistance
- Customization guidance
- Delivery timing queries
- Corporate gifting support
- Café menu assistance
- FAQ support

---

# 🧠 RAG (Retrieval-Augmented Generation)

The chatbot uses a production-style RAG pipeline to generate grounded and context-aware responses.

Instead of relying only on LLM memory, the system:
1. Retrieves relevant business information from ChromaDB
2. Sends retrieved context to the LLM
3. Generates accurate responses based on real store data

This significantly reduces hallucinations and improves reliability.

---

# ⚙️ AI Architecture

```mermaid
graph TD;
    A[React Frontend] --> B[FastAPI AI Service]
    B --> C[Retriever]
    C --> D[ChromaDB Vector Database]
    D --> E[Sentence Transformer Embeddings]
    E --> F[Groq Llama 3 LLM]
#
Step 1 — User Query

User sends a message from the React chatbot UI.

Step 2 — Embedding Generation

The query is converted into vector embeddings using Sentence Transformers.

Step 3 — Semantic Retrieval

ChromaDB performs similarity search and retrieves relevant business knowledge chunks.

Step 4 — Context Injection

Retrieved context is added into the LLM prompt.

Step 5 — Response Generation

Groq Llama 3 generates grounded responses using retrieved context.

Step 6 — Response Returned

The AI response is displayed in the React UI.
````

🚀 Tech Stack
Frontend
React.js
Tailwind CSS
React Router DOM
Axios
Backend
Node.js
Express.js
MongoDB
JWT Authentication
Bcrypt
AI Stack
FastAPI
ChromaDB
Sentence Transformers
Groq API
Llama 3
RAG Pipeline
🗄️ Database Design
MongoDB Collections
Users
Products
Café Items
Orders
Wishlist
Cart
📦 RAG Knowledge Base

The AI assistant is trained on:

Product descriptions
Café menu data
FAQ documents
Shipping policy
Refund policy
Customization guide
Store information
Delivery rules
📋 Policy System

The platform includes fully integrated policy pages:

FAQ
Delivery queries
Product information
Returns & refunds
Customization support
Shipping Policy
Same-day delivery rules
Delivery slots
Shipping charges
OTP verification
Refund Policy
Refund eligibility
Return process
Refund windows
Non-refundable conditions
Customization Guide
Bouquet customization
Hamper customization
Café order customization
Corporate gifting support
💳 Payment Integration

Integrated with Razorpay for:

UPI payments
Debit/Credit Cards
Net Banking
Wallets
📂 Project Structure
Reainas-Heaven/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── rag_Service/
│   ├── chroma_db/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── knowledge_base.py
│
└── README.md
🚀 Installation Guide
1️⃣ Clone Repository
git clone https://github.com/your-username/reainas-heaven.git
2️⃣ Frontend Setup
cd frontend

npm install

npm run dev
3️⃣ Backend Setup
cd backend

npm install

npm start
4️⃣ RAG Service Setup
cd rag_Service

pip install -r requirements.txt

uvicorn main:app --reload
🔑 Environment Variables
Backend .env
MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key

RAZORPAY_KEY_ID=your_key

RAZORPAY_SECRET=your_secret
RAG Service .env
GROQ_API_KEY=your_groq_api_key
🧠 RAG Capabilities

The chatbot supports:

Context-aware conversations
Semantic search
AI customer support
Product understanding
Policy understanding
Personalized assistance
🌟 Key Highlights

✅ AI-integrated commerce platform
✅ Production-style RAG architecture
✅ Semantic vector search
✅ Real-time conversational AI
✅ Personalized gifting ecosystem
✅ Full-stack MERN application
✅ FastAPI AI microservice
✅ ChromaDB vector database
✅ Groq Llama 3 integration
✅ Modern responsive UI
✅ Internship-ready AI engineering project

🎯 Future Improvements
Voice-enabled AI assistant
Personalized recommendation engine
Emotion-aware shopping assistant
AI-generated gifting suggestions
Image-based product search
Multilingual chatbot
Admin analytics dashboard
AI-driven customer insights
📸 Screenshots


Homepage
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/47a195b0-fcbe-45b8-8f33-a1e584ee6e97" /> 
</p>
Product pages
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/e8e657c7-1517-4dc0-a0e8-8a894bf281bb" />
</p
AI chatbot
<p align="center">
  <img width="90%" src="" />
</p
Cart & checkout
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/e8686c83-9a5f-4907-a2cf-2bad8c5dec63" /> 
</p
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/40954242-573e-4cdf-9516-56fae663f07e" />
 /> 
</p

Policy pages

User Dashboard
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/fbf023ec-4cab-44a5-8478-25d65016679e" />
 /> 
</p
Admin Dashboard
<p align="center">
  <img width="90%" src="https://github.com/user-attachments/assets/96b11dd0-9bd8-4292-a840-cdd1b0622362" />
 /> 
👩‍💻 Developed By
Meenakshi Patel

AI/ML & Full Stack Developer passionate about building intelligent user experiences, conversational AI systems, and AI-powered commerce platforms.

🌸 Reaina's Heaven
Cozy. Intelligent. Personalized.
