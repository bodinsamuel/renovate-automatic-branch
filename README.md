# renovate-automatic-branch

Create automatic branch to merge Renovate PRs.

## Prerequisites

Configure your renovate with:

```json
{
  "baseBranches": [
    "chore/renovateBaseBranch"
  ],
}
```

## Usage

### Github Action

```yaml
# With Github Action
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Renovate Automatic Branch
        uses: bodinsamuel/renovate-automatic-branch@v1
        with:
          github-token: YOUR_GITHUB_TOKEN
          repo-owner: YOUR_ORG
          repo-name: YOUR_REPO
```

```yaml
# With Docker image
jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - name: Test
        run: |
          docker run --rm -i \
            -e RAB_GH_TOKEN='${{ secrets.PERSONAL_GITHUB_TOKEN }}' \
            -e RAB_OWNER='${{ github.repository_owner }}' \
            -e RAB_REPO='renovate-automatic-branch' \
            ghcr.io/bodinsamuel/renovate-automatic-branch:latest
```

```yaml
# To automate
name: Renovate
on:
  schedule:
    - cron: '0 14 * * 5' # e.g: Every friday afternoon
```

### Optional parameters

You can customize the behavior of the action by providing the following parameters:

| parameter          | description                                                     | default value                   |
|--------------------|-----------------------------------------------------------------|---------------------------------|
| branch-to-create   | The name of the branch that will be created                     | `chore/renovateBaseBranch`      |
| branch-base        | The name of the branch that will be used as base                | `main`                          |
| empty-commit-msg   | The commit msg that will be created by the script               | `chore: automatic empty commit` |
| pull-request-title | The title of the pull request opened by the action              | `fix: dependencies`             |
| pull-request-body  | The body (description) of the pull request opened by the action | `Weekly dependencies update.`   |

### Docker image

```sh
docker run --rm -i \
  -e RAB_GH_TOKEN='${{ secrets.PERSONAL_GITHUB_TOKEN }}' \
  -e RAB_OWNER='${{ github.repository_owner }}' \
  -e RAB_REPO='renovate-automatic-branch' \
  ghcr.io/bodinsamuel/renovate-automatic-branch:latest
```

Available environment variables: [constants.ts](src/constants.ts)

### Programmatic

```sh
npm install -ED renovate-automatic-branch
```

```ts
import { run } from 'renovate-automatic-branch/run';

run({
  ghToken: process.env.TOKEN,
  // [...]
})
```
