import { MasterAgent } from "../../core/universal/agents/MasterAgent";
import { agentRegistry } from "./AgentRegistry";
import type { TeamAgent } from "./AgentTypes";

function createMasterDelegateAgent(): TeamAgent {
  const master = new MasterAgent();

  return {
    id: "master-agent",
    name: "Master Orchestrator",
    capabilities: [
      "orchestration",
      "planning",
      "task-decomposition",
      "verification",
    ],
    status: "available",

    async execute(context) {
      try {
        const output = await master.execute(context.prompt);

        return {
          success: true,
          agentId: "master-agent",
          output,
        };
      } catch (error) {
        return {
          success: false,
          agentId: "master-agent",
          error:
            error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}

function createResearchAgent(): TeamAgent {
  return {
    id: "research-agent",
    name: "Research Agent",
    capabilities: ["research", "document-analysis"],
    status: "available",

    async execute(context) {
      return {
        success: false,
        agentId: "research-agent",
        error:
          "Research provider/tool execution is not connected yet.",
      };
    },
  };
}

function createVideoAgent(): TeamAgent {
  return {
    id: "video-agent",
    name: "Video Agent",
    capabilities: ["video-generation", "video-editing"],
    status: "available",

    async execute(context) {
      try {
        const baseUrl =
          process.env.VIDOAI_BASE_URL ||
          `http://127.0.0.1:${process.env.PORT || 3000}`;

        const response = await fetch(`${baseUrl}/api/ai/reel-maker`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clips: [],
            vibe: "cinematic",
            targetDurationSec: 30,
            musicGenre: "ambient",
            prompt: context.prompt,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          return {
            success: false,
            agentId: "video-agent",
            error:
              data?.error ||
              `Video backend error (${response.status}).`,
            output: data,
          };
        }

        return {
          success: true,
          agentId: "video-agent",
          output: {
            type: "video-plan",
            source: "VidoAI-ReelMaker",
            taskId: context.taskId,
            prompt: context.prompt,
            result: data,
          },
        };
      } catch (error) {
        return {
          success: false,
          agentId: "video-agent",
          error:
            error instanceof Error
              ? error.message
              : String(error),
        };
      }
    },
  };
}

function createVoiceAgent(): TeamAgent {
  return {
    id: "voice-agent",
    name: "Voice Agent",
    capabilities: ["stt", "tts", "voice"],
    status: "available",

    async execute(context) {
      return {
        success: false,
        agentId: "voice-agent",
        error:
          "Voice provider/tool execution is not connected yet.",
      };
    },
  };
}

function createEditorAgent(): TeamAgent {
  return {
    id: "editor-agent",
    name: "Video Editor Agent",
    capabilities: [
      "editor-control",
      "timeline",
      "captions",
      "audio",
      "effects",
      "export",
    ],
    status: "available",

    async execute(context) {
      return {
        success: false,
        agentId: "editor-agent",
        error:
          "Editor command execution adapter is not connected yet.",
      };
    },
  };
}

function createQAAgent(): TeamAgent {
  return {
    id: "qa-agent",
    name: "QA Agent",
    capabilities: ["testing", "verification", "quality-assurance"],
    status: "available",

    async execute(context) {
      return {
        success: true,
        agentId: "qa-agent",
        output: {
          status: "ready",
          taskId: context.taskId,
        },
      };
    },
  };
}

export function registerBuiltInAgents(): void {
  const agents = [
    createMasterDelegateAgent(),
    createResearchAgent(),
    createVideoAgent(),
    createVoiceAgent(),
    createEditorAgent(),
    createQAAgent(),
  ];

  for (const agent of agents) {
    agentRegistry.register(agent);
  }
}
