import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import createDeploymentStatus from './deploymentStatus.js'
import createDeployment from './deployment.js'
import {
  appId,
  appPrivateKey,
  appInstallationId,
  owner,
  repo,
  ref,
  environment,
  productionEnvironment,
  transientEnvironment,
  description,
  availableStates
} from './config.js'

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: parseInt(appId),
    privateKey: atob(appPrivateKey),
    installationId: parseInt(appInstallationId)
  }
})

const [cmd, deploymentId, environmentUrl] = process.argv.slice(2)
if (!availableStates.includes(cmd)) {
  throw new Error(
    'Invalid command. Available commands: ' + availableStates.join(', ')
  )
}

if (cmd === 'create') {
  const data = await createDeployment({
    octokit,
    owner,
    repo,
    ref,
    environment,
    description,
    productionEnvironment,
    transientEnvironment
  })
  console.log(data)
} else {
  const data = await createDeploymentStatus({
    octokit,
    owner,
    repo,
    deploymentId,
    environment,
    environmentUrl,
    state: cmd,
    ref
  })
  console.log(data)
}
