export default async function createDeployment({
  octokit,
  owner,
  repo,
  ref,
  environment,
  description,
  productionEnvironment,
  transientEnvironment
}) {
  const res = await octokit.rest.repos.listDeployments({
    owner,
    repo,
    ref,
    environment
  })
  if (res.status !== 200) {
    throw new Error(`GitHub API returned status ${res.status}`)
  } else if (res.data.length !== 0) {
    throw new Error(`Found existing deployment for ${ref} in ${environment}`)
  }
  const { data } = await octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    description,
    production_environment: productionEnvironment,
    transient_environment: transientEnvironment
  })

  return data
}
