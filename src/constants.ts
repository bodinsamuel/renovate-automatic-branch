import type { Options } from './types';

export const defaultOptions: Options = {
  ghToken: process.env.RAB_GH_TOKEN || '',
  owner: process.env.RAB_OWNER || '',
  repo: process.env.RAB_REPO || '',
  branchToCreate:
    process.env.RAB_BRANCH_TO_CREATE || 'chore/renovateBaseBranch',
  branchBase: process.env.RAB_BRANCH_BASE || 'main',
  emptyCommitMessage:
    process.env.RAB_EMPTY_COMMIT_MSG || 'chore: automatic empty commit',
  pullRequestTitle: process.env.RAB_PULL_REQUEST_TITLE || 'fix: dependencies',
  pullRequestBody:
    process.env.RAB_PULL_REQUEST_BODY || 'Weekly dependencies update.',
};
