import invariant from 'tiny-invariant'

invariant(process.env.GH_APP_ID, 'GH_APP_ID is required')
invariant(process.env.GH_APP_PRIVATE_KEY, 'GH_APP_PRIVATE_KEY is required')
invariant(
  process.env.GH_APP_INSTALLATION_ID,
  'GH_APP_INSTALLATION_ID is required'
)
invariant(process.env.GH_OWNER, 'GH_OWNER is required')
invariant(process.env.REPO_NAME, 'REPO_NAME is required')
invariant(process.env.REF, 'REF is required')
invariant(process.env.ENVIRONMENT, 'ENVIRONMENT is required')

export const appId = process.env.GH_APP_ID
export const appPrivateKey = process.env.GH_APP_PRIVATE_KEY
export const appInstallationId = process.env.GH_APP_INSTALLATION_ID
export const owner = process.env.GH_OWNER
export const repo = process.env.REPO_NAME
export const ref = process.env.REF
export const environment = process.env.ENVIRONMENT
export const productionEnvironment =
  process.env.ENVIRONMENT === 'production' || process.env.ENVIRONMENT === 'prod'
export const transientEnvironment = process.env.TRANSIENT_ENVIRONMENT === 'true'
export const description = process.env.DESCRIPTION
export const availableStates = [
  'error',
  'failure',
  'pending',
  'in_progress',
  'queued',
  'success',
  'create'
]
