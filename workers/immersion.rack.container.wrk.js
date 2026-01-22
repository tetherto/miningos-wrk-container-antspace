'use strict'

const ImmersionContainer = require('./lib/container/immersion')
const WrkContainerRack = require('./lib/worker-base.js')

class WrkContainerRackImmersion extends WrkContainerRack {
  getThingType () {
    return super.getThingType() + '-immersion'
  }

  async connectThing (thg) {
    if (!thg.opts.address || !thg.opts.port) {
      return 0
    }

    const container = new ImmersionContainer({
      ...thg.opts,
      client: this.http_0,
      conf: this.conf.thing.container || {}
    })

    container.on('error', e => {
      this.debugThingError(thg, e)
    })

    thg.ctrl = container

    return 1
  }
}

module.exports = WrkContainerRackImmersion
