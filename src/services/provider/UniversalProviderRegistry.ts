export type ProviderCapability="text"|"image"|"video"|"audio"|"voice"|"speech-to-text"|"image-to-video"|"text-to-video";
export interface UniversalProvider{id:string;capabilities:ProviderCapability[];configured():boolean;healthy():Promise<boolean>;execute(capability:ProviderCapability,input:unknown):Promise<unknown>}
export class UniversalProviderRegistry{
 private providers:UniversalProvider[]=[];
 register(p:UniversalProvider){if(!this.providers.some(x=>x.id===p.id))this.providers.push(p)}
 list(c?:ProviderCapability){return this.providers.filter(p=>!c||p.capabilities.includes(c))}
 async execute(c:ProviderCapability,input:unknown){
  const candidates=this.list(c).filter(p=>p.configured());
  if(!candidates.length)throw new Error(`No configured provider for capability: ${c}`);
  let last:unknown;
  for(const p of candidates){try{if(!(await p.healthy()))continue;const r=await p.execute(c,input);if(r==null)throw new Error(`Provider ${p.id} returned empty output`);return r}catch(e){last=e}}
  throw new Error(`All configured providers failed for ${c}: ${String(last)}`);
 }
}
