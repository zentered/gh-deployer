import assert from 'node:assert/strict'
import test from 'node:test'
import createDeployment from '../src/deployment.js'

test('createDeployment', async (t) => {
  const octokit = {
    rest: {
      repos: {
        listDeployments: async () => ({ status: 200, data: [] }),
        createDeployment: async () => ({ data: { id: 123 } })
      }
    }
  }
  const owner = 'test-owner'
  const repo = 'test-repo'
  const ref = 'test-ref'
  const environment = 'test-environment'
  const description = 'test-description'
  const productionEnvironment = true
  const transientEnvironment = false

  const result = await createDeployment({
    octokit,
    owner,
    repo,
    ref,
    environment,
    description,
    productionEnvironment,
    transientEnvironment
  })

  assert.equal(result.id, 123)
})
