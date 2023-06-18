import { Octokit } from '@octokit/rest';

import { defaultOptions } from './constants';
import {
  createPR,
  getCommit,
  getRef,
  isCommitAnEmptyCommit,
  resetBranch,
} from './helpers';
import type { Options } from './types';

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
    throw new Error('Error during process');
  }
}
