VidoAI Final Integration Audit
================================
Date: 2026-09-21T18:34:45+00:00
Branch: standalone-migration
Commit: 83a90c4
Lint exit: 0
Architecture test exit: 0
Build exit: 0

Remaining markers:
src/core/autonomous/integration/UniversalDispatcher.ts:31:        requiresHandler: true,
src/screens/AiReelMakerScreen.tsx:101:        throw new Error(response.error || 'AI is temporarily unavailable.');
src/screens/AiReelMakerScreen.tsx:115:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
src/components/AiReelMakerModal.tsx:123:        throw new Error(response.error || 'AI is temporarily unavailable.');
src/components/AiReelMakerModal.tsx:140:      setErrorMessage(err.message || 'AI is temporarily unavailable.');
src/components/AiCoPilotModal.tsx:75:        throw new Error(res.error || 'AI is temporarily unavailable.');
src/components/AiCoPilotModal.tsx:93:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
src/services/aiProvider/GeminiProvider.ts:101:          error: 'AI is temporarily unavailable.',
src/services/aiProvider/GeminiProvider.ts:110:          error: json?.error || 'AI is temporarily unavailable.',
src/services/aiProvider/GeminiProvider.ts:153:        error: 'AI is temporarily unavailable.',
src/services/aiProvider/GeminiProvider.ts:200:          error: json?.error || 'AI is temporarily unavailable.',
src/services/aiProvider/GeminiProvider.ts:229:            : err?.message || 'AI is temporarily unavailable.';
aggregation/final-release/deep-audit/feature-wiring.md:3:src/core/autonomous/integration/UniversalDispatcher.ts:31:        requiresHandler: true,
aggregation/final-release/deep-audit/feature-wiring.md:6:src/components/AiReelMakerModal.tsx:123:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/final-release/deep-audit/feature-wiring.md:7:src/components/AiReelMakerModal.tsx:140:      setErrorMessage(err.message || 'AI is temporarily unavailable.');
aggregation/final-release/deep-audit/feature-wiring.md:13:src/components/AiCoPilotModal.tsx:75:        throw new Error(res.error || 'AI is temporarily unavailable.');
aggregation/final-release/deep-audit/feature-wiring.md:14:src/components/AiCoPilotModal.tsx:93:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2368:src/screens/AiReelMakerScreen.tsx:101:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2370:src/screens/AiReelMakerScreen.tsx:115:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2819:src/components/AiReelMakerModal.tsx:123:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2821:src/components/AiReelMakerModal.tsx:140:      setErrorMessage(err.message || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2978:src/components/AiCoPilotModal.tsx:75:        throw new Error(res.error || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:2982:src/components/AiCoPilotModal.tsx:93:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/final-release/feature-map.txt:3431:src/services/aiProvider/GeminiProvider.ts:101:          error: 'AI is temporarily unavailable.',
aggregation/final-release/feature-map.txt:3434:src/services/aiProvider/GeminiProvider.ts:110:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/final-release/feature-map.txt:3442:src/services/aiProvider/GeminiProvider.ts:153:        error: 'AI is temporarily unavailable.',
aggregation/final-release/feature-map.txt:3450:src/services/aiProvider/GeminiProvider.ts:200:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/final-release/feature-map.txt:3456:src/services/aiProvider/GeminiProvider.ts:229:            : err?.message || 'AI is temporarily unavailable.';
aggregation/project-aggregate.txt:1348:        throw new Error(res.error || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:1366:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:1737:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:1754:      setErrorMessage(err.message || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:5825:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:5839:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/project-aggregate.txt:9804:          error: 'AI is temporarily unavailable.',
aggregation/project-aggregate.txt:9813:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/project-aggregate.txt:9856:        error: 'AI is temporarily unavailable.',
aggregation/project-aggregate.txt:9892:          error: 'AI is temporarily unavailable.',
aggregation/project-aggregate.txt:9901:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/project-aggregate.txt:9926:        error: 'AI is temporarily unavailable.',
aggregation/final-feature-audit.txt:19:src/screens/AiReelMakerScreen.tsx:101:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:20:src/screens/AiReelMakerScreen.tsx:115:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:23:src/components/AiReelMakerModal.tsx:123:        throw new Error(response.error || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:24:src/components/AiReelMakerModal.tsx:140:      setErrorMessage(err.message || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:30:src/components/AiCoPilotModal.tsx:75:        throw new Error(res.error || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:31:src/components/AiCoPilotModal.tsx:93:      setErrorMsg(err.message || 'AI is temporarily unavailable.');
aggregation/final-feature-audit.txt:43:src/services/aiProvider/GeminiProvider.ts:101:          error: 'AI is temporarily unavailable.',
aggregation/final-feature-audit.txt:45:src/services/aiProvider/GeminiProvider.ts:110:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/final-feature-audit.txt:47:src/services/aiProvider/GeminiProvider.ts:153:        error: 'AI is temporarily unavailable.',
aggregation/final-feature-audit.txt:52:src/services/aiProvider/GeminiProvider.ts:200:          error: json?.error || 'AI is temporarily unavailable.',
aggregation/final-feature-audit.txt:54:src/services/aiProvider/GeminiProvider.ts:229:            : err?.message || 'AI is temporarily unavailable.';
