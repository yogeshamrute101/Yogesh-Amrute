import {
  PromptAppBuilder,
} from "./PromptAppBuilder";

export class AppBuilderRuntime {
  private readonly builder = new PromptAppBuilder();

  build(prompt: string) {
    const specification =
      this.builder.createSpecification(prompt);

    return {
      verified: true,
      specification,
      executionAllowed: false,
      reason:
        "Specification generation is safe; arbitrary generated code execution is not enabled.",
    };
  }
}
