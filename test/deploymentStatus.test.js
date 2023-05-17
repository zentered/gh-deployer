import assert from 'node:assert/strict'
import { test } from 'node:test'
import createDeploymentStatus from '../src/deploymentStatus.js'

test('createDeploymentStatus', async () => {
  const octokit = {
    rest: {
      repos: {
        listDeployments: async () => ({ status: 200, data: [{ id: 123 }] }),
        createDeploymentStatus: async () => ({ status: 201, data: { id: 456 } })
      }
    }
  }

  const owner = 'test-owner'
  const repo = 'test-repo'
  const deploymentId = 123
  const environment = 'test-environment'
  const environmentUrl = 'https://example.com'
  const state = 'success'
  const ref = 'test-ref'

  const result = await createDeploymentStatus({
    octokit,
    owner,
    repo,
    deploymentId,
    environment,
    environmentUrl,
    state,
    ref
  })

  assert.equal(result.id, 456)
})
