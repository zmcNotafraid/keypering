import path from 'path'
import fs from 'fs'
import { Channel } from '@keypering/specs'
import MainWindow  from '../MainWindow'
import { getDataPath } from '../utils'
import systemScripts from './scripts'
import systemNetworks from './networks'
import { NetworkNotFoundException } from '../exception'

const dataPath = getDataPath('setting')
const filePath = path.resolve(dataPath, 'index.json')
const broadcast = (setting: Channel.Setting) => {
  MainWindow.broadcast(Channel.ChannelName.GetSetting, setting)
}

export const getSetting = (): Channel.Setting => {
  let setting: Channel.Setting = { locks: {}, networks: {}, networkId: 'ckb'}
  if (fs.existsSync(filePath)) {
    setting =  JSON.parse(fs.readFileSync(filePath, 'utf8')) as Channel.Setting
  }
  systemScripts.forEach((script, name) => {
    setting.locks[script.codeHash] = setting.locks[script.codeHash] ?? {
      name,
      enabled: true,
      system: true
    }
  })

  systemNetworks.forEach((network, id) => {
    setting.networks[id] = network
  })
  setting.networkId = setting.networkId || 'ckb'
  // TODO: filter deleted scripts
  return setting
}

export const updateSetting = (params: Channel.UpdateSetting.Params) => {
  const setting = getSetting()
  if ('lockIds' in params) {
    Object.keys(setting.locks).forEach(id => {
      setting.locks[id].enabled = params.lockIds.includes(id)
    })
  } else if ('networkId' in params) {
    if (!Object.keys(setting.networks).includes(params.networkId)) {
      throw new NetworkNotFoundException()
    }
    setting.networkId = params.networkId
  } else {
    return false
  }
  fs.writeFileSync(filePath, JSON.stringify(setting))
  broadcast(setting)
  return true
}
