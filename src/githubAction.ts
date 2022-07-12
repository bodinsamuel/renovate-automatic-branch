import * as core from '@actions/core';

import { run } from './run';

(async (): Promise<void> => {
  await run({
    ghToken: core.getInput('github-token'),
    owner: core.getInput('repo-owner'),
    repo: core.getInput('repo-name'),
    branchToCreate: core.getInput('branch-to-create'),
    branchBase: core.getInput('branch-base'),
    emptyCommitMessage: core.getInput('empty-commit-msg'),
    pullRequestBody: core.getInput('pull-request-body'),
  });
})();
