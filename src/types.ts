export interface Options {
  ghToken: string;
  owner: string;
  repo: string;
  branchToCreate: string;
  branchBase: string;
  emptyCommitMessage?: string;
}
