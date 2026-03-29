# Pear Media AI Prototype

A complete prototype built for the Pear Media assignment, featuring a Two-Pane UI for Text and Image generation workflows.

## Features
- **Creative Studio (Text Workflow)**: Enter a simple prompt, have it enhanced by an expert AI Prompt Engineer (Gemini API), and generate a stunning masterpiece using Pollinations AI.
- **Style Lab (Image Workflow)**: Upload an image, get it analyzed for Subject, Style, and Lighting (Gemini Vision API), and automatically generate a reimagined variation (Pollinations AI).

## Setup & Execution

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from Google AI Studio.

### Installation
1. Clone this repository and navigate into the project directory:
   ```bash
   cd pearmedia-ai-prototype
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Gemini Key: `VITE_GEMINI_API_KEY=your_key_here`

### Running Locally
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

### Tech Stack
- Frontend: React (Vite), Tailwind CSS, Lucide React
- Image Generation: Pollinations AI (Free, No Key)
- Text & Vision Analysis: Google Gemini 1.5 Flash
