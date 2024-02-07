import { makeAuthenticatedGitHubCall } from "./base";

export interface GhCommit {
  html_url: string;
  author: {
    login: string;
  };
  message: string;
}

export interface CommitRef {
  fullName: string;
  ref: string;
}

export async function getCommitFromRef(
  commitRef: CommitRef,
): Promise<GhCommit> {
  const response = await makeAuthenticatedGitHubCall(
    `/repos/${commitRef.fullName}/commits/${commitRef.ref}`,
  );
  return response.json() as Promise<GhCommit>;
}
