import { RunningResearchCenter } from "../researchcenter";
import { ProjectBuilderCenter } from "../projectbuilder";

export class ResearchProjectBuilderCenter {
  readonly research = new RunningResearchCenter();
  readonly builder = new ProjectBuilderCenter();

  /**
   * Research can become an input to project construction.
   * Actual external research sources and build tools must be connected
   * through authorized adapters.
   */
  createResearchDrivenProject(
    researchId: string,
    projectId: string,
    projectName: string,
    objective: string
  ) {
    const research = this.research.getProject(researchId);

    if (!research) {
      throw new Error(`Research project not found: ${researchId}`);
    }

    return this.builder.createProject({
      id: projectId,
      name: projectName,
      objective,
      state: "REQUIREMENTS",
      tasks: [
        {
          id: `${projectId}-research`,
          title: `Use verified research from ${research.id}`,
          dependencies: [],
          completed: false
        },
        {
          id: `${projectId}-architecture`,
          title: "Create project architecture",
          dependencies: [`${projectId}-research`],
          completed: false
        },
        {
          id: `${projectId}-build`,
          title: "Build project",
          dependencies: [`${projectId}-architecture`],
          completed: false
        },
        {
          id: `${projectId}-verify`,
          title: "Test and independently verify",
          dependencies: [`${projectId}-build`],
          completed: false
        }
      ]
    });
  }
}
