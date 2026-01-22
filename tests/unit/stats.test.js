'use strict'

const test = require('brittle')
const stats = require('../../workers/lib/stats')

test('stats - container_specific_stats_group operation', (t) => {
  const operation = stats.specs.container.ops.container_specific_stats_group

  t.is(operation.op, 'group_multiple_stats', 'should have correct operation type')
  t.ok(Array.isArray(operation.srcs), 'should have sources array')
  t.ok(operation.group, 'should have group function')
  t.ok(operation.filter, 'should have filter function')

  // Test sources structure
  const expectedSources = [
    'distribution_box1_power_group',
    'distribution_box2_power_group',
    'supply_liquid_flow_group',
    'supply_liquid_pressure_group',
    'return_liquid_pressure_group',
    'supply_liquid_temp_group',
    'return_liquid_temp_group',
    'primary_supply_temp_group',
    'primary_return_temp_group',
    'second_supply_temp1_group',
    'second_return_temp1_group',
    'second_supply_temp2_group',
    'second_return_temp2_group',
    'supply_liquid_set_temp_group'
  ]

  expectedSources.forEach(sourceName => {
    const source = operation.srcs.find(s => s.name === sourceName)
    t.ok(source, `should have source for ${sourceName}`)
    t.ok(source.src, `should have src path for ${sourceName}`)
    t.ok(source.src.startsWith('last.snap.stats.container_specific.'), `should have correct src path for ${sourceName}`)
  })

  t.end()
})

test('stats - container_specific_stats_group filter function', (t) => {
  const filter = stats.specs.container.ops.container_specific_stats_group.filter

  // Mock the isOffline function
  const originalIsOffline = require('miningos-tpl-wrk-container/workers/lib/utils').isOffline
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = () => false

  const onlineEntry = {
    last: {
      snap: { status: 'online' }
    },
    info: {
      container: 'test-container'
    }
  }

  const shouldInclude = filter(onlineEntry)
  t.ok(shouldInclude, 'should include online entries')

  // Test offline entry
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = () => true

  const offlineEntry = {
    last: {
      snap: { status: 'offline' }
    },
    info: {
      container: 'test-container'
    }
  }

  const shouldExclude = filter(offlineEntry)
  t.absent(shouldExclude, 'should exclude offline entries')

  // Restore original function
  require('miningos-tpl-wrk-container/workers/lib/utils').isOffline = originalIsOffline

  t.end()
})

test('stats - container_specific_stats_group group function', (t) => {
  const group = stats.specs.container.ops.container_specific_stats_group.group

  const entry = {
    info: {
      container: 'test-container-1'
    }
  }

  const groupKey = group(entry, entry)
  t.is(groupKey, 'test-container-1', 'should group by container info')

  t.end()
})

test('stats - container specs structure', (t) => {
  t.ok(stats.specs.container, 'should have container specs')
  t.ok(stats.specs.container.ops, 'should have ops object')
  t.ok(stats.specs.container.ops.container_specific_stats_group, 'should have container_specific_stats_group operation')
  t.end()
})

test('stats - extends container_default', (t) => {
  // Verify that container specs extend container_default
  t.ok(stats.specs.container.ops, 'should have ops from container_default')
  t.ok(stats.specs.container.ops.container_specific_stats_group, 'should have additional container_specific_stats_group')
  t.end()
})
