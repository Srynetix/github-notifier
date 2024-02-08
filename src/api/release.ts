import { LOAD_TEST_NOTIFICATIONS } from "@/env";
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
  if (LOAD_TEST_NOTIFICATIONS) {
    return await getDummyReleaseFromRef(releaseRef);
  }

  const response = await makeAuthenticatedGitHubCall(
    `/repos/${releaseRef.fullName}/releases/${releaseRef.id}`,
  );
  return response.json() as Promise<GhRelease>;
}

async function getDummyReleaseFromRef(
  releaseRef: ReleaseRef,
): Promise<GhRelease> {
  const data = (await import("../../tests/releases.json")).default;
  for (const release of data) {
    if (release.id == releaseRef.id) {
      return release;
    }
  }

  throw new Error(`Release ${JSON.stringify(releaseRef)} not found`);
}
