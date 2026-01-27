'use strict'

const test = require('brittle')
const BaseAntspaceContainer = require('../../workers/lib/container/base')
const { getRandomIP } = require('../../mock/initial_states/utils')

test('BaseAntspaceContainer - constructor', (t) => {
  const mockClient = { get: () => {}, request: () => {} }
  const address = getRandomIP()
  const container = new BaseAntspaceContainer({
    client: mockClient,
    address,
    port: 8080
  })

  t.is(container.fetch, mockClient, 'should set fetch client')
  t.is(container.opts.address, address, 'should set address')
  t.is(container.opts.port, 8080, 'should set port')
  t.end()
})

test('BaseAntspaceContainer - switchCoolingSystem enabled', async (t) => {
  const mockClient = {
    get: async (url, options) => ({
      body: { ok: true }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.switchCoolingSystem(true)

  t.is(result.success, true, 'should return success true when operation succeeds')
  t.end()
})

test('BaseAntspaceContainer - switchCoolingSystem disabled', async (t) => {
  const mockClient = {
    get: async (url, options) => ({
      body: { ok: false }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.switchCoolingSystem(false)

  t.absent(result.success, 'should return success false when operation fails')
  t.end()
})

test('BaseAntspaceContainer - resetCoolingSystem', async (t) => {
  const mockClient = {
    get: async (url, options) => ({
      body: { ok: true }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.resetCoolingSystem()

  t.is(result.success, true, 'should return success true when reset succeeds')
  t.end()
})

test('BaseAntspaceContainer - setLiquidSupplyTemperature', async (t) => {
  const mockClient = {
    get: async (url, options) => ({
      body: { ok: true }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.setLiquidSupplyTemperature(25)

  t.is(result.success, true, 'should return success true when temperature set succeeds')
  t.end()
})

test('BaseAntspaceContainer - getSystemData', async (t) => {
  const mockData = {
    supply_liquid_temp: 20,
    circulating_pump: true,
    distribution_box1_power: 1000
  }

  const mockClient = {
    request: async (url, options) => ({
      body: {
        ok: true,
        params: mockData
      }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.getSystemData()

  t.is(result.success, true, 'should return success true')
  t.alike(result.data, mockData, 'should return system data')
  t.end()
})

test('BaseAntspaceContainer - getMinerInfo', async (t) => {
  const mockMinerInfo = {
    miner_count: 10,
    total_hashrate: 1000
  }

  const mockClient = {
    request: async (url, options) => ({
      body: {
        ok: true,
        params: mockMinerInfo
      }
    })
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  const result = await container.getMinerInfo()

  t.is(result.success, true, 'should return success true')
  t.alike(result.data, mockMinerInfo, 'should return miner info')
  t.end()
})

test('BaseAntspaceContainer - HTTP error handling', async (t) => {
  const mockClient = {
    get: async () => {
      throw new Error('Network error')
    }
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  try {
    await container.switchCoolingSystem(true)
    t.fail('should throw error')
  } catch (error) {
    t.is(error.message, 'Network error', 'should propagate HTTP errors')
  }

  t.end()
})

test('BaseAntspaceContainer - URL construction', async (t) => {
  let capturedUrl = ''
  let capturedOptions = {}

  const mockClient = {
    get: async (url, options) => {
      capturedUrl = url
      capturedOptions = options
      return { body: { ok: true } }
    }
  }

  const container = new BaseAntspaceContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  // Mock updateLastSeen
  container.updateLastSeen = () => {}

  await container.switchCoolingSystem(true)

  t.ok(capturedUrl)
  t.alike(capturedOptions, { qs: { operation: 'open' }, encoding: 'json' }, 'should pass correct options')
  t.end()
})
