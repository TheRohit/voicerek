/* eslint-disable prefer-const */
import { DeepgramError, createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  const url = request.url;
  const deepgram = createClient(env.DEEPGRAM_API_KEY);

  let { result: projectsResult, error: projectsError } =
    await deepgram.manage.getProjects();

  if (projectsError) {
    return NextResponse.json(projectsError);
  }

  const project = projectsResult?.projects[0];

  if (!project) {
    return NextResponse.json(
      new DeepgramError(
        "Cannot find a Deepgram project. Please create a project first.",
      ),
    );
  }

  let { result: newKeyResult, error: newKeyError } =
    await deepgram.manage.createProjectKey(project.project_id, {
      comment: `apiKey-${Date.now()}`,
      scopes: ["usage:write"],
      time_to_live_in_seconds: 1800,
    });

  if (newKeyError) {
    return NextResponse.json(newKeyError);
  }

  return NextResponse.json({ ...newKeyResult, url });
}
