export default async function createDeploymentStatus({
  octokit,
  owner,
  repo,
  deploymentId,
  environment,
  environmentUrl,
  state
}) {
  const statusObj = {
    owner,
    repo,
    environment,
    deployment_id: deploymentId,
    state
  }
  if (environmentUrl) {
    statusObj.environment_url = environmentUrl
  }
  const statusResponse = await octokit.rest.repos.createDeploymentStatus(
    statusObj
  )
  if (statusResponse.status !== 201) {
    throw new Error(`GitHub API returned status ${res.status}`)
  }
  return statusResponse.data
}
