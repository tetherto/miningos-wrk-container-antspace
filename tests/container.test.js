'use strict'

const { getDefaultConf, testExecutor } = require('miningos-tpl-wrk-container/tests/container.test')
const Container = require('../workers/lib/container/hydro')
const { promiseSleep: sleep } = require('@bitfinex/lib-js-util-promise')
const HttpFacility = require('bfx-facs-http')

let mockServer

const conf = getDefaultConf()

if (!conf.settings.live) {
  conf.settings.host = '127.0.0.1'
  const srv = require('../mock/server')
  mockServer = srv.createServer({
    host: conf.settings.host,
    port: conf.settings.port,
    type: 'HK3',
    id: 'HK3'
  })
}

const fac = new HttpFacility({ ctx: { env: 'test', root: '.' } }, {}, { env: 'test', root: '.' })
const container = new Container({
  address: conf.settings.host,
  port: conf.settings.port,
  client: fac
})

container.getStats = () => this.lastSnap?.stats

conf.cleanup = () => {
  if (mockServer) {
    mockServer.stop()
  }
}

async function execute () {
  await sleep(1000)
  testExecutor(container, conf)
}

execute()
