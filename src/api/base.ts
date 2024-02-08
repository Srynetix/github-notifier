import { token } from "@/store/token";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

let apiTokenValue = "";
token.subscribe((value) => (apiTokenValue = value));

export interface GitHubCallOptions {
  method?: HttpMethod;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  additionalHeaders?: Record<string, string>;
}

export function makeAuthenticatedGitHubCall(
  route: string,
  options?: GitHubCallOptions,
): Promise<Response> {
  const method = options?.method ?? "GET";
  const additionalHeaders = options?.additionalHeaders ?? {};
  const cache = options?.cache;

  return fetch(`https://api.github.com${route}`, {
    method,
    cache,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiTokenValue}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...additionalHeaders,
    },
  });
}
