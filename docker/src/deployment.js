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
  const { data } = await octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    description,
    required_contexts: [],
    production_environment: productionEnvironment,
    transient_environment: transientEnvironment
  })

  return data
}
