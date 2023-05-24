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

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
ENTRYPOINT [ "/usr/local/bin/node" , "/usr/src/src/index.js" ]
