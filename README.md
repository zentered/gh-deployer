# GitHub Deployer

GitHub Deployer is a Docker image that can be used to interact with the
[GitHub Deployments API](https://docs.github.com/en/rest/deployments/deployments?apiVersion=2022-11-28#create-a-deployment).

## Usage

### GitHub App

GitHub Deployer uses a GitHub App to authenticate with GitHub. You can create
your own GitHub App in the Developer Settings of your GitHub account.

```txt
Replace ORGANIZATION with your organization name

https://github.com/organizations/ORGANIZATION/settings/apps/new?name=gh-deployer&url=https://zentered.co&description=A%20GH Deployer%20App&request_oauth_on_install=false&public=false&issues=write&metadata=read&contents=write&deployments=write&pull_requests=write&webhook_active=false
```

This helps with the required permissions, feel free to use another name,
description domain etc. as this bot will show up for all deployments on your
repos.

The following permissions are needed:

- `deployments`

The following permissions are recommended (for future features):

- `pull_requests`
- `contents`
- `metadata`
- `issues`

Create & download the private key and run:

```bash
base64 -i your.private-key.pem
```

This is the value you need to set for the `GH_APP_PRIVATE_KEY` environment.

### Environment Variables

| Name                  | Description                                                                     | Required | Default |
| --------------------- | ------------------------------------------------------------------------------- | -------- | ------- |
| GH_APP_ID             | GitHub App ID                                                                   | Yes      |         |
| GH_APP_PRIVATE_KEY    | GitHub App Key                                                                  | Yes      |         |
| GH_OWNER              | GitHub Owner (ie `zentered`)                                                    | Yes      |         |
| GH_REPO               | GitHub Repo (ie `gh-deployer`)                                                  | Yes      |         |
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

### Example

#### Create Deployment

```bash
docker run \
  -e GH_APP_ID=1234 \
  -e GH_APP_PRIVATE_KEY=base64-encoded-private-key \
  -e GH_OWNER=zentered \
  -e GH_REPO=gh-deployer \
  -e REF=3b2fae5 \
  -e ENVIRONMENT=production \
  -e TRANSIENT_ENVIRONMENT=false \
  -e DESCRIPTION="Deploying to production" \
  zentered/gh-deployer
  create
```

#### Create Deployment Status (In Progress)

```bash
docker run \
  -e GH_APP_ID=1234 \
  -e GH_APP_PRIVATE_KEY=base64-encoded-private-key \
  -e GH_OWNER=zentered \
  -e GH_REPO=gh-deployer \
  -e REF=3b2fae5 \
  -e ENVIRONMENT=production \
  -e TRANSIENT_ENVIRONMENT=false \
  -e DESCRIPTION="Deploying to production" \
  zentered/gh-deployer
  in_progress
  111111
```

#### Create Deployment Status (Success with Deployment URL)

```bash
docker run \
  -e GH_APP_ID=1234 \
  -e GH_APP_PRIVATE_KEY=base64-encoded-private-key \
  -e GH_OWNER=zentered \
  -e GH_REPO=gh-deployer \
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

```bash
docker build . -t us-central1-docker.pkg.dev/[your-project]/docker/gh-deployer
docker push us-central1-docker.pkg.dev/[your-project]/docker/gh-deployer
```
