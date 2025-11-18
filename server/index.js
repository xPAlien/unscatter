import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Rate limiting: 20 requests per 5 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize Gemini AI
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are Unscatter, a ruthless cognitive ergonomics enforcer and clarity machine. Your sole purpose is to convert scattered inputs into a single, visual map that reveals the next actionable step. Operate with zero fluff and strict first-principles logic.

Your task:
1. Receive a block of unstructured text and optionally one or more images containing tasks, ideas, and notes.
2. Analyze all provided inputs (text and images) to identify individual, actionable tasks.
3. Group related tasks into logical clusters. Name each cluster concisely.
4. For each task, compute its 'effort' (low, medium, high) and 'impact' (low, medium, high).
5. Identify any dependencies between tasks using their generated IDs. An empty array means no dependencies.
6. Based on your analysis, determine the single most logical 'nextActionId'. This is the ID of the task with the lowest effort and highest impact that is not blocked by dependencies.
7. Return the entire analysis as a JSON object adhering strictly to the provided schema. Do not output any other text, explanation, or markdown. Your response must be only the JSON.`;

const responseSchema = {
  type: 'OBJECT',
  properties: {
    tasks: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'INTEGER' },
          task: { type: 'STRING' },
          cluster: { type: 'STRING' },
          effort: { type: 'STRING', enum: ['low', 'medium', 'high'] },
          impact: { type: 'STRING', enum: ['low', 'medium', 'high'] },
          dependencies: {
            type: 'ARRAY',
            items: { type: 'INTEGER' },
          },
        },
        required: ['id', 'task', 'cluster', 'effort', 'impact', 'dependencies'],
      },
    },
    nextActionId: { type: 'INTEGER' },
  },
  required: ['tasks', 'nextActionId'],
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/api/analyze', apiLimiter, async (req, res) => {
  try {
    const { inputText, images } = req.body;

    // Validation
    if (!inputText && (!images || images.length === 0)) {
      return res.status(400).json({
        error: 'Input cannot be empty. Please provide text or images.'
      });
    }

    if (images && images.length > 10) {
      return res.status(400).json({
        error: 'Maximum 10 images allowed per request.'
      });
    }

    // Sanitize input (basic)
    const sanitizedText = inputText ? inputText.substring(0, 10000) : '';

    // Build content parts
    const contentParts = [];
    const hasImages = images && images.length > 0;
    const textPrompt = hasImages
      ? (sanitizedText || 'Analyze the attached images.')
      : sanitizedText;

    contentParts.push({ text: textPrompt });

    if (hasImages) {
      images.forEach((image: { mimeType: string; data: string }) => {
        contentParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
      });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contentParts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.1,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Validate result structure
    if (!result || !Array.isArray(result.tasks) || typeof result.nextActionId !== 'number') {
      throw new Error('Invalid response structure from AI');
    }

    res.json(result);

  } catch (error) {
    console.error('Analysis error:', error);

    // Sanitized error messages
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();

      if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('forbidden')) {
        errorMessage = 'Authentication error. Service is temporarily unavailable.';
      } else if (msg.includes('quota') || msg.includes('limit') || msg.includes('rate')) {
        errorMessage = 'Service quota exceeded. Please try again later.';
      } else if (msg.includes('network') || msg.includes('timeout')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (msg.includes('invalid') || msg.includes('parse')) {
        errorMessage = 'Invalid response received. Please try again.';
      }
    }

    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Unscatter API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
