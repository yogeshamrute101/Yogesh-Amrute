import fs from"node:fs";import path from"node:path";import{createEndToEndExecution,RealEndToEndPipeline}from"./RealEndToEndPipeline";import type{EndToEndExecution}from"../../types/runtime/UniversalExecutionGraph";
const STORE=path.resolve(process.env.VIDOAI_RUNTIME_DATA_DIR||".vidoai/runtime","generation-executions.json");
const ensure=()=>{fs.mkdirSync(path.dirname(STORE),{recursive:true});if(!fs.existsSync(STORE))fs.writeFileSync(STORE,"[]")};
const read=():EndToEndExecution[]=>{ensure();try{const x=JSON.parse(fs.readFileSync(STORE,"utf8"));return Array.isArray(x)?x:[]}catch{return[]}};
const write=(x:EndToEndExecution[])=>{ensure();const t=STORE+".tmp";fs.writeFileSync(t,JSON.stringify(x,null,2));fs.renameSync(t,STORE)};
export class GenerationJobRuntime{
 constructor(private readonly pipeline:RealEndToEndPipeline){}
 create(prompt:string,projectId?:string){const j=createEndToEndExecution(`gen_${Date.now()}_${Math.random().toString(36).slice(2,9)}`,prompt,projectId);write([...read(),j]);return j}
 get(id:string){return read().find(x=>x.id===id)}
 list(){return read()}
 cancel(id:string){const a=read(),j=a.find(x=>x.id===id);if(!j)return; j.cancelled=true;j.status="cancelled";j.updatedAt=new Date().toISOString();write(a);return j}
 async run(id:string){const a=read(),j=a.find(x=>x.id===id);if(!j)throw new Error(`Generation job not found: ${id}`);if(j.cancelled)return j;j.status="running";write(a);const r=await this.pipeline.execute(j);const latest=read();write(latest.map(x=>x.id===id?r:x));return r}
 async retry(id:string){const j=this.get(id);if(!j)throw new Error(`Generation job not found: ${id}`);j.retryCount++;j.cancelled=false;j.status="retrying";write(read().map(x=>x.id===id?j:x));return this.run(id)}
}
