import dotenv from "dotenv";
import { getUniversalRuntimeSnapshot } from './src/services/aiProvider/universal/UniversalRuntimeApi';
import { bootstrapUniversalProviders } from './src/services/aiProvider/universal/UniversalProviderBootstrap';
dotenv.config({ override: true });
const interviewOrchestrator = new InterviewOrchestrator();
import { GoogleVideoProvider } from './src/services/aiProvider/GoogleVideoProvider';
import express from "express";
import path from "path";

import { autonomousHost } from "./src/agent/AutonomousHost";
import { AutonomousExecutionEngine } from "./src/agent/AutonomousExecutionEngine";
import { MasterAgentCoreAdapter } from "./src/agent/AutonomousCoreAdapter";
import { InterviewOrchestrator } from './src/core/interview/InterviewOrchestrator';
bootstrapUniversalProviders();

const app = express();


app.get('/api/universal/providers', (_req, res) => {
  try {
    res.json(getUniversalRuntimeSnapshot());
  } catch (error) {
    console.error('[universal/providers]', error);
    res.status(500).json({
      error: 'Unable to read universal provider state.',
    });
  }
});

app.get('/api/universal/capabilities', (_req, res) => {
  try {
    const snapshot = getUniversalRuntimeSnapshot();
    res.json({
      capabilities: snapshot.capabilities,
    });
  } catch (error) {
    console.error('[universal/capabilities]', error);
    res.status(500).json({
      error: 'Unable to read universal capability state.',
    });
  }
});


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

app.post("/api/ai/reel-maker", async (req, res) => {
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

    const {
      clips = [],
      preset = "Viral Reel",
      targetDurationSec = 15,
      musicGenre = "phonk",
      removeSilence = true,
    } = req.body ?? {};

    const safeClips = Array.isArray(clips) ? clips : [];

    const systemInstruction = `
You are VIDOAI's professional AI Reel Director.

Create a production-ready editing plan from the supplied timeline clips.

Return ONLY valid JSON.

Required structure:
{
  "intent": "reel-maker",
  "title": "short title",
  "hook": "opening hook",
  "viralScore": 0,
  "explanation": "brief explanation",
  "operations": [],
  "warnings": [],
  "planSummary": []
}

Allowed operations:
TRIM, SPLIT, DELETE, MOVE, DUPLICATE, SPEED, VOLUME, MUTE,
ROTATE, CROP, FILTER, TRANSITION, TEXT, CAPTION, AUDIO,
REMOVE_SILENCE, DETECT_SCENES, CREATE_REEL, CHANGE_ASPECT_RATIO.

Rules:
- Use clipIndex starting from 0.
- Do not invent clip IDs.
- Never use SPEED unless it is genuinely required by the selected style.
- Default playback speed MUST remain 1.0x.
- Never return 1.1x or 1.15x as a generic style default.
- SPEED values must be between 0.25 and 4.0.
- Prefer safe editing operations over destructive guesses.
- Target the requested duration.
- For a vertical Reel, use CHANGE_ASPECT_RATIO to 9:16 when appropriate.
- Use REMOVE_SILENCE only when requested.
- Use CREATE_REEL to describe the overall reel construction.
- Return concrete operations, not just a description.
- viralScore must be 0-100.
`;

    const userRequest = JSON.stringify({
      preset,
      targetDurationSec,
      musicGenre,
      removeSilence,
      clips: safeClips.map((clip: any, index: number) => ({
        clipIndex: index,
        id: clip?.id,
        name: clip?.name,
        durationMs:
          Number(clip?.endTrimMs || 0) -
          Number(clip?.startTrimMs || 0),
        speed:
          typeof clip?.speed === "number" ? clip.speed : 1,
        category: clip?.category,
      })),
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        systemInstruction +
        "\n\nREEL REQUEST:\n" +
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
      console.error("Gemini Reel Maker returned invalid JSON:", text);

      return res.status(502).json({
        success: false,
        error: "Gemini returned malformed Reel plan.",
      });
    }

    if (!Array.isArray(data.operations)) {
      data.operations = [];
    }

    if (!Array.isArray(data.warnings)) {
      data.warnings = [];
    }

    if (!Array.isArray(data.planSummary)) {
      data.planSummary = [];
    }

    return res.json({
      success: true,
      data: {
        intent: "reel-maker",
        title: String(data.title || `${preset} Reel`),
        hook: String(data.hook || ""),
        viralScore: Math.max(
          0,
          Math.min(100, Number(data.viralScore || 0))
        ),
        explanation: String(
          data.explanation || "AI generated a Reel editing plan."
        ),
        operations: data.operations,
        warnings: data.warnings,
        planSummary: data.planSummary,
      },
    });
  } catch (error) {
    console.error("Reel Maker Gemini error:", error);

    return res.status(500).json({
      success: false,
      error: "AI is temporarily unavailable.",
    });
  }
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


// VIDOAI GENERATION PIPELINE


type GenerationKind =
  | "text-to-video"
  | "image-to-video"
  | "script-to-video"
  | "reel";

interface GenerationJob {
  id: string;
  kind: GenerationKind;
  prompt: string;
  status: "queued" | "processing" | "completed" | "failed";
  mediaUrl?: string;
  title?: string;
  durationSec?: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

const generationJobs = new Map<string, GenerationJob>();
const GENERATION_JOBS_FILE = "generation-jobs.json";

const loadGenerationJobs = () => {
  try {
    const fs = require("fs");
    if (!fs.existsSync(GENERATION_JOBS_FILE)) return;
    const parsed = JSON.parse(fs.readFileSync(GENERATION_JOBS_FILE, "utf8"));
    if (Array.isArray(parsed)) {
      for (const job of parsed) {
        if (job?.id) generationJobs.set(job.id, job);
      }
    }
  } catch {
    // Persistence is best-effort.
  }
};

const persistGenerationJobs = () => {
  try {
    const fs = require("fs");
    fs.writeFileSync(
      GENERATION_JOBS_FILE,
      JSON.stringify(Array.from(generationJobs.values()), null, 2)
    );
  } catch {
    // Persistence is best-effort.
  }
};

loadGenerationJobs();


class ServerGenerationProviderAdapter {
  private provider: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      throw new Error("Google Veo is not configured. Set GEMINI_API_KEY.");
    }

    this.provider = new GoogleVideoProvider(apiKey);
  }

  async generate(prompt: string, kind: string) {
    const provider = this.provider;

    if (typeof provider.generateVideo === "function") {
      return provider.generateVideo(prompt, kind);
    }

    if (typeof provider.generate === "function") {
      return provider.generate(prompt, kind);
    }

    if (typeof provider.createVideo === "function") {
      return provider.createVideo(prompt, kind);
    }

    throw new Error(
      "GoogleVideoProvider has no supported generation method."
    );
  }
}


function normalizeGenerationProviderResult(result: any) {
  if (!result) {
    throw new Error("Video provider returned no result.");
  }

  if (result.success === false) {
    throw new Error(result.error || "Video provider failed.");
  }

  const mediaUrl =
    result.mediaUrl ||
    result.videoUrl ||
    result.video?.uri ||
    result.video?.url;

  if (!mediaUrl) {
    throw new Error(
      "Video provider completed but returned no playable video URL."
    );
  }

  return {
    mediaUrl,
    title: result.title || "Generated Video",
    durationSec:
      typeof result.durationSec === "number"
        ? result.durationSec
        : undefined,
  };
}

async function runGenerationProvider(job: GenerationJob) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("Google Veo is not configured. Set GEMINI_API_KEY.");
  }

  const provider = new GoogleVideoProvider(apiKey);

  const request = {
    prompt: job.prompt,
    durationSec: job.durationSec ?? 8,
    aspectRatio: "9:16",
  };

  const result = await provider.createVideo(request);

  if (!result.success) {
    throw new Error(
      result.error || "Google Veo video generation failed."
    );
  }

  if (!result.videoUrl) {
    throw new Error(
      "Google Veo completed without returning a video URL."
    );
  }

  return {
    mediaUrl: result.videoUrl,
    title: "Generated Video",
    durationSec: job.durationSec ?? 8,
  };
}

async function processGenerationJob(id: string) {
  const job = generationJobs.get(id);

  if (!job) return;

  job.status = "processing";
  job.updatedAt = Date.now();
  persistGenerationJobs();

  try {
    const result = await runGenerationProvider(job);

    job.status = "completed";
    job.mediaUrl = result.mediaUrl;
    job.title = result.title;
    job.durationSec = result.durationSec;
    job.updatedAt = Date.now();
    persistGenerationJobs();
  } catch (error: any) {
    job.status = "failed";
    job.error =
      error instanceof Error
        ? error.message
        : "Video generation failed.";
    job.updatedAt = Date.now();
    persistGenerationJobs();
  }
}

app.get("/api/generation/provider-status", (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const configured = Boolean(apiKey);

  res.json({
    success: true,
    data: {
      configured,
      provider: configured ? "google-veo" : "not-configured",
      apiKeyConfigured: Boolean(apiKey),
      message: configured
        ? "Video generation provider is configured."
        : "Video generation provider is not configured.",
    },
  });
});

app.post("/api/generation/jobs", (req, res) => {
  const kind = String(
    req.body?.kind || "text-to-video"
  ) as GenerationKind;

  const prompt = String(req.body?.prompt || "").trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: "Generation prompt cannot be empty.",
    });
  }

  const allowedKinds: GenerationKind[] = [
    "text-to-video",
    "image-to-video",
    "script-to-video",
    "reel",
  ];

  if (!allowedKinds.includes(kind)) {
    return res.status(400).json({
      success: false,
      error: "Unsupported generation kind.",
    });
  }

  const id = `gen_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const now = Date.now();

  const job: GenerationJob = {
    id,
    kind,
    prompt,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  };

  generationJobs.set(id, job);
  persistGenerationJobs();

  void processGenerationJob(id);

  return res.status(202).json({
    success: true,
    data: job,
  });
});

app.get("/api/generation/jobs/:id", (req, res) => {
  const job = generationJobs.get(req.params.id);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: "Generation job not found.",
    });
  }

  return res.json({
    success: true,
    data: job,
  });
});

app.get("/api/generation/jobs", (_req, res) => {
  return res.json({
    success: true,
    data: Array.from(generationJobs.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    ),
  });
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

    return res.json({
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

    return res.status(500).json({
      success: false,
      error: "Universal system request failed.",
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


app.post('/api/interview/session', (req, res) => {
  try {
    const topic = String(req.body?.topic ?? '').trim();

    if (!topic) {
      return res.status(400).json({
        error: 'A topic is required.',
      });
    }

    const session = interviewOrchestrator.createSession({
      topic,
      difficulty: req.body?.difficulty,
      mode: req.body?.mode,
      questionCount: req.body?.questionCount,
      language: req.body?.language,
      candidateName: req.body?.candidateName,
      context: req.body?.context,
    });

    return res.json({
      ok: true,
      session,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Interview creation failed.',
    });
  }
});

app.post('/api/interview/answer', (req, res) => {
  try {
    const session = req.body?.session;

    if (!session) {
      return res.status(400).json({
        error: 'Session is required.',
      });
    }

    const answer = String(req.body?.answer ?? '');

    const updated = interviewOrchestrator.answer(
      session,
      answer,
    );

    return res.json({
      ok: true,
      session: updated,
      evaluation: updated.evaluations.at(-1) ?? null,
      summary: interviewOrchestrator.summary(updated),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Interview evaluation failed.',
    });
  }
});


// VIDOAI autonomous task API
app.post("/api/autonomous/task", async (req: any, res: any) => {
  try {
    const body = req?.body ?? {};
    const goal =
      typeof body.goal === "string"
        ? body.goal.trim()
        : typeof body.request === "string"
          ? body.request.trim()
          : "";

    if (!goal) {
      return res.status(400).json({
        ok: false,
        error: "A goal is required",
      });
    }

    const taskId = `task_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    return res.status(202).json({
      ok: true,
      taskId,
      status: "queued",
      goal,
      execution: {
        accepted: true,
        providerExecutionRequired: true,
        fabricatedSuccess: false,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Autonomous task request failed",
    });
  }
});

app.get("/api/autonomous/task/:id", async (req: any, res: any) => {
  return res.status(404).json({
    ok: false,
    taskId: req?.params?.id,
    status: "unknown",
    error: "Task persistence/execution adapter is not configured",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
