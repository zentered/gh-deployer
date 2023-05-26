# GitHub Deployer

GitHub Deployer is a Docker image that can be used to interact with the
[GitHub Deployments API](https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#create-a-deployment).

**Background and full article**:
https://zentered.co/articles/preview-builds-with-cloud-run/

## Usage

This code is meant to be used in a CI/CD pipeline to interact with the GitHub
Deployments API. You need to have or create a GitHub App and build the Docker
image yourself.

### GitHub App

GitHub Deployer uses a GitHub App to authenticate with GitHub. You can create
your own GitHub App in the Developer Settings of your GitHub account.

The following permissions are needed:

- `deployments`
- `pull_requests`
- `contents`

Create & download the private key and run:

```bash
base64 -i your.private-key.pem
```

This is the value you need to set for the `GH_APP_PRIVATE_KEY` environment.

### Docker Build

An example to build & push the image to Google Cloud Artifact Registry. The
static GitHub variables are "baked in" the image to simplify the calls in the
CI.

```bash
docker buildx build --platform linux/amd64 . -t us-central1-docker.pkg.dev/[your-project]/docker/gh-deployer \
  --build-arg GH_APP_ID=111111 \
  --build-arg GH_APP_INSTALLATION_ID=111111 \
  --build-arg GH_APP_PRIVATE_KEY=111111 \
  --build-arg GH_OWNER=zentered

docker push us-central1-docker.pkg.dev/[your-project]/docker/gh-deployer
```

#### Build Variables

| Name                   | Description                  | Required | Default |
| ---------------------- | ---------------------------- | -------- | ------- |
| GH_APP_ID              | GitHub App ID                | Yes      |         |
| GH_APP_INSTALLATION_ID | GitHub App Installation ID   | Yes      |         |
| GH_APP_PRIVATE_KEY     | GitHub App Key               | Yes      |         |
| GH_OWNER               | GitHub Owner (ie `zentered`) | Yes      |         |

#### Environment Variables

| Name                  | Description                                                                     | Required | Default |
| --------------------- | ------------------------------------------------------------------------------- | -------- | ------- |
| REPO_NAME             | GitHub Repo (ie `gh-deployer`)                                                  | Yes      |         |
| REF                   | GitHub Ref (this should be the SHA in your deployment step)                     | Yes      |         |
| ENVIRONMENT           | Environment (ie `production`)                                                   | Yes      |         |
| TRANSIENT_ENVIRONMENT | Transient Environment (is the deployment temporary [true] or permanent [false]) | No       | `false` |
| DESCRIPTION           | Description of the deployment                                                   | No       |         |

### GitHub Deployment & Deployment Status

The first step is to create a new deployment for a given sha or branch with the
`create` command. This will return a deployment ID that you can store in the
workspace of your CI. Afterwards you create "Deployment Status" events with the
deployment URL:

- 'error'
- 'failure'
- 'pending'
- 'in_progress'
- 'queued'
- 'success'

## Example

### Create Deployment

```bash
docker run \
  -e REF=3b2fae5 \
  -e ENVIRONMENT=production \
  -e TRANSIENT_ENVIRONMENT=false \
  -e DESCRIPTION="Deploying to production" \
  zentered/gh-deployer
  create
```

### Create Deployment Status (In Progress)

```bash
docker run \
  -e REF=3b2fae5 \
  -e ENVIRONMENT=production \
  -e TRANSIENT_ENVIRONMENT=false \
  -e DESCRIPTION="Deploying to production" \
  zentered/gh-deployer
  in_progress
  111111
```

### Create Deployment Status (Success with Deployment URL)

```bash
docker run \
  -e REF=3b2fae5 \
  -e ENVIRONMENT=production \
  -e TRANSIENT_ENVIRONMENT=false \
  -e DESCRIPTION="Deploying to production" \
  zentered/gh-deployer
  success
  111111
  https://zentered.co
```

## Use with Google Cloud Platform

1. Create a new Docker repository in
   [Artifact Registry](https://console.cloud.google.com/artifacts)
2. Build, tag & push to the repository
3. Use the image in Cloud Build
