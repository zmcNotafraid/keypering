import path from 'path'
import fs from 'fs'
import type { Channel } from '@keypering/specs'
import { getDataPath } from '../utils'

const dataPath = getDataPath('setting')
const filePath = path.resolve(dataPath, 'index.json')

export const getSetting = (): Channel.Setting => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } else {
    return { locks: {}, networks: {} }
  }
}

export const updateSetting = (setting: Channel.Setting) => {
  fs.writeFileSync(filePath, JSON.stringify(setting))
  return true
}

