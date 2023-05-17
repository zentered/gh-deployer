export default async function createDeploymentStatus({
  octokit,
  owner,
  repo,
  deploymentId,
  environment,
  environmentUrl,
  state,
  ref
}) {
  if (!deploymentId) {
    const res = await octokit.rest.repos.listDeployments({
      owner,
      repo,
      ref,
      environment
    })
    if (res.status !== 200) {
      throw new Error(`GitHub API returned status ${res.status}`)
    } else if (res.data.length === 0) {
      throw new Error(`No deployments found for ${ref} in ${environment}`)
    } else if (res.data.length > 1) {
      throw new Error(
        `Found more than one deployment for ${ref} in ${environment}`
      )
    }
    deploymentId = res.data[0].id
  }
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
