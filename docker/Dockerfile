# syntax=docker/dockerfile:1

FROM node:20-slim
ENV NODE_ENV production
WORKDIR /usr/src
VOLUME "/workspace"

ARG GH_APP_ID
ARG GH_APP_PRIVATE_KEY
ARG GH_APP_INSTALLATION_ID
ARG GH_OWNER

ENV GH_APP_ID=$GH_APP_ID
ENV GH_APP_PRIVATE_KEY=$GH_APP_PRIVATE_KEY
ENV GH_APP_INSTALLATION_ID=$GH_APP_INSTALLATION_ID
ENV GH_OWNER=$GH_OWNER

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

ENTRYPOINT [ "/usr/local/bin/node" , "/usr/src/src/index.js" ]
