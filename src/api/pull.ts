import { makeAuthenticatedGitHubCall } from "./base";
import type { GhLabel } from "./label";

export interface GhPullRequest {
  number: number;
  state: string;
  locked: boolean;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  merged: boolean;
  labels: GhLabel[];
}

export interface PullRequestRef {
  fullName: string;
  number: number;
}

export async function getPullRequestFromRef(
  pullRef: PullRequestRef,
): Promise<GhPullRequest> {
  const response = await makeAuthenticatedGitHubCall(
    `/repos/${pullRef.fullName}/pulls/${pullRef.number}`,
  );
  return response.json() as Promise<GhPullRequest>;
}
