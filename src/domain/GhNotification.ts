export interface PullRequestSubject {
  title: string;
  url: string;
  type: "PullRequest";
}

export interface CheckSuiteSubject {
  title: string;
  type: "CheckSuite";
}

export interface IssueSubject {
  title: string;
  url: string;
  type: "Issue";
}

export interface ReleaseSubject {
  title: string;
  url: string;
  type: "Release";
}

export interface CommitSubject {
  title: string;
  url: string;
  type: "Commit";
}

export interface DiscussionSubject {
  title: string;
  type: "Discussion";
}

export interface RepositoryInvitationSubject {
  title: string;
  type: "RepositoryInvitation";
}

export type GhNotificationSubject =
  | PullRequestSubject
  | CheckSuiteSubject
  | IssueSubject
  | ReleaseSubject
  | CommitSubject
  | RepositoryInvitationSubject
  | DiscussionSubject;

export interface GhOwner {
  login: string;
  type: string;
  id: number;
}

export interface GhRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GhOwner;
  html_url: string;
}

export interface GhNotification {
  id: string;
  unread: boolean;
  reason: string;
  updated_at: string;
  last_read_at: string | null;
  subject: GhNotificationSubject;
  repository: GhRepository;
}
