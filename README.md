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
name: Test
on:
  schedule:
    - cron: '0 14 * * 5' # Every friday afternoon

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

### Docker image

```sh
docker run --rm -i \
  -e RAB_GH_TOKEN='${{ secrets.PERSONAL_GITHUB_TOKEN }}' \
  -e RAB_OWNER='${{ github.repository_owner }}' \
  -e RAB_REPO='renovate-automatic-branch' \
  ghcr.io/bodinsamuel/renovate-automatic-branch:1.0.0
```

### Programmatic
