import type{EndToEndExecution,PipelineEvent,PipelineStage}from "../../types/runtime/UniversalExecutionGraph";
export interface StageExecutor{execute(input:unknown):Promise<unknown>}
export interface PipelineDependencies{script?:StageExecutor;assets?:StageExecutor;voice?:StageExecutor;captions?:StageExecutor;timeline?:StageExecutor;effects?:StageExecutor;export?:StageExecutor;projectSave?:StageExecutor}
const ev=(stage:PipelineStage,status:PipelineEvent["status"],progress:number,message?:string,error?:string):PipelineEvent=>({stage,status,progress,timestamp:new Date().toISOString(),message,error});
export class RealEndToEndPipeline{
 constructor(private readonly deps:PipelineDependencies){}
 async execute(x:EndToEndExecution){
  let value:unknown={prompt:x.prompt};x.status="running";x.progress=0;
  x.events.push(ev("prompt","completed",5,"Prompt accepted"));
  const stages:[PipelineStage,StageExecutor|undefined,number][]=[
   ["script",this.deps.script,15],["assets",this.deps.assets,30],["voice",this.deps.voice,45],["captions",this.deps.captions,57],["timeline",this.deps.timeline,70],["effects",this.deps.effects,80],["export",this.deps.export,90],["project-save",this.deps.projectSave,100]];
  for(const [name,executor,progress] of stages){
   if(x.cancelled){x.status="cancelled";x.updatedAt=new Date().toISOString();return x}
   if(!executor){x.status="failed";x.error=`Missing executor for ${name}`;x.events.push(ev(name,"failed",x.progress,undefined,x.error));x.updatedAt=new Date().toISOString();return x}
   try{x.currentStage=name;x.events.push(ev(name,"running",x.progress));value=await executor.execute(value);if(value==null)throw new Error(`Empty output from ${name}`);x.progress=progress;x.events.push(ev(name,"completed",progress));x.updatedAt=new Date().toISOString()}catch(e){x.status="failed";x.error=String(e);x.events.push(ev(name,"failed",x.progress,undefined,x.error));x.updatedAt=new Date().toISOString();return x}
  }
  x.status="completed";x.progress=100;x.currentStage=undefined;x.result=value;x.updatedAt=new Date().toISOString();return x;
 }
}
export const createEndToEndExecution=(id:string,prompt:string,projectId?:string):EndToEndExecution=>{const now=new Date().toISOString();return{id,projectId,prompt,status:"queued",progress:0,events:[],createdAt:now,updatedAt:now,retryCount:0,cancelled:false}}
