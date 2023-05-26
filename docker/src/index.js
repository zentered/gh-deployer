import { writeFile, readFile, readdir } from 'fs/promises'
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
import { join, resolve } from 'path'

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: parseInt(appId),
    privateKey: atob(appPrivateKey),
    installationId: parseInt(appInstallationId)
  }
})

const [cmd, arg] = process.argv.slice(2)
let environmentUrl = arg
const workspacePath = resolve('/workspace')
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
  await writeFile(
    join(workspacePath, 'deployer.json'),
    JSON.stringify(data, null, 2),
    'utf8'
  )
  await writeFile(join(workspacePath, 'deploy_id'), `${data.id}`, 'utf8')
} else {
  const deploymentId = await readFile('deploy_id', 'utf8')
  if (!deploymentId) {
    throw new Error('No deployment id found')
  }

  if (cmd === 'success' && !environmentUrl) {
    try {
      environmentUrl = await readFile(
        join(workspacePath, 'deployer_environment_url'),
        'utf8'
      )
    } catch (err) {
      console.error('No environment_url found in arguments nor workspace')
    }
  }

  await createDeploymentStatus({
    octokit,
    owner,
    repo,
    deploymentId,
    environment,
    environmentUrl,
    state: cmd,
    ref
  })
}
