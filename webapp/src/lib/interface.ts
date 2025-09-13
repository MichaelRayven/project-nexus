interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string | null;
}

interface User {
  login: string;
  id: number;
  node_id: string;
  [key: string]: any; // For additional properties
}

interface IssueDependenciesSummary {
  blocked_by: number;
  total_blocked_by: number;
  blocking: number;
  [key: string]: any; // For additional properties
}

interface SubIssuesSummary {
  total: number;
  completed: number;
  percent_completed: number;
}

interface PullRequest {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
}

interface GitHubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee: User | null;
  assignees: User[];
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  active_lock_reason: string | null;
  body: string;
  timeline_url: string;
  state_reason: string | null;
  score: number;
  issue_dependencies_summary: IssueDependenciesSummary;
  sub_issues_summary: SubIssuesSummary;
  pull_request: PullRequest | null;
}
