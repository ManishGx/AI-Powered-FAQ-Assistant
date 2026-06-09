# AI-Powered FAQ Assistant

## Project Overview

This repository implements a secure MERN-style AI FAQ assistant. The application allows users to ask questions, receives AI-generated answers via OpenRouter, and persists conversation history in MongoDB.

## Features

- Ask a question through a chat UI
- AI-generated answers from OpenRouter free model (`openrouter/free`)
- Conversation history saved with question, answer, and timestamp
- Previous conversations fetched via backend API
- Rate limiting and input validation for abuse protection
- CORS restricted to approved frontend origin
- Production-safe error handling and secure headers

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- AI Provider: OpenRouter free model

## Installation

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MongoDB URI and OpenRouter API key.
5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

## Environment Variables

Use `backend/.env.example` as a template.

- `PORT` - backend server port
- `MONGODB_URI` - MongoDB connection string
- `OPENROUTER_API_KEY` - private OpenRouter API key
- `OPENROUTER_MODEL` - should remain `openrouter/free` for safety
- `FRONTEND_ORIGIN` - allowed frontend origin for CORS
- `NODE_ENV` - environment mode

## API Endpoints

### POST `/api/chat`

- Request body:
  ```json
  {
    "question": "What is AI?"
  }
  ```
- Response:
  ```json
  {
    "answer": "...",
    "existing": false
  }
  ```

### GET `/api/chat/history`

- Returns a list of saved conversations.
- Optional search query:
  - `/api/chat/history?q=AI`

## Project Structure

- `backend/` - Express API server and MongoDB models
- `frontend/` - React UI and chat interface
- `backend/.env.example` - environment template
- `f:/ai-assistant/.gitignore` - repository ignore rules

## Screenshots

Add screenshots of the app here after you run the project locally.

## Future Improvements

- Add authentication for user-specific history
- Improve chat UX with streaming responses
- Add tests for backend and frontend
- Add pagination for conversation history

## Security Notes

- API keys and secrets are only stored in `backend/.env`
- `.env` is ignored by Git
- Only the free OpenRouter model `openrouter/free` is used
- Rate limiting protects the chat endpoint
- Input is validated and sanitized before storage
