import { Octokit } from '@octokit/rest';

import {
  createPR,
  getCommit,
  getRef,
  isCommitAnEmptyCommit,
  resetBranch,
} from './helpers';
import type { Options } from './types';

const defaultOptions: Options = {
  ghToken: process.env.RAB_GH_TOKEN || '',
  owner: process.env.RAB_OWNER || '',
  repo: process.env.RAB_REPO || '',
  branchToCreate:
    process.env.RAB_BRANCH_TO_CREATE || 'chore/renovateBaseBranch',
  branchBase: process.env.RAB_BRANCH_BASE || 'main',
  emptyCommitMessage:
    process.env.RAB_EMPTY_COMMIT_MSG || 'chore: automatic empty commit',
  pullRequestBody:
    process.env.RAB_PULL_REQUEST_BODY || 'Weekly dependencies update.',
};

export async function run(args: Partial<Options>): Promise<void> {
  const opts: Options = { ...defaultOptions, ...args };
  if (!opts.ghToken) {
    throw new Error('missing `ghToken`');
  }
  if (!opts.branchBase) {
    throw new Error('missing `branchBase`');
  }
  if (!opts.branchToCreate) {
    throw new Error('missing `branchToCreate`');
  }
  if (!opts.owner) {
    throw new Error('missing `owner`');
  }
  if (!opts.repo) {
    throw new Error('missing `repo`');
  }

  try {
    const octokit = new Octokit({
      auth: `token ${opts.ghToken}`,
    });

    const refBase = await getRef(octokit, opts.branchBase, opts);
    const refTarget = await getRef(octokit, opts.branchToCreate, opts);
    console.log(opts.branchToCreate, 'is at', refBase);
    console.log(opts.branchBase, 'is at', refTarget);

    if (!refBase) {
      console.error('no sha for base branch');
      return;
    }

    if (refTarget) {
      console.log('Branch exists');
      const commit = await getCommit(octokit, refTarget, opts);

      if (isCommitAnEmptyCommit(commit, opts)) {
        console.log('Empty commit exists');
        return;
      }
    }

    await resetBranch(octokit, refBase, Boolean(refTarget), opts);

    console.log('Creating pull request');
    await createPR(octokit, opts);
  } catch (err) {
    console.error(err);
  }
}
