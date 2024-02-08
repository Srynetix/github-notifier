export interface AppMessagePullRequest {
  kind: "PullRequest";
  number: number;
  title: string;
  author: string;
}

export interface AppMessageRelease {
  kind: "Release";
  title: string;
  author: string;
}

export interface AppMessageCommit {
  kind: "Commit";
  ref: string;
  title: string;
  author: string;
}

export interface AppMessageDiscussion {
  kind: "Discussion";
  title: string;
}

export interface AppMessageIssue {
  kind: "Issue";
  number: number;
  title: string;
  author: string;
}

export interface AppMessageWorkflow {
  kind: "Workflow";
  workflow: string;
  attempt: number | null;
  state: string;
  branch: string;
}

export interface AppMessageRepositoryInvitation {
  kind: "RepositoryInvitation";
  fullName: string;
}

export interface AppMessageUnsupported {
  kind: "Unsupported";
  subject: string;
}

export type AppMessage =
  | AppMessagePullRequest
  | AppMessageWorkflow
  | AppMessageRelease
  | AppMessageUnsupported
  | AppMessageCommit
  | AppMessageIssue
  | AppMessageRepositoryInvitation
  | AppMessageDiscussion;

export function appMessageToString(message: AppMessage): string {
  if (message.kind == "PullRequest") {
    return `Pull request #${message.number}\n${message.title}\nby @${message.author}`;
  } else if (message.kind == "Commit") {
    return `Commit ${message.ref}\n${message.title}\nby @${message.author}`;
  } else if (message.kind == "Workflow") {
    let output = `Workflow ${message.workflow}`;
    if (message.attempt) {
      output = `${output} attempt #${message.attempt}`;
    }
    return `${output} ${message.state}\nfor branch ${message.branch}`;
  } else if (message.kind == "Release") {
    return `New release ${message.title}\nby @${message.author}`;
  } else if (message.kind == "Issue") {
    return `Issue #${message.number}\n${message.title}\nby @${message.author}`;
  } else if (message.kind == "Discussion") {
    return `Discussion ${message.title}`;
  } else if (message.kind == "RepositoryInvitation") {
    return `Invitation on repository\n${message.fullName}`;
  } else {
    return `Unsupported notification\n${message.subject}`;
  }
}
