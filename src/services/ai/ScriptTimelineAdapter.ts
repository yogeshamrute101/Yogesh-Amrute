import type { AiScriptResponse, CaptionItem, ProjectTimeline, TimelineClip } from '../../types';

type ScriptScene = AiScriptResponse['scenes'][number];

function sceneToClip(scene: ScriptScene, index: number): TimelineClip {
  const startTimeMs = Math.max(0, Math.round(scene.startTimeSec * 1000));
  const durationMs = Math.max(1, Math.round(scene.durationSec * 1000));

  return {
    id: `ai-script-scene-${Date.now()}-${index}`,
    type: 'video',
    startTimeMs,
    durationMs,
    url: '',
    name: scene.textOverlay || `AI Scene ${index + 1}`,
  } as unknown as TimelineClip;
}

function sceneToCaption(scene: ScriptScene, index: number): CaptionItem {
  const startTimeMs = Math.max(0, Math.round(scene.startTimeSec * 1000));
  const durationMs = Math.max(1, Math.round(scene.durationSec * 1000));

  return {
    id: `ai-script-caption-${Date.now()}-${index}`,
    startTimeMs,
    endTimeMs: startTimeMs + durationMs,
    text: scene.textOverlay || scene.voiceover || '',
  } as unknown as CaptionItem;
}

export function applyScriptToTimeline(
  script: AiScriptResponse,
  timeline: ProjectTimeline,
): ProjectTimeline {
  const scenes = Array.isArray(script.scenes) ? script.scenes : [];

  const generatedClips = scenes.map(sceneToClip);
  const generatedCaptions = scenes.map(sceneToCaption);

  return {
    ...timeline,
    clips: [...(timeline.clips || []), ...generatedClips],
    captions: [...(timeline.captions || []), ...generatedCaptions],
  };
}
