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
  repo: process.env.RAB_REPO || 'crawler',
  branchToCreate:
    process.env.RAB_BRANCH_TO_CREATE || 'chore/renovateBaseBranch',
  branchBase: process.env.RAB_BRANCH_BASE || 'master',
  emptyCommitMessage:
    process.env.RAB_EMPTY_COMMIT_MSG || 'Automatic empty commit',
};

export async function run(args: Partial<Options>): Promise<void> {
  const opts: Options = { ...defaultOptions, ...args };
  if (typeof opts.ghToken === 'undefined') {
    throw new Error('missing `ghToken`');
  }
  if (typeof opts.branchBase === 'undefined') {
    throw new Error('missing `branchBase`');
  }
  if (typeof opts.branchToCreate === 'undefined') {
    throw new Error('missing `branchToCreate`');
  }
  if (typeof opts.owner === 'undefined') {
    throw new Error('missing `owner`');
  }
  if (typeof opts.repo === 'undefined') {
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
