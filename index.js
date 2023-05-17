import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import {
  appId,
  appPrivateKey,
  appInstallationId,
  owner,
  repo,
  ref,
  environment,
  transientEnvironment,
  description
} from './config.js'

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: parseInt(appId),
    privateKey: atob(appPrivateKey),
    installationId: parseInt(appInstallationId)
  }
})
const { data: appUser } = await octokit.rest.apps.getAuthenticated()

const args = process.argv.slice(2)
const cmd = args[0]

if (cmd === 'create') {
  const res = await app.octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    description,
    transient_environment: transientEnvironment
  })
  console.log(res)
  const data = await res.json()
  console.log(data)
}
