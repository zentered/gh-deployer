resource "google_cloudbuild_trigger" "preview" {
  name        = "preview"
  project     = var.project
  location    = var.region
  description = "Preview Deployment"

  github {
    owner = "[github-org]"
    name  = "[github-repo]"
    pull_request {
      branch          = "^main$"
      comment_control = "COMMENTS_ENABLED"
    }
  }

  build {
    timeout = "1200s"
    step {
      name = "us-central1-docker.pkg.dev/${var.project}/docker/gh-deployer:latest"
      env = [
        "REPO_NAME=$REPO_NAME",
        "TRANSIENT_ENVIRONMENT=true",
        "DESCRIPTION=Deploying to Google Cloud Run",
        "ENVIRONMENT=preview",
        "REF=$REF_NAME"
      ]
      args = [
        "create"
      ]
    }

    step {
      name = "us-central1-docker.pkg.dev/${var.project}/docker/gh-deployer:latest"
      env = [
        "REPO_NAME=$REPO_NAME",
        "ENVIRONMENT=preview",
        "REF=$REF_NAME"
      ]
      args = [
        "pending"
      ]
    }

    step {
      name = "gcr.io/kaniko-project/executor:latest"
      args = [
        "--destination=${var.region}-docker.pkg.dev/${var.project}/docker/${var.name}:$SHORT_SHA",
        "--use-new-run"
      ]
    }

    step {
      name = "us-central1-docker.pkg.dev/${var.project}/docker/gh-deployer:latest"
      env = [
        "REPO_NAME=$REPO_NAME",
        "ENVIRONMENT=preview",
        "REF=$REF_NAME"
      ]
      args = [
        "in_progress"
      ]
    }

    step {
      name       = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      entrypoint = "gcloud"
      args = [
        "run",
        "deploy",
        "preview-$_PR_NUMBER",
        "--image=${var.region}-docker.pkg.dev/${var.project}/docker/${var.name}:$SHORT_SHA",
        "--region=${var.region}",
        "--memory=512Mi",
        "--platform=managed",
        "--allow-unauthenticated"
      ]
    }

    step {
      name = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      env = [
        "PR_NUMBER=$_PR_NUMBER"
      ]
      script = "gcloud run services list --project ${var.project} --filter preview-$PR_NUMBER --format \"value(status.address.url)\" > /workspace/deployer_environment_url"
    }

    step {
      name = "us-central1-docker.pkg.dev/${var.project}/docker/gh-deployer:latest"
      env = [
        "REPO_NAME=$REPO_NAME",
        "ENVIRONMENT=preview",
        "REF=$REF_NAME"
      ]
      args = [
        "success"
      ]
    }
  }
}
