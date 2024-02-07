import type { AppNotification } from "./AppNotification";

export interface FilterQuery {
  repository: string[];
  author: string[];
  state: string[];
  label: string[];
  subject: string[];
}

export function parseFilterQuery(value: string): FilterQuery {
  const components = value.split(" ");
  const query: FilterQuery = {
    repository: [],
    author: [],
    state: [],
    label: [],
    subject: [],
  };

  for (const component of components) {
    const querySplit = component.split(":");
    if (querySplit.length == 1) {
      continue;
    }

    const [tag, ...rest] = querySplit;
    const remaining = rest.join(":");
    if (remaining == "") {
      continue;
    }

    if (tag == "repo" || tag == "repository") {
      query.repository.push(remaining);
    } else if (tag == "state") {
      query.state.push(remaining);
    } else if (tag == "label") {
      query.label.push(remaining);
    } else if (tag == "subject") {
      query.subject.push(remaining);
    } else if (tag == "author") {
      query.author.push(remaining);
    }
  }

  return query;
}

export function queryToString(query: FilterQuery): string {
  let output = "";

  if (query.repository.length > 0) {
    output += " " + query.repository.map((r) => `repo:${r}`).join(" ");
  }

  if (query.label.length > 0) {
    output += " " + query.label.map((l) => `label:${l}`).join(" ");
  }

  if (query.state.length > 0) {
    output += " " + query.state.map((s) => `state:${s}`).join(" ");
  }

  if (query.subject.length > 0) {
    output += " " + query.subject.map((s) => `subject:${s}`).join(" ");
  }

  if (query.author.length > 0) {
    output += " " + query.author.map((a) => `author:${a}`).join(" ");
  }

  return output;
}

export function mergeQuery(
  source: FilterQuery,
  target: FilterQuery,
): FilterQuery {
  return {
    repository: [...new Set([...source.repository, ...target.repository])],
    label: [...new Set([...source.label, ...target.label])],
    state: [...new Set([...source.state, ...target.state])],
    subject: [...new Set([...source.subject, ...target.subject])],
    author: [...new Set([...source.author, ...target.author])],
  };
}

export function filterQueryFunction(
  notification: AppNotification,
  query: FilterQuery,
): boolean {
  let repositoryShow = true;
  let labelShow = true;
  let stateShow = true;
  let subjectShow = true;
  let authorShow = true;

  if (query.repository.length > 0) {
    repositoryShow = false;

    for (const repository of query.repository) {
      if (
        notification.repository.toLowerCase().includes(repository.toLowerCase())
      ) {
        repositoryShow = true;
      }
    }
  } else {
    repositoryShow = true;
  }

  if (query.label.length > 0) {
    labelShow = false;

    for (const label of query.label) {
      if (
        notification.labels.find(
          (l) => l.label.toLowerCase() == label.toLowerCase(),
        )
      ) {
        labelShow = true;
      }
    }
  } else {
    labelShow = true;
  }

  if (query.state.length > 0) {
    stateShow = false;

    for (const state of query.state) {
      if (notification.state.toLowerCase() == state.toLowerCase()) {
        stateShow = true;
      }
    }
  } else {
    stateShow = true;
  }

  if (query.subject.length > 0) {
    subjectShow = false;

    for (const subject of query.subject) {
      if (notification.message.kind.toLowerCase() == subject.toLowerCase()) {
        subjectShow = true;
      }
    }
  } else {
    subjectShow = true;
  }

  if (query.author.length > 0) {
    authorShow = false;

    for (const author of query.author) {
      if ("author" in notification.message) {
        if (notification.message.author.toLowerCase() == author.toLowerCase()) {
          authorShow = true;
        }
      }
    }
  }

  return repositoryShow && labelShow && stateShow && subjectShow && authorShow;
}
