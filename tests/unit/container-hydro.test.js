'use strict'

const test = require('brittle')
const HydroContainer = require('../../workers/lib/container/hydro')
const { getRandomIP } = require('../../mock/initial_states/utils')

// Helper function to create a basic container
function createBasicContainer () {
  return new HydroContainer({
    client: { get: () => {}, request: () => {} },
    address: getRandomIP(),
    port: 8080
  })
}

// Helper function to create mock system data
function createMockSystemData (overrides = {}) {
  return {
    data: {
      power_fault: false,
      circulating_pump: false,
      distribution_box1_power: 0,
      distribution_box2_power: 0,
      freezing_alarm: false,
      antbox_internal_temp: 25,
      antbox_internal_humidity: 60,
      supply_liquid_temp: 20,
      colding_tower_inlet_temp: 18,
      running_mode: 'auto',
      supply_liquid_set_temp: 22,
      ...overrides
    }
  }
}

// Helper function to create mock miner info
function createMockMinerInfo () {
  return {
    data: {
      miner_count: 10,
      total_hashrate: 1000
    }
  }
}

// Helper function to create a mock client
function createMockClient (systemData, minerInfo) {
  return {
    request: async (url, options) => {
      if (options.qs.operation === 'coolerState') {
        return { body: { ok: true, params: systemData.data } }
      } else if (options.qs.operation === 'minerInfo') {
        return { body: { ok: true, params: minerInfo.data } }
      }
    }
  }
}

// Helper function to create a container for _prepSnap tests
async function createContainerForPrepSnap (systemDataOverrides = {}) {
  const mockSystemData = createMockSystemData(systemDataOverrides)
  const mockMinerInfo = createMockMinerInfo()
  const mockClient = createMockClient(mockSystemData, mockMinerInfo)

  const container = new HydroContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  container.updateLastSeen = () => {}

  return { container, mockSystemData, mockMinerInfo }
}

test('HydroContainer - error mapping', (t) => {
  const container = createBasicContainer()

  // Test power_fault error
  const dataWithPowerFault = {
    power_fault: true,
    liquid_level_low: false,
    circulating_pump_fault: false
  }

  const result1 = container._prepErrors(dataWithPowerFault)
  t.ok(result1.isErrored, 'should detect power fault error')
  t.is(result1.errors.length, 1, 'should have one error')
  t.is(result1.errors[0].name, 'power_fault', 'should map to correct error name')

  // Test multiple errors
  const dataWithMultipleErrors = {
    power_fault: true,
    liquid_level_low: true,
    fan1_fault: true,
    cooling_tower_fan1_fault: true
  }

  const result2 = container._prepErrors(dataWithMultipleErrors)
  t.ok(result2.isErrored, 'should detect multiple errors')
  t.is(result2.errors.length, 4, 'should have four errors')

  const errorNames = result2.errors.map(e => e.name)
  t.ok(errorNames.includes('power_fault'), 'should include power_fault')
  t.ok(errorNames.includes('liquid_level_low'), 'should include liquid_level_low')
  t.ok(errorNames.includes('fan_fault'), 'should include fan_fault')
  t.ok(errorNames.includes('cooling_tower_fan_fault'), 'should include cooling_tower_fan_fault')

  // Test no errors
  const dataWithNoErrors = {
    power_fault: false,
    liquid_level_low: false,
    circulating_pump_fault: false
  }

  const result3 = container._prepErrors(dataWithNoErrors)
  t.absent(result3.isErrored, 'should not detect errors when none present')
  t.is(result3.errors.length, 0, 'should have no errors')

  t.end()
})

test('HydroContainer - error messages', (t) => {
  const container = createBasicContainer()

  const dataWithMessages = {
    fan1_fault: true,
    fan2_fault: true,
    cooling_tower_fan1_fault: true,
    cooling_tower_fan2_fault: true,
    cooling_tower_fan3_fault: true
  }

  const result = container._prepErrors(dataWithMessages)

  const fan1Error = result.errors.find(e => e.name === 'fan_fault' && e.message === 'Exhaust fan 1 fault')
  const fan2Error = result.errors.find(e => e.name === 'fan_fault' && e.message === 'Exhaust fan 2 fault')
  const coolingTower1Error = result.errors.find(e => e.name === 'cooling_tower_fan_fault' && e.message === 'Cooling tower fan 1 fault')
  const coolingTower2Error = result.errors.find(e => e.name === 'cooling_tower_fan_fault' && e.message === 'Cooling tower fan 2 fault')
  const coolingTower3Error = result.errors.find(e => e.name === 'cooling_tower_fan_fault' && e.message === 'Cooling tower fan 3 fault')

  t.ok(fan1Error, 'should have fan1 error with correct message')
  t.ok(fan2Error, 'should have fan2 error with correct message')
  t.ok(coolingTower1Error, 'should have cooling tower fan1 error with correct message')
  t.ok(coolingTower2Error, 'should have cooling tower fan2 error with correct message')
  t.ok(coolingTower3Error, 'should have cooling tower fan3 error with correct message')

  t.end()
})

test('HydroContainer - _prepSnap with errors', async (t) => {
  const { container, mockMinerInfo } = await createContainerForPrepSnap({
    power_fault: true,
    circulating_pump: true,
    distribution_box1_power: 1000,
    distribution_box2_power: 500
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'error', 'should set status to ERROR when errors present')
  t.ok(snap.stats.errors, 'should include errors in stats')
  t.is(snap.stats.power_w, 1500, 'should calculate total power correctly')
  t.is(snap.stats.distribution_box1_power_w, 1000, 'should include distribution box 1 power')
  t.is(snap.stats.distribution_box2_power_w, 500, 'should include distribution box 2 power')
  t.is(snap.stats.alarm_status, false, 'should include alarm status')
  t.is(snap.stats.ambient_temp_c, 25, 'should include ambient temperature')
  t.is(snap.stats.humidity_percent, 60, 'should include humidity')
  t.ok(snap.stats.container_specific, 'should include container specific data')
  t.alike(snap.stats.container_specific.miner_info, mockMinerInfo.data, 'should include miner info')

  t.ok(snap.config.container_specific, 'should include config')
  t.is(snap.config.container_specific.supply_liquid_temp, 20, 'should include supply liquid temp in config')
  t.is(snap.config.container_specific.colding_tower_inlet_temp, 18, 'should include cooling tower inlet temp in config')
  t.is(snap.config.container_specific.running_mode, 'auto', 'should include running mode in config')
  t.is(snap.config.container_specific.supply_liquid_set_temp, 22, 'should include supply liquid set temp in config')

  t.end()
})

test('HydroContainer - _prepSnap without errors', async (t) => {
  const { container } = await createContainerForPrepSnap({
    power_fault: false,
    circulating_pump: true,
    distribution_box1_power: 1000,
    distribution_box2_power: 500
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'running', 'should set status to RUNNING when no errors and pump is on')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('HydroContainer - _prepSnap with pump off', async (t) => {
  const { container } = await createContainerForPrepSnap({
    power_fault: false,
    circulating_pump: false,
    distribution_box1_power: 0,
    distribution_box2_power: 0
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'stopped', 'should set status to STOPPED when pump is off')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('HydroContainer - error log handling', (t) => {
  const container = createBasicContainer()

  // Initialize error log
  container._errorLog = []

  const dataWithErrors = {
    power_fault: true,
    liquid_level_low: true
  }

  const result = container._prepErrors(dataWithErrors)

  t.ok(result.isErrored, 'should detect errors')
  t.is(result.errors.length, 2, 'should have two errors in log')
  t.is(container._errorLog.length, 2, 'should update error log')

  t.end()
})
