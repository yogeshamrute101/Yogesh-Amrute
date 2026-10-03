export type PipelineStage="prompt"|"script"|"assets"|"voice"|"captions"|"timeline"|"effects"|"export"|"project-save";
export type ExecutionStatus="queued"|"running"|"completed"|"failed"|"cancelled"|"retrying";
export interface PipelineEvent{stage:PipelineStage;status:ExecutionStatus;progress:number;timestamp:string;message?:string;error?:string}
export interface EndToEndExecution{id:string;projectId?:string;prompt:string;status:ExecutionStatus;progress:number;currentStage?:PipelineStage;events:PipelineEvent[];createdAt:string;updatedAt:string;result?:unknown;error?:string;retryCount:number;cancelled:boolean}
export const PIPELINE_STAGES:PipelineStage[]=["prompt","script","assets","voice","captions","timeline","effects","export","project-save"];
