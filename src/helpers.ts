import type { Octokit } from '@octokit/rest';

import type { Options } from './types';

export function wait(waitTime: number): Promise<void> {
  if (waitTime <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, waitTime);
  });
}

export async function getRef(
  octokit: Octokit,
  branch: string,
  opts: Options
): Promise<string | false> {
  try {
    const ref = await octokit.git.getRef({
      owner: opts.owner,
      repo: opts.repo,
      ref: `heads/${branch}`,
    });
    return ref.data.object.sha;
  } catch (err) {
    if (!(err instanceof Error) || (err as any).status !== 404) {
      throw err;
    }
  }

  return false;
}

export async function createBranch(
  octokit: Octokit,
  sha: string,
  opts: Options
): Promise<any> {
  const create = await octokit.git.createRef({
    owner: opts.owner,
    repo: opts.repo,
    ref: `refs/heads/${opts.branchToCreate}`,
    sha,
  });
  return create;
}

export async function deleteRef(octokit: Octokit, opts: Options): Promise<any> {
  console.log(`Deleting ref for ${opts.branchToCreate}`);
  const ref = await octokit.git.deleteRef({
    owner: opts.owner,
    repo: opts.repo,
    ref: `heads/${opts.branchToCreate}`,
  });
  return ref;
}

export async function updateRef(
  octokit: Octokit,
  sha: string,
  opts: Options
): Promise<any> {
  console.log(`Changing ref for ${opts.branchToCreate} to`, sha);
  const ref = await octokit.git.updateRef({
    owner: opts.owner,
    repo: opts.repo,
    ref: `heads/${opts.branchToCreate}`,
    sha,
  });
  return ref;
}

export async function getCommit(
  octokit: Octokit,
  sha: string,
  opts: Options
): Promise<any> {
  const commit = await octokit.git.getCommit({
    owner: opts.owner,
    repo: opts.repo,
    commit_sha: sha,
  });
  return commit.data;
}

export function isCommitAnEmptyCommit(commit: any, opts: Options): boolean {
  return commit.message.search(opts.emptyCommitMessage!) >= 0;
}

export async function createEmptyCommit(
  octokit: Octokit,
  refCommit: any,
  opts: Options
): Promise<any> {
  console.log('Creating empty commit');
  const commit = await octokit.git.createCommit({
    owner: opts.owner,
    repo: opts.repo,
    message: opts.emptyCommitMessage || '',
    tree: refCommit.tree.sha,
    parents: [refCommit.sha],
  });
  return commit.data;
}

export async function createPR(octokit: Octokit, opts: Options): Promise<any> {
  // Next monday
  const date = new Date();
  date.setDate(date.getDate() + 3);

  const title = `fix: dependencies ${date.toISOString().split('T')[0]}`;
  const { data } = await octokit.pulls.create({
    owner: opts.owner,
    repo: opts.repo,
    title,
    body: opts.pullRequestBody || 'Weekly dependencies update.',
    head: opts.branchToCreate,
    base: opts.branchBase,
  });
  return data;
}

export async function resetBranch(
  octokit: Octokit,
  refBase: string,
  exists: boolean,
  opts: Options
): Promise<void> {
  if (exists) {
    console.log('Deleting branch');
    await deleteRef(octokit, opts);
    await wait(5000);
  }

  console.log('Creating branch');

  await createBranch(octokit, refBase, opts);

  const commit = await getCommit(octokit, refBase, opts);

  const empty = await createEmptyCommit(octokit, commit, opts);
  await updateRef(octokit, empty.sha, opts);
}
