import express from "express";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const distPath = path.join(process.cwd(), "dist");

app.use(express.json());

app.post("/api/ai/co-pilot-edit", async (req, res) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = String(req.body?.prompt || "").trim();
    const currentTimeline = req.body?.currentTimeline ?? {};

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt cannot be empty.",
      });
    }

    const systemInstruction = `
You are a professional AI video editing copilot.

Your job is to understand the user's editing request and convert it into
ACTIONABLE structured video-editing operations.

Return ONLY valid JSON. Do not use markdown. Do not explain outside JSON.

Required JSON structure:
{
  "intent": "short description of the editing intent",
  "explanation": "brief human-readable explanation",
  "operations": [],
  "warnings": [],
  "title": "optional short title"
}

Each operation MUST use one of these types:
TRIM, SPLIT, DELETE, MOVE, DUPLICATE, SPEED, VOLUME, MUTE,
ROTATE, CROP, FILTER, TRANSITION, TEXT, CAPTION, AUDIO,
REMOVE_SILENCE, DETECT_SCENES, CREATE_REEL, CHANGE_ASPECT_RATIO.

Operation fields may include:
clipIndex, clipId, startMs, endMs, newStartTrimMs, newEndTrimMs,
splitAtMs, value, speed, volume, degrees, rotation, crop, transform,
colorAdjustments, enabled, isMuted, muted, dynamic, filter, name,
transition, content, text, captionText, style.

Rules:
- NEVER return an empty operations array when the user's request clearly
  asks for an editing action.
- Use the current timeline information when selecting clip indexes.
- Use clipIndex starting from 0.
- For "make it faster/slower", use SPEED with a numeric speed value.
- SPEED MUST always be between 0.25 and 4.0 inclusive.
- For mute/unmute, use MUTE with muted true/false.
- For captions/subtitles, use CAPTION.
- For adding text, use TEXT.
- For removing silence, use REMOVE_SILENCE.
- For detecting scenes, use DETECT_SCENES.
- For making a Reel, use CREATE_REEL.
- For changing aspect ratio, use CHANGE_ASPECT_RATIO.
- For trimming, provide appropriate timing fields when the user gives times.
- If the user asks for a general style change such as cinematic, create
  concrete operations such as FILTER, SPEED, TEXT, AUDIO, or TRANSITION
  when appropriate rather than only describing the idea.
- Do not invent nonexistent clip IDs.
- If exact timing is not provided, prefer operations that can safely be
  interpreted by the existing editor.
`;

    const userContext = JSON.stringify({
      request: prompt,
      currentTimeline,
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: systemInstruction + "\n\nUSER REQUEST:\n" + userContext,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text || "";

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Gemini returned invalid JSON:", text);

      return res.status(502).json({
        success: false,
        error: "Gemini returned malformed structured data.",
      });
    }

    if (!Array.isArray(data.operations)) {
      data.operations = [];
    }

    return res.json({
      success: true,
      data: {
        intent: data.intent || "ai-copilot",
        explanation:
          data.explanation || "AI generated an editing plan.",
        operations: data.operations,
        warnings: Array.isArray(data.warnings)
          ? data.warnings
          : [],
        title: data.title,
      },
    });
  } catch (error) {
    console.error("Co-Pilot Gemini error:", error);

    return res.status(500).json({
      success: false,
      error: "AI is temporarily unavailable.",
    });
  }
});

app.post("/api/ai/reel-maker", (req, res) => {
  const {
    clips = [],
    vibe,
    targetDurationSec,
    musicGenre,
  } = req.body ?? {};

  res.json({
    success: true,
    data: {
      intent: "reel-maker",
      explanation: "Reel Maker request received by the backend.",
      operations: [],
      warnings: [],
      planSummary: [
        `Vibe: ${vibe ?? "default"}`,
        `Duration: ${targetDurationSec ?? 0}s`,
        `Music: ${musicGenre ?? "default"}`,
        `Clips: ${Array.isArray(clips) ? clips.length : 0}`,
      ],
    },
  });
});

app.post("/api/ai/script", async (req, res) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const topic = String(req.body?.topic || "").trim();
    const durationSec = Number(req.body?.durationSec || 30);
    const vibe = String(
      req.body?.vibe || "Viral TikTok / Reel"
    );
    const aspectRatio = String(
      req.body?.aspectRatio || "9:16"
    );
    const language = String(
      req.body?.language || "English"
    );

    if (!topic) {
      return res.status(400).json({
        success: false,
        error: "Topic cannot be empty.",
      });
    }

    const systemInstruction = `
You are a professional viral short-form video script writer.

Create a concise, production-ready script for an AI video editor.

Return ONLY valid JSON. Do not use markdown or code fences.

Required JSON structure:
{
  "title": "string",
  "hook": "string",
  "estimatedDuration": number,
  "viralScore": number,
  "targetAspect": "string",
  "backgroundMusicVibe": "string",
  "scenes": [
    {
      "id": "scene-1",
      "startTimeSec": 0,
      "durationSec": 5,
      "visualDescription": "string",
      "voiceover": "string",
      "textOverlay": "string",
      "recommendedFilter": "string",
      "transition": "string"
    }
  ],
  "suggestedHashtags": ["string"],
  "callToAction": "string"
}

Rules:
- Match the requested duration as closely as practical.
- Use multiple scenes with continuous timing.
- startTimeSec must begin at 0.
- durationSec must be positive.
- Each scene must contain all required fields.
- Write the voiceover in the requested language.
- Keep the hook strong and concise.
- Keep visualDescription useful for AI video generation.
- textOverlay should be short and readable on a mobile screen.
- viralScore must be a number from 0 to 100.
- targetAspect should match the requested aspect ratio.
- Do not invent factual claims when the topic requires specific facts.
- Use simple, valid strings for recommendedFilter and transition.
`;

    const userRequest = JSON.stringify({
      topic,
      durationSec,
      vibe,
      aspectRatio,
      language,
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        systemInstruction +
        "\n\nUSER REQUEST:\n" +
        userRequest,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = result.text || "";

    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(
        "Gemini script returned invalid JSON:",
        text
      );

      return res.status(502).json({
        success: false,
        error: "Gemini returned malformed script data.",
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(502).json({
        success: false,
        error: "Gemini returned invalid script data.",
      });
    }

    if (!Array.isArray(data.scenes)) {
      data.scenes = [];
    }

    return res.json({
      success: true,
      data: {
        title: String(data.title || topic),
        hook: String(data.hook || ""),
        estimatedDuration: Number(
          data.estimatedDuration || durationSec
        ),
        viralScore: Number(data.viralScore || 0),
        targetAspect: String(
          data.targetAspect || aspectRatio
        ),
        backgroundMusicVibe: String(
          data.backgroundMusicVibe || vibe
        ),
        scenes: data.scenes,
        suggestedHashtags:
          Array.isArray(data.suggestedHashtags)
            ? data.suggestedHashtags.map(String)
            : [],
        callToAction: String(
          data.callToAction || ""
        ),
      },
    });
  } catch (error) {
    console.error("AI Script Gemini error:", error);

    return res.status(500).json({
      success: false,
      error: "AI is temporarily unavailable.",
    });
  }
});

app.use(express.static(distPath));

app.post("/api/universal/plan", async (req, res) => {
  try {
    const {
      goal = "",
      input = {},
      priority = "normal",
    } = req.body ?? {};

    if (!String(goal).trim()) {
      return res.status(400).json({
        success: false,
        error: "A goal is required.",
      });
    }

    res.json({
      success: true,
      data: {
        goal: String(goal).trim(),
        input,
        priority,
        workflow: [
          "understand",
          "plan",
          "prioritize",
          "execute",
          "verify",
          "recover-if-needed",
          "learn",
        ],
        message: "Universal task accepted.",
      },
    });
  } catch (error) {
    console.error("Universal system error:", error);

    res.status(500).json({
      success: false,
      error: "Universal system request failed.",
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on http://0.0.0.0:${PORT}`
  );
});