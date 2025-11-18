# Unscatter API Server

Backend API proxy for Unscatter that secures the Gemini API key and implements rate limiting.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. Start the server:
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST /api/analyze

Analyzes user input and images to generate task breakdown.

**Request Body:**
```json
{
  "inputText": "string",
  "images": [
    {
      "mimeType": "image/png",
      "data": "base64_encoded_data"
    }
  ]
}
```

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "task": "Task description",
      "cluster": "Category",
      "effort": "low",
      "impact": "high",
      "dependencies": []
    }
  ],
  "nextActionId": 1
}
```

### GET /health

Health check endpoint.

## Security Features

- **Rate Limiting**: 20 requests per 5 minutes per IP
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers
- **Input Validation**: Sanitizes and validates all inputs
- **Error Sanitization**: Prevents information disclosure

## Deployment

### Render.com

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables in dashboard

### Railway

1. Create new project from GitHub
2. Set root directory to `server`
3. Add environment variables
4. Deploy

### Heroku

1. Create new app
2. Set buildpack to Node.js
3. Add `Procfile` in server directory:
   ```
   web: node index.js
   ```
4. Deploy via Git

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
