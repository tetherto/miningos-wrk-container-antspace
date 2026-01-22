'use strict'

const test = require('brittle')
const ImmersionContainer = require('../../workers/lib/container/immersion')
const { getRandomIP } = require('../../mock/initial_states/utils')

// Helper function to create a basic container
function createBasicContainer () {
  return new ImmersionContainer({
    client: { get: () => {}, request: () => {} },
    address: getRandomIP(),
    port: 8080
  })
}

// Helper function to create mock system data
function createMockSystemData (overrides = {}) {
  return {
    data: {
      primary_circulating_pump: false,
      second_pump1: false,
      second_pump2: false,
      distribution_box_power: 1.5,
      power_distribution: 2.0,
      pump_alarm: false,
      container_temp: 25,
      container_humidity: 60,
      vol_a_distribution: 220,
      vol_b_distribution: 230,
      vol_c_distribution: 240,
      running_mode: 'auto',
      pid_mode: 'enabled',
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

  const container = new ImmersionContainer({
    client: mockClient,
    address: getRandomIP(),
    port: 8080
  })

  container.updateLastSeen = () => {}

  return { container, mockSystemData, mockMinerInfo }
}

test('ImmersionContainer - error mapping', (t) => {
  const container = createBasicContainer()

  // Test primary_circulating_pump error
  const dataWithPrimaryPumpFault = {
    primary_circulating_pump: true,
    dry_cooler_power_fre_fault: false,
    second_pump1_fault: false
  }

  const result1 = container._prepErrors(dataWithPrimaryPumpFault)
  t.ok(result1.isErrored, 'should detect primary pump fault error')
  t.is(result1.errors.length, 1, 'should have one error')
  t.is(result1.errors[0].name, 'circulating_pump_fault', 'should map to correct error name')

  // Test multiple errors
  const dataWithMultipleErrors = {
    primary_circulating_pump: true,
    dry_cooler_power_fre_fault: true,
    second_pump1_fault: true,
    second_pump2_fault: true,
    fan_fault: true,
    phasefailure: true
  }

  const result2 = container._prepErrors(dataWithMultipleErrors)
  t.ok(result2.isErrored, 'should detect multiple errors')
  t.is(result2.errors.length, 6, 'should have six errors')

  const errorNames = result2.errors.map(e => e.name)
  t.ok(errorNames.includes('circulating_pump_fault'), 'should include circulating_pump_fault')
  t.ok(errorNames.includes('dry_cooler_power_fre_fault'), 'should include dry_cooler_power_fre_fault')
  t.ok(errorNames.includes('secondary_pump_fault'), 'should include secondary_pump_fault')
  t.ok(errorNames.includes('fan_fault'), 'should include fan_fault')
  t.ok(errorNames.includes('phase_failure'), 'should include phase_failure')

  // Test no errors
  const dataWithNoErrors = {
    primary_circulating_pump: false,
    dry_cooler_power_fre_fault: false,
    second_pump1_fault: false
  }

  const result3 = container._prepErrors(dataWithNoErrors)
  t.absent(result3.isErrored, 'should not detect errors when none present')
  t.is(result3.errors.length, 0, 'should have no errors')

  t.end()
})

test('ImmersionContainer - error messages', (t) => {
  const container = createBasicContainer()

  const dataWithMessages = {
    second_pump1_fault: true,
    second_pump2_fault: true
  }

  const result = container._prepErrors(dataWithMessages)

  const pump1Error = result.errors.find(e => e.name === 'secondary_pump_fault' && e.message === 'Secondary circulation pump 1 fault')
  const pump2Error = result.errors.find(e => e.name === 'secondary_pump_fault' && e.message === 'Secondary circulation pump 2 fault')

  t.ok(pump1Error, 'should have pump1 error with correct message')
  t.ok(pump2Error, 'should have pump2 error with correct message')

  t.end()
})

test('ImmersionContainer - _prepSnap with errors', async (t) => {
  const { container, mockMinerInfo } = await createContainerForPrepSnap({
    primary_circulating_pump: true,
    second_pump1: true,
    second_pump2: false
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'error', 'should set status to ERROR when errors present')
  t.ok(snap.stats.errors, 'should include errors in stats')
  t.is(snap.stats.power_w, 150000, 'should calculate total power correctly (1.5 * 100000)')
  t.is(snap.stats.distribution_box_power_w, 150000, 'should include distribution box power')
  t.is(snap.stats.power_distribution_w, 2000, 'should include power distribution (2.0 * 1000)')
  t.is(snap.stats.alarm_status, false, 'should include alarm status')
  t.is(snap.stats.ambient_temp_c, 25, 'should include ambient temperature')
  t.is(snap.stats.humidity_percent, 60, 'should include humidity')
  t.ok(snap.stats.container_specific, 'should include container specific data')
  t.alike(snap.stats.container_specific.miner_info, mockMinerInfo.data, 'should include miner info')

  // Test voltage rounding
  t.is(snap.stats.container_specific.vol_a_distribution, 22, 'should round vol_a_distribution (220/10)')
  t.is(snap.stats.container_specific.vol_b_distribution, 23, 'should round vol_b_distribution (230/10)')
  t.is(snap.stats.container_specific.vol_c_distribution, 24, 'should round vol_c_distribution (240/10)')

  t.ok(snap.config.container_specific, 'should include config')
  t.is(snap.config.container_specific.running_mode, 'auto', 'should include running mode in config')
  t.is(snap.config.container_specific.pid_mode, 'enabled', 'should include pid mode in config')
  t.is(snap.config.container_specific.supply_liquid_set_temp, 22, 'should include supply liquid set temp in config')

  t.end()
})

test('ImmersionContainer - _prepSnap without errors and running', async (t) => {
  const { container } = await createContainerForPrepSnap({
    primary_circulating_pump: false,
    second_pump1: true,
    second_pump2: false
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'running', 'should set status to running when no errors and pumps are running')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('ImmersionContainer - _prepSnap with pump2 running', async (t) => {
  const { container } = await createContainerForPrepSnap({
    primary_circulating_pump: false,
    second_pump1: false,
    second_pump2: true
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'running', 'should set status to running when pump2 is running')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('ImmersionContainer - _prepSnap with both pumps running', async (t) => {
  const { container } = await createContainerForPrepSnap({
    primary_circulating_pump: false,
    second_pump1: true,
    second_pump2: true
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'running', 'should set status to running when both pumps are running')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('ImmersionContainer - _prepSnap with no pumps running', async (t) => {
  const { container } = await createContainerForPrepSnap({
    primary_circulating_pump: false,
    second_pump1: false,
    second_pump2: false
  })

  const snap = await container._prepSnap()

  t.is(snap.stats.status, 'stopped', 'should set status to stopped when no pumps are running')
  t.absent(snap.stats.errors, 'should not include errors when none present')

  t.end()
})

test('ImmersionContainer - error log handling', (t) => {
  const container = createBasicContainer()

  // Initialize error log
  container._errorLog = []

  const dataWithErrors = {
    primary_circulating_pump: true,
    dry_cooler_power_fre_fault: true
  }

  const result = container._prepErrors(dataWithErrors)

  t.ok(result.isErrored, 'should detect errors')
  t.is(result.errors.length, 2, 'should have two errors in log')
  t.is(container._errorLog.length, 2, 'should update error log')

  t.end()
})
