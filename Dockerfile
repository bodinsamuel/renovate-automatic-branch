# ------------------
# package.json cache
# ------------------
FROM apteno/alpine-jq:2022-03-27 AS deps

# To prevent cache invalidation from changes in fields other than dependencies
COPY package.json /tmp
RUN jq 'walk(if type == "object" then with_entries(select(.key | test("^jest|prettier|eslint|semantic|dotenv|nodemon") | not)) else . end) | { name, dependencies, devDependencies, packageManager }' < /tmp/package.json > /tmp/deps.json

# ------------------
# deps install
# ------------------
FROM node:16.14.2-bullseye AS base

# Setup the app WORKDIR
WORKDIR /app/rab


# Copy and install dependencies separately from the app's code
# To leverage Docker's cache when no dependency has change
COPY --from=deps /tmp/deps.json ./package.json
COPY yarn.lock .yarnrc.yml ./
COPY .yarn .yarn


# Install dev dependencies
RUN true \
  && yarn install

# This step will invalidates cache
COPY . ./

# Build
RUN true \
  && yarn build \
  && rm -rf .yarn/

# ------------------
# final image
# ------------------
FROM node:16.14.2-bullseye as web

LABEL org.opencontainers.image.source = "https://github.com/bodinsamuel/renovate-automatic-branch"

ARG git_hash
ARG version

ENV GIT_HASH ${git_hash:-dev}
ENV VERSION $version

# Do not use root to run the app
USER node

WORKDIR /app/rab

COPY --from=base --chown=node:node /app/rab /app/rab

CMD [ "node", "dist/index.js" ]
