import { getCommitFromRef } from "@/api/commit";
import { getIssueFromRef } from "@/api/issue";
import { getPullRequestFromRef } from "@/api/pull";
import { getReleaseFromRef } from "@/api/release";

import type { AppLabel, AppNotification } from "./AppNotification";
import type { GhNotification } from "./GhNotification";
import { fetchNotification } from "@/api/notification";

export async function extractAppNotification(
  ghNotification: GhNotification,
): Promise<AppNotification> {
  const common: AppNotification = {
    id: ghNotification.id,
    unread: ghNotification.unread,
    updatedAt: new Date(ghNotification.updated_at),
    labels: [] as AppLabel[],
    reason: ghNotification.reason,
    repository: ghNotification.repository.full_name,
    url: "",
    message: {
      kind: "Unsupported",
      subject: JSON.stringify(ghNotification.subject, null, 2),
    },
    state: "Unknown",
  };

  if (ghNotification.subject.type == "PullRequest") {
    const components = ghNotification.subject.url.split("/");
    const number = parseInt(components[components.length - 1]);

    const pullRequest = await getPullRequestFromRef({
      fullName: ghNotification.repository.full_name,
      number,
    });

    common.message = {
      kind: "PullRequest",
      title: pullRequest.title,
      number: pullRequest.number,
      author: pullRequest.user.login,
    };

    common.labels = pullRequest.labels.map((l) => ({
      label: l.name,
      color: `#${l.color}`,
      description: l.description,
    }));

    common.state = pullRequest.merged
      ? "Merged"
      : pullRequest.state == "open"
        ? "Open"
        : "Closed";
    common.url = pullRequest.html_url;
  } else if (ghNotification.subject.type == "Issue") {
    const components = ghNotification.subject.url.split("/");
    const number = parseInt(components[components.length - 1]);

    const issue = await getIssueFromRef({
      fullName: ghNotification.repository.full_name,
      number,
    });

    common.message = {
      kind: "Issue",
      title: issue.title,
      number: issue.number,
      author: issue.user.login,
    };

    common.labels = issue.labels.map((l) => ({
      label: l.name,
      color: `#${l.color}`,
      description: l.description,
    }));

    common.state = issue.state == "open" ? "Open" : "Closed";
    common.url = issue.html_url;
  } else if (ghNotification.subject.type == "CheckSuite") {
    const simpleRgx = /^(.*) workflow run (.*) for (.*) branch$/;
    let match = simpleRgx.exec(ghNotification.subject.title);

    if (match) {
      common.message = {
        kind: "Workflow",
        workflow: match[1],
        state: match[2],
        branch: match[3],
        attempt: null,
      };

      common.url = `${ghNotification.repository.html_url}/actions?query=branch%3A${common.message.branch}`;
    }

    const attemptRgx =
      /^(.*) workflow run, Attempt #(\d) (.*) for (.*) branch$/;
    match = attemptRgx.exec(ghNotification.subject.title);

    if (match) {
      common.message = {
        kind: "Workflow",
        workflow: match[1],
        attempt: parseInt(match[2]),
        state: match[3],
        branch: match[4],
      };
    }
  } else if (ghNotification.subject.type == "Release") {
    const components = ghNotification.subject.url.split("/");
    const number = parseInt(components[components.length - 1]);

    const release = await getReleaseFromRef({
      fullName: ghNotification.repository.full_name,
      id: number,
    });

    common.message = {
      kind: "Release",
      title: ghNotification.subject.title,
      author: release.author.login,
    };

    common.url = release.html_url;
  } else if (ghNotification.subject.type == "Commit") {
    const components = ghNotification.subject.url.split("/");
    const ref = components[components.length - 1];

    const commit = await getCommitFromRef({
      fullName: ghNotification.repository.full_name,
      ref,
    });

    common.message = {
      kind: "Commit",
      ref: "abc1234",
      title: ghNotification.subject.title,
      author: commit.author.login,
    };

    common.url = commit.html_url;
  } else if (ghNotification.subject.type == "Discussion") {
    common.message = {
      kind: "Discussion",
      title: ghNotification.subject.title,
    };

    common.url = `${ghNotification.repository.html_url}/discussions`;
  } else if (ghNotification.subject.type == "RepositoryInvitation") {
    common.message = {
      kind: "RepositoryInvitation",
      fullName: ghNotification.repository.full_name,
    };

    common.url = ghNotification.repository.html_url;
  }

  return common;
}

export async function makeUpdatedAppNotification(
  appNotification: AppNotification,
): Promise<AppNotification> {
  const upstreamGhNotification = await fetchNotification(appNotification.id);
  return await extractAppNotification(upstreamGhNotification);
}
