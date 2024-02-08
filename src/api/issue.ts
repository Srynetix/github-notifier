import { makeAuthenticatedGitHubCall } from "./base";
import type { GhLabel } from "./label";

export interface GhIssue {
  number: number;
  state: string;
  locked: boolean;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  labels: GhLabel[];
}

export interface IssueRef {
  fullName: string;
  number: number;
}

export async function getIssueFromRef(issueRef: IssueRef): Promise<GhIssue> {
  const response = await makeAuthenticatedGitHubCall(
    `/repos/${issueRef.fullName}/issues/${issueRef.number}`,
  );
  return response.json() as Promise<GhIssue>;
}
