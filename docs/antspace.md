# Antspace APIs

This document describes the functions exposed by the `container.js` library for Bitdeer. Below are functions common to all containers. Look at individual container documentation for specific changes if any. As of now we are not aware of any container specific changes

## Container specific documentation

- [HK3](./antspace-hk3.md)
- [Immersion](./antspace-immersion.md)

## Common Functions
- [Antspace APIs](#antspace-apis)
  - [`constructor (containerId, containerName, host, port, _allowDangerousActions = false)` -\> `HK3Container`](#constructor-containerid-containername-host-port-_allowdangerousactions--false---hk3container)
    - [Parameters](#parameters)
  - [`async switchCoolingSystem(enabled)` -\> `Object`](#async-switchcoolingsystemenabled---object)
    - [Parameters](#parameters-1)
    - [Returns](#returns)
  - [`async resetCoolingSystem()` -\> `Object`](#async-resetcoolingsystem---object)
    - [Returns](#returns-1)
  - [`async setLiquidSupplyTemperature(temperature)` -\> `Object`](#async-setliquidsupplytemperaturetemperature---object)
    - [Parameters](#parameters-2)
    - [Returns](#returns-2)
  - [`async getSystemData()` -\> `Object`](#async-getsystemdata---object)
    - [Returns](#returns-3)
  - [`async getMinerInfo()` -\> `Object`](#async-getminerinfo---object)
    - [Returns](#returns-4)
  - [`async getConfig()` -\> `Object`](#async-getconfig---object)
    - [Returns](#returns-5)
  - [`async getInfo()` -\> `Object`](#async-getinfo---object)
    - [Returns](#returns-6)
  - [`async getStats()` -\> `Object`](#async-getstats---object)
    - [Returns](#returns-7)
  - [`async getSnap()` -\> `Object`](#async-getsnap---object)
    - [Returns](#returns-8)


## `constructor (containerId, containerName, host, port, _allowDangerousActions = false)` -> `HK3Container`
Creates a new `HK3Container` instance.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| containerId | `string` | ID of the container (for identification purposes). | |
| containerName | `string` | Name of the container (for identification purposes). | |
| host | `string` | IP address of the container. | |
| port | `number` | Port of the container. | |
| _allowDangerousActions | `boolean` | Whether to allow dangerous actions (NO_IMPL). | `false` |

## `async switchCoolingSystem(enabled)` -> `Object`
Sets the cooling system to enabled/disabled.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| enabled | `boolean` | Whether to enable the cooling system. | |

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |

## `async resetCoolingSystem()` -> `Object`
Resets the cooling system.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |

## `async setLiquidSupplyTemperature(temperature)` -> `Object`
Sets the liquid supply temperature.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| temperature | `number` | The temperature to set. | |

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |

## `async getSystemData()` -> `Object`
Gets the system data.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| data | `Object` | The system data as returned from the API. |

## `async getMinerInfo()` -> `Object`
Gets the miner info.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| data | `Object` | The miner info as returned from the API. |

## `async getConfig()` -> `Object`
Gets a snapshot of the container config.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| config.container_specific.supply_liquid_temp | `number` | The liquid supply temperature. |
| config.container_specific.colding_tower_inlet_temp | `number` | The cooling tower inlet temperature. |
| config.container_specific.running_mode | `boolean` | The running mode. |
| config.container_specific.supply_liquid_set_temp | `number` | The liquid supply set temperature. |

## `async getInfo()` -> `Object`
Gets a snapshot of the container info.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| info.model | `string` | The container model. |
| info.container_id | `string` | The container ID. |


## `async getStats()` -> `Object`
Gets a snapshot of the container stats.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| stats.power_kw | `number` | The power in kW. |
| stats.alarm_status | `boolean` | The alarm status. |
| stats.ambient_temp_c | `number` | The ambient temperature in Celsius. |
| stats.humidity_percent | `number` | The humidity in percent. |
| stats.container_specific.distribution_box1_power | `number` | The power of distribution box 1. |
| stats.container_specific.distribution_box2_power | `number` | The power of distribution box 2. |
| stats.container_specific.supply_liquid_temp | `number` | The liquid supply temperature. |
| stats.container_specific.return_liquid_temp | `number` | The liquid return temperature. |
| stats.container_specific.supply_liquid_pressure | `number` | The liquid supply pressure. |
| stats.container_specific.return_liquid_pressure | `number` | The liquid return pressure. |
| stats.container_specific.cooling_tower_inlet_temp | `number` | The cooling tower inlet temperature. |
| stats.container_specific.supply_liquid_flow | `number` | The liquid supply flow. |
| stats.container_specific.supply_liquid_set_temp | `number` | The liquid supply set temperature. |
| stats.container_specific.pid_mode | `boolean` | The PID mode. |
| stats.container_specific.circulating_pump | `boolean` | The circulating pump status. |
| stats.container_specific.fan1 | `boolean` | The fan 1 status. |
| stats.container_specific.fan2 | `boolean` | The fan 2 status. |
| stats.container_specific.spray_pump | `boolean` | The spray pump status. |
| stats.container_specific.fluid_infusion_pump | `boolean` | The fluid infusion pump status. |
| stats.container_specific.cooling_tower_fan1 | `boolean` | The cooling tower fan 1 status. |
| stats.container_specific.cooling_tower_fan2 | `boolean` | The cooling tower fan 2 status. |
| stats.container_specific.cooling_tower_fan3 | `boolean` | The cooling tower fan 3 status. |
| stats.container_specific.power_fault | `boolean` | The power fault status. |
| stats.container_specific.liquid_level_low | `boolean` | The liquid level low status. |
| stats.container_specific.circulating_pump_fault | `boolean` | The circulating pump fault status. |
| stats.container_specific.fan1_fault | `boolean` | The fan 1 fault status. |
| stats.container_specific.fan2_fault | `boolean` | The fan 2 fault status. |
| stats.container_specific.fluid_infusion_pump_fault | `boolean` | The fluid infusion pump fault status. |
| stats.container_specific.spray_pump_fault | `boolean` | The spray pump fault status. |
| stats.container_specific.cooling_tower_fan1_fault | `boolean` | The cooling tower fan 1 fault status. |
| stats.container_specific.cooling_tower_fan2_fault | `boolean` | The cooling tower fan 2 fault status. |
| stats.container_specific.cooling_tower_fan3_fault | `boolean` | The cooling tower fan 3 fault status. |
| stats.container_specific.leakage_fault | `boolean` | The leakage fault status. |
| stats.container_specific.supply_liquid_temp_high | `boolean` | The liquid supply temperature high status. |
| stats.container_specific.supply_liquid_temp_too_high | `boolean` | The liquid supply temperature too high status. |
| stats.container_specific.supply_liquid_pressure_high | `boolean` | The liquid supply pressure high status. |
| stats.container_specific.return_liquid_pressure_low | `boolean` | The liquid return pressure low status. |
| stats.container_specific.supply_liquid_flow_low | `boolean` | The liquid supply flow low status. |
| stats.container_specific.freezing_alarm | `boolean` | The freezing alarm status. |
| stats.container_specific.cooling_tower_liquid_level_low | `boolean` | The cooling tower liquid level low status. |
| stats.container_specific.running_mode | `boolean` | The running mode. |
| stats.container_specific.longitude_direction | `boolean` | The longitude direction. |
| stats.container_specific.longitude | `number` | The longitude. |
| stats.container_specific.latitude_direction | `boolean` | The latitude direction. |
| stats.container_specific.latitude | `number` | The latitude. |
| stats.container_specific.miner_info | `Object` | The miner info. |

## `async getSnap()` -> `Object`
Gets a snapshot of the container.

### Returns
| Param  | Type | Description |
| -- | -- | -- |
| success | `boolean` | Whether the operation was successful. |
| info.model | `string` | The container model. |
| info.container_id | `string` | The container ID. |
| config.container_specific.supply_liquid_temp | `number` | The liquid supply temperature. |
| config.container_specific.colding_tower_inlet_temp | `number` | The cooling tower inlet temperature. |
| config.container_specific.running_mode | `boolean` | The running mode. |
| config.container_specific.supply_liquid_set_temp | `number` | The liquid supply set temperature. |
| stats.power_kw | `number` | The power in kW. |
| stats.alarm_status | `boolean` | The alarm status. |
| stats.ambient_temp_c | `number` | The ambient temperature in Celsius. |
| stats.humidity_percent | `number` | The humidity in percent. |
| stats.container_specific.distribution_box1_power | `number` | The power of distribution box 1. |
| stats.container_specific.distribution_box2_power | `number` | The power of distribution box 2. |
| stats.container_specific.supply_liquid_temp | `number` | The liquid supply temperature. |
| stats.container_specific.return_liquid_temp | `number` | The liquid return temperature. |
| stats.container_specific.supply_liquid_pressure | `number` | The liquid supply pressure. |
| stats.container_specific.return_liquid_pressure | `number` | The liquid return pressure. |
| stats.container_specific.cooling_tower_inlet_temp | `number` | The cooling tower inlet temperature. |
| stats.container_specific.supply_liquid_flow | `number` | The liquid supply flow. |
| stats.container_specific.supply_liquid_set_temp | `number` | The liquid supply set temperature. |
| stats.container_specific.pid_mode | `boolean` | The PID mode. |
| stats.container_specific.circulating_pump | `boolean` | The circulating pump status. |
| stats.container_specific.fan1 | `boolean` | The fan 1 status. |
| stats.container_specific.fan2 | `boolean` | The fan 2 status. |
| stats.container_specific.spray_pump | `boolean` | The spray pump status. |
| stats.container_specific.fluid_infusion_pump | `boolean` | The fluid infusion pump status. |
| stats.container_specific.cooling_tower_fan1 | `boolean` | The cooling tower fan 1 status. |
| stats.container_specific.cooling_tower_fan2 | `boolean` | The cooling tower fan 2 status. |
| stats.container_specific.cooling_tower_fan3 | `boolean` | The cooling tower fan 3 status. |
| stats.container_specific.power_fault | `boolean` | The power fault status. |
| stats.container_specific.liquid_level_low | `boolean` | The liquid level low status. |
| stats.container_specific.circulating_pump_fault | `boolean` | The circulating pump fault status. |
| stats.container_specific.fan1_fault | `boolean` | The fan 1 fault status. |
| stats.container_specific.fan2_fault | `boolean` | The fan 2 fault status. |
| stats.container_specific.fluid_infusion_pump_fault | `boolean` | The fluid infusion pump fault status. |
| stats.container_specific.spray_pump_fault | `boolean` | The spray pump fault status. |
| stats.container_specific.cooling_tower_fan1_fault | `boolean` | The cooling tower fan 1 fault status. |
| stats.container_specific.cooling_tower_fan2_fault | `boolean` | The cooling tower fan 2 fault status. |
| stats.container_specific.cooling_tower_fan3_fault | `boolean` | The cooling tower fan 3 fault status. |
| stats.container_specific.leakage_fault | `boolean` | The leakage fault status. |
| stats.container_specific.supply_liquid_temp_high | `boolean` | The liquid supply temperature high status. |
| stats.container_specific.supply_liquid_temp_too_high | `boolean` | The liquid supply temperature too high status. |
| stats.container_specific.supply_liquid_pressure_high | `boolean` | The liquid supply pressure high status. |
| stats.container_specific.return_liquid_pressure_low | `boolean` | The liquid return pressure low status. |
| stats.container_specific.supply_liquid_flow_low | `boolean` | The liquid supply flow low status. |
| stats.container_specific.freezing_alarm | `boolean` | The freezing alarm status. |
| stats.container_specific.cooling_tower_liquid_level_low | `boolean` | The cooling tower liquid level low status. |
| stats.container_specific.running_mode | `boolean` | The running mode. |
| stats.container_specific.longitude_direction | `boolean` | The longitude direction. |
| stats.container_specific.longitude | `number` | The longitude. |
| stats.container_specific.latitude_direction | `boolean` | The latitude direction. |
| stats.container_specific.latitude | `number` | The latitude. |
| stats.container_specific.miner_info | `Object` | The miner info. |
