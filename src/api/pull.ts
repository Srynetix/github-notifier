import { LOAD_TEST_NOTIFICATIONS } from "@/env";
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
  if (LOAD_TEST_NOTIFICATIONS) {
    return await getDummyPullRequestFromRef(pullRef);
  }

  const response = await makeAuthenticatedGitHubCall(
    `/repos/${pullRef.fullName}/pulls/${pullRef.number}`,
  );
  return response.json() as Promise<GhPullRequest>;
}

async function getDummyPullRequestFromRef(
  pullRef: PullRequestRef,
): Promise<GhPullRequest> {
  const data = (await import("../../tests/pullRequests.json")).default;
  for (const repo of data) {
    if (pullRef.fullName == repo.full_name && pullRef.number == repo.number) {
      return repo;
    }
  }

  throw new Error(`Pull request ${JSON.stringify(pullRef)} not found`);
}
