<div align="center">
  <svg width="96" height="96" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke="#1F2937">
      <path d="M4 10 L20 20 L24 24" />
      <path d="M4 17 L20 22 L24 24" />
      <path d="M4 24 H 24" />
      <path d="M4 31 L20 26 L24 24" />
      <path d="M4 38 L20 28 L24 24" />
    </g>
    <path d="M24 24 H44 M38 18 L44 24 L38 30" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <h1>Unscatter</h1>
  <p><em>From scattered to clear. Your next step, visualized.</em></p>
</div>

---

## Overview

**Unscatter** is a visual planning system designed for ADHD/ND-focused individuals. It converts scattered inputs—tasks, ideas, images, half-thoughts—into a single visual map that reveals the next actionable step, optimizing for clarity and reduced cognitive load.

### Key Features

- **Dump Everything In**: No formatting, no sorting. Just input text, images, or both.
- **Automatic Clustering**: Groups related items using semantic logic powered by Google Gemini AI.
- **Visual Dependency Mapping**: Shows what blocks progress and reveals task sequences.
- **Energy + Impact Scoring**: Each task is evaluated for effort cost and outcome impact.
- **Next Step Spotlight**: Always highlights one optimal next action—low effort, high clarity, zero decision tax.
- **Theme Support**: Light, gray, and dark modes for comfortable viewing.

---

## Run Locally

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### Setup

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd unscatter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your Gemini API key**:

   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:

   Navigate to `http://localhost:3000`

---

## Build for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI**: Google Gemini 2.5 Flash (via @google/genai)

---

## How It Works

1. **Input**: Provide scattered tasks, thoughts, or upload images containing to-do items.
2. **Analysis**: Gemini AI processes the input, identifies tasks, clusters them, and evaluates effort/impact.
3. **Visualization**: Tasks are displayed as organized cards with clear dependencies.
4. **Action**: The system highlights the single best next step to take.

---

## Project Structure

```
unscatter/
├── components/          # React components
│   ├── Header.tsx
│   ├── LandingPage.tsx
│   ├── InputSection.tsx
│   ├── OutputSection.tsx
│   ├── TaskCard.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── WelcomeMessage.tsx
├── services/
│   └── geminiService.ts # Gemini API integration
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

---

## License

MIT

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

<div align="center">
  <p><strong>Reduce chaos. Reveal the next step.</strong></p>
</div>
