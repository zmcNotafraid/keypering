import path from 'path'
import fs from 'fs'
import { dialog } from 'electron'
import { Channel } from '@keypering/specs'
import MainWindow from '../MainWindow'
import { getDataPath, MAINNET_ID, DEVNET_ID } from '../utils'
import systemScripts from './scripts'
import systemNetworks from './networks'
import DevnetWindow from './DevnetWindow'
import { NetworkNotFoundException, InvalidDirectoryException } from '../exception'

const dataPath = getDataPath('setting')
const filePath = path.resolve(dataPath, 'index.json')
const metaInfoPath = path.resolve(dataPath, 'meta.json')

if (!fs.existsSync(metaInfoPath)) {
  fs.writeFileSync(metaInfoPath, JSON.stringify({ scriptsDir: '' }))
}

const broadcast = (setting: Channel.Setting) => {
  MainWindow.broadcast(Channel.ChannelName.GetSetting, setting)
}

export const getCustomScripts = () => {
  let scriptsDir = ''
  try {
    const metaInfo = JSON.parse(fs.readFileSync(metaInfoPath, 'utf8'))
    if (metaInfo?.scriptsDir) {
      scriptsDir = metaInfo.scriptsDir
    }
  } catch (err) {
    console.error(err)
  }
  const scripts = new Map<string, { codeHash: string; hashType: 'data' | 'type' }>()
  if (!scriptsDir || !fs.statSync(scriptsDir).isDirectory()) {
    return scripts
  }

  const files = fs.readdirSync(scriptsDir).filter(filename => filename.endsWith('.json'))
  files.forEach(filename => {
    try {
      const info = JSON.parse(fs.readFileSync(path.resolve(scriptsDir, filename), 'utf8'))
      if (typeof info.codeHash === 'string' && ['type', 'data'].includes(info.hashType)) {
        const name = path.basename(filename, '.json')
        scripts.set(name, { codeHash: info.codeHash, hashType: info.hashType })
      }
    } catch (err) {
      console.error(err)
    }
  })
  return scripts
}

export const getSetting = (): Channel.Setting => {
  let setting: Channel.Setting = { locks: {}, networks: {} as Channel.Setting['networks'], networkId: MAINNET_ID }
  if (fs.existsSync(filePath)) {
    setting = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Channel.Setting
  }
  const customScripts = getCustomScripts()
  const locks: typeof setting.locks = {}

  customScripts?.forEach((_, name) => {
    locks[name] = {
      name,
      enabled: setting.locks[name]?.enabled,
      system: false,
    }
  })

  systemScripts.forEach((script, name) => {
    locks[`${script.codeHash}:${script.hashType}`] = {
      name,
      enabled: setting.locks[`${script.codeHash}:${script.hashType}`]?.enabled ?? true,
      system: true,
    }
  })

  systemNetworks.forEach((network, id) => {
    if (id === DEVNET_ID) {
      setting.networks[id] = setting.networks[id] ?? network
    } else {
      setting.networks[id] = network
    }
  })
  setting.networkId = setting.networkId || MAINNET_ID
  return { ...setting, locks }
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
    setting.networkId = params.networkId as Channel.NetworkId
  } else {
    return false
  }
  fs.writeFileSync(filePath, JSON.stringify(setting))
  broadcast(setting)
  return true
}

export const updateDevnetUrl = async () => {
  const setting = getSetting()
  const currentUrl = setting.networks[DEVNET_ID].url ?? ''
  const devnetWindow = new DevnetWindow(currentUrl)
  const newUrl = await devnetWindow.response()
  devnetWindow.close()
  if (typeof newUrl === 'boolean') {
    return false
  }
  setting.networks[DEVNET_ID].url = newUrl
  fs.writeFileSync(filePath, JSON.stringify(setting))
  broadcast(setting)
  return true
}

export const setScriptsPath = async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog({
    title: 'Scripts Directory',
    properties: ['openDirectory'],
    message: 'Select the directory to load scripts',
  })

  const scriptsFilePath = filePaths[0]
  if (canceled || !scriptsFilePath) {
    return false
  }
  const stat = fs.statSync(scriptsFilePath)
  if (!stat.isDirectory()) {
    throw new InvalidDirectoryException(scriptsFilePath)
  }
  let metaInfo = { scriptsDir: '' }
  try {
    metaInfo = JSON.parse(fs.readFileSync(metaInfoPath, 'utf8'))
  } catch (err) {
    console.error(err)
  }
  metaInfo.scriptsDir = scriptsFilePath
  fs.writeFileSync(metaInfoPath, JSON.stringify(metaInfo))
  dialog.showMessageBox({
    title: 'Info',
    message: `Scripts Directory is set to ${scriptsFilePath}`,
  })
  const setting = getSetting()
  broadcast(setting)
  return true
}
