'use strict'

module.exports = (v) => {
  delete v.switchSocketOnSingle
  delete v.switchSocketOffSingle
  delete v.switchSocketOffBatch
  delete v.switchSocketOnBatch
}
