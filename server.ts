import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Smart Website Analyzer API with Gemini AI fallback
  app.post("/api/analyze-website", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Check if Gemini API key exists
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `Analyze this website URL: "${url}".
Respond in strictly valid JSON format with NO markdown wrapping, matching this schema:
{
  "name": "Clean concise website name",
  "category": "One of: Development, Programming, Cybersecurity, AI, Design, Productivity, Education, Finance, Business, Social Media, Cloud, Documentation, Tools, News, Entertainment, Shopping, Other",
  "subcategory": "Specific sub-domain (e.g. Code Hosting, Vulnerability Lab, LLM Playground, Vector Graphics)",
  "description": "Short, precise 1-sentence description (under 120 chars) of what this website or tool does",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          const rawText = response.text || "";
          try {
            const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
            return res.json({
              success: true,
              source: "gemini",
              data: parsed,
            });
          } catch (jsonErr) {
            console.warn("Failed to parse Gemini JSON:", rawText);
          }
        } catch (geminiErr) {
          console.warn("Gemini API call failed, falling back to heuristic analyzer:", geminiErr);
        }
      }

      // Heuristic fallback response
      return res.json({
        success: false,
        message: "Gemini key not configured or fallback requested; client-side catalog will handle analysis.",
      });
    } catch (err: any) {
      console.error("Analysis route error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NexusWeb Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
