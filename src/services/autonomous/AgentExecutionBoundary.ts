export interface AgentExecutor{execute(input:unknown):Promise<unknown>}
export class AgentExecutionBoundary{
 private agents=new Map<string,AgentExecutor>();
 register(name:string,e:AgentExecutor){this.agents.set(name,e)}
 has(name:string){return this.agents.has(name)}
 async execute(task:{id:string;agent:string;input:unknown}){const e=this.agents.get(task.agent);if(!e)return{id:task.id,agent:task.agent,success:false,verified:false,error:`Agent not connected: ${task.agent}`};try{const output=await e.execute(task.input);if(output==null)throw new Error("Agent returned empty output");return{id:task.id,agent:task.agent,success:true,verified:true,output}}catch(error){return{id:task.id,agent:task.agent,success:false,verified:false,error:String(error)}}}
}
