import type { MovieCharacter, MovieScene } from '../../../types/CinematicPipeline';

export interface ContinuityState {
  characters: Map<string, MovieCharacter>;
  previousScene?: MovieScene;
  worldState: Record<string, string>;
}

export function createContinuityState(
  characters: MovieCharacter[],
): ContinuityState {
  return {
    characters: new Map(characters.map((character) => [character.id, character])),
    worldState: {},
  };
}

export function applyContinuity(
  scene: MovieScene,
  state: ContinuityState,
): MovieScene {
  const previous = state.previousScene;

  const continuityNotes = previous
    ? `Continue naturally from ${previous.id}; preserve character identity, wardrobe, props, lighting direction and spatial relationships.`
    : 'Establish character identity, wardrobe, environment and spatial relationships clearly.';

  state.previousScene = scene;

  return {
    ...scene,
    action: `${scene.action}. ${continuityNotes}`,
  };
}
