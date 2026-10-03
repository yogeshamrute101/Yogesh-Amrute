export function providerDiagnostics(){
 const e=process.env;
 return [
  ["Gemini/Text",!!e.GEMINI_API_KEY,"GEMINI_API_KEY"],
  ["Video",!!(e.VIDEO_GENERATION_PROVIDER_URL&&e.VIDEO_GENERATION_API_KEY),"VIDEO_GENERATION_*"],
  ["Voice",!!(e.VOICE_PROVIDER_URL&&e.VOICE_PROVIDER_API_KEY),"VOICE_PROVIDER_*"],
  ["Image",!!(e.IMAGE_GENERATION_PROVIDER_URL&&e.IMAGE_GENERATION_API_KEY),"IMAGE_GENERATION_*"],
  ["STT",!!(e.STT_PROVIDER_URL&&e.STT_PROVIDER_API_KEY),"STT_PROVIDER_*"],
  ["Reference/Web",!!(e.REFERENCE_PROVIDER_URL||e.WEB_RESEARCH_PROVIDER_URL),"REFERENCE/WEB_RESEARCH_*"],
 ].map(([cap,configured,source])=>({capability:cap,configured,source}));
}
