'use strict'

module.exports = (v) => {
  v.stats_validate.schema.stats.children.container_specific = {
    type: 'object',
    children: {
      distribution_box1_power: {
        type: 'number'
      },
      distribution_box2_power: {
        type: 'number'
      },
      supply_liquid_temp: {
        type: 'number'
      },
      return_liquid_temp: {
        type: 'number'
      },
      supply_liquid_pressure: {
        type: 'number'
      },
      return_liquid_pressure: {
        type: 'number'
      },
      cooling_tower_inlet_temp: {
        type: 'number'
      },
      supply_liquid_flow: {
        type: 'number'
      },
      supply_liquid_set_temp: {
        type: 'number'
      },
      pid_mode: {
        type: 'boolean'
      },
      circulating_pump: {
        type: 'boolean'
      },
      fan1: {
        type: 'boolean'
      },
      fan2: {
        type: 'boolean'
      },
      spray_pump: {
        type: 'boolean'
      },
      fluid_infusion_pump: {
        type: 'boolean'
      },
      cooling_tower_fan1: {
        type: 'boolean'
      },
      cooling_tower_fan2: {
        type: 'boolean'
      },
      cooling_tower_fan3: {
        type: 'boolean'
      },
      power_fault: {
        type: 'boolean'
      },
      liquid_level_low: {
        type: 'boolean'
      },
      circulating_pump_fault: {
        type: 'boolean'
      },
      fan1_fault: {
        type: 'boolean'
      },
      fan2_fault: {
        type: 'boolean'
      },
      fluid_infusion_pump_fault: {
        type: 'boolean'
      },
      spray_pump_fault: {
        type: 'boolean'
      },
      cooling_tower_fan1_fault: {
        type: 'boolean'
      },
      cooling_tower_fan2_fault: {
        type: 'boolean'
      },
      cooling_tower_fan3_fault: {
        type: 'boolean'
      },
      leakage_fault: {
        type: 'boolean'
      },
      supply_liquid_temp_high: {
        type: 'boolean'
      },
      supply_liquid_temp_too_high: {
        type: 'boolean'
      },
      supply_liquid_pressure_high: {
        type: 'boolean'
      },
      return_liquid_pressure_low: {
        type: 'boolean'
      },
      supply_liquid_flow_low: {
        type: 'boolean'
      },
      freezing_alarm: {
        type: 'boolean'
      },
      cooling_tower_liquid_level_low: {
        type: 'boolean'
      },
      running_mode: {
        type: 'boolean'
      },
      longitude_direction: {
        type: 'number'
      },
      longitude: {
        type: 'number'
      },
      latitude_direction: {
        type: 'number'
      },
      latitude: {
        type: 'number'
      },
      miner_info: {
        type: 'object',
        children: {
          miner_num: {
            type: 'number'
          },
          total_hashrate: {
            type: 'number'
          },
          pcb_max_temp: {
            type: 'number'
          },
          chip_max_temp: {
            type: 'number'
          },
          chip_temp_mean: {
            type: 'number'
          }
        }
      }
    }
  }
  v.config_validate.schema.config.children.container_specific = {
    type: 'object',
    children: {
      supply_liquid_temp: {
        type: 'number'
      },
      colding_tower_inlet_temp: {
        type: 'number'
      },
      running_mode: {
        type: 'boolean'
      },
      supply_liquid_set_temp: {
        type: 'number'
      }
    }
  }
}
