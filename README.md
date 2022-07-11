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
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Renovate Automatic Branch
        uses: bodinsamuel/renovate-automatic-branch@v1.0.2
        with:
          github-token: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
          repo-owner: bodinsamuel
          repo-name: renovate-automatic-branch
```

```yaml
# With Docker image
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test
        run: |
          docker run --rm -i \
            -e RAB_GH_TOKEN='${{ secrets.PERSONAL_GITHUB_TOKEN }}' \
            -e RAB_OWNER='${{ github.repository_owner }}' \
            -e RAB_REPO='renovate-automatic-branch' \
            ghcr.io/bodinsamuel/renovate-automatic-branch:1.0.0
```

```yaml
# To automate
name: Test
on:
  schedule:
    - cron: '0 14 * * 5' # e.g: Every friday afternoon
```

### Docker image

```sh
docker run --rm -i \
  -e RAB_GH_TOKEN='${{ secrets.PERSONAL_GITHUB_TOKEN }}' \
  -e RAB_OWNER='${{ github.repository_owner }}' \
  -e RAB_REPO='renovate-automatic-branch' \
  ghcr.io/bodinsamuel/renovate-automatic-branch:1.0.0
```

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
