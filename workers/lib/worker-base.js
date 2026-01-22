'use strict'

const WrkRack = require('miningos-tpl-wrk-container/workers/rack.container.wrk')
const async = require('async')

class WrkContainerRack extends WrkRack {
  init () {
    super.init()

    this.setInitFacs([
      ['fac', 'bfx-facs-http', '0', '0', {}, 0]
    ])
  }

  getThingType () {
    return super.getThingType() + '-as'
  }

  selectThingInfo (thg) {
    return {
      address: thg.opts?.address,
      port: thg.opts?.port
    }
  }

  getThingTags () {
    return ['antspace']
  }

  getSpecTags () {
    return ['container']
  }

  async collectThingSnap (thg) {
    return thg.ctrl.getSnap()
  }

  _start (cb) {
    async.series([
      (next) => { super._start(next) },
      (next) => {
        this.miningosThgWriteCalls_0.whitelistActions([
          ['resetCoolingSystem', 2],
          ['setLiquidSupplyTemperature', 2]
        ])
        next()
      }
    ], cb)
  }

  async connectThing (thg) {
    throw new Error('ERR_NO_IMPL')
  }
}

module.exports = WrkContainerRack
