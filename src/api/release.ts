import { makeAuthenticatedGitHubCall } from "./base";

export interface ReleaseRef {
  fullName: string;
  id: number;
}

export interface GhRelease {
  html_url: string;
  author: {
    login: string;
  };
}

export async function getReleaseFromRef(
  releaseRef: ReleaseRef,
): Promise<GhRelease> {
  const response = await makeAuthenticatedGitHubCall(
    `/repos/${releaseRef.fullName}/releases/${releaseRef.id}`,
  );
  return response.json() as Promise<GhRelease>;
}
