'use strict'

const test = require('brittle')
const alerts = require('../../workers/lib/alerts')

test('alerts - supply_liquid_temp_low validation', (t) => {
  const ctx = {
    conf: {
      supply_liquid_temp_low: {
        params: { temp: 20 }
      }
    }
  }

  // Test with valid snap and online status
  const validSnap = {
    config: {
      container_specific: {
        supply_liquid_temp: 15
      }
    }
  }

  // Mock the required utility functions
  const originalIsValidSnap = require('miningos-tpl-wrk-container/workers/lib/utils').isValidSnap
  const originalIsOffline = require('miningos-tpl-wrk-container/workers/lib/utils').isOffline

  // Mock isValidSnap to return true
  require('miningos-tpl-wrk-container/workers/lib/utils').isValidSnap = () => true
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = () => false

  const isValid = alerts.specs.container.supply_liquid_temp_low.valid(ctx, validSnap)
  t.ok(isValid, 'should validate when snap is valid, online, and config is present')

  // Test with invalid snap
  require('miningos-tpl-wrk-container/workers/lib/utils').isValidSnap = () => false
  const invalidSnap = { config: { container_specific: { supply_liquid_temp: 15 } } }
  const isInvalid = alerts.specs.container.supply_liquid_temp_low.valid(ctx, invalidSnap)
  t.absent(isInvalid, 'should not validate when snap is invalid')

  // Test with offline status
  require('miningos-tpl-wrk-container/workers/lib/utils').isValidSnap = () => true
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = () => true
  const isOffline = alerts.specs.container.supply_liquid_temp_low.valid(ctx, validSnap)
  t.absent(isOffline, 'should not validate when container is offline')

  // Test without config
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = () => false
  const ctxWithoutConfig = { conf: {} }
  const noConfig = alerts.specs.container.supply_liquid_temp_low.valid(ctxWithoutConfig, validSnap)
  t.absent(noConfig, 'should not validate when config is missing')

  // Restore original functions
  require('miningos-tpl-wrk-container/workers/lib/utils').isValidSnap = originalIsValidSnap
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = originalIsOffline

  t.end()
})

test('alerts - supply_liquid_temp_low probing', (t) => {
  const ctx = {
    conf: {
      supply_liquid_temp_low: {
        params: { temp: 20 }
      }
    }
  }

  // Test temperature below threshold
  const snapBelowThreshold = {
    config: {
      container_specific: {
        supply_liquid_temp: 15
      }
    }
  }

  const isBelowThreshold = alerts.specs.container.supply_liquid_temp_low.probe(ctx, snapBelowThreshold)
  t.ok(isBelowThreshold, 'should trigger alert when temperature is below threshold')

  // Test temperature above threshold
  const snapAboveThreshold = {
    config: {
      container_specific: {
        supply_liquid_temp: 25
      }
    }
  }

  const isAboveThreshold = alerts.specs.container.supply_liquid_temp_low.probe(ctx, snapAboveThreshold)
  t.absent(isAboveThreshold, 'should not trigger alert when temperature is above threshold')

  // Test temperature at threshold
  const snapAtThreshold = {
    config: {
      container_specific: {
        supply_liquid_temp: 20
      }
    }
  }

  const isAtThreshold = alerts.specs.container.supply_liquid_temp_low.probe(ctx, snapAtThreshold)
  t.absent(isAtThreshold, 'should not trigger alert when temperature is at threshold')

  t.end()
})

test('alerts - container specs structure', (t) => {
  t.ok(alerts.specs.container, 'should have container specs')
  t.ok(alerts.specs.container.supply_liquid_temp_low, 'should have supply_liquid_temp_low alert spec')
  t.ok(alerts.specs.container.supply_liquid_temp_low.valid, 'should have valid function')
  t.ok(alerts.specs.container.supply_liquid_temp_low.probe, 'should have probe function')
  t.end()
})
