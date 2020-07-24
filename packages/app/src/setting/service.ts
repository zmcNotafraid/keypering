import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import type { Channel } from '@keypering/specs'
import { DATA_PATH_BASE } from '../utils'

const dataPath = path.resolve(app.getPath('userData'), DATA_PATH_BASE, 'setting')
const filePath = path.resolve(dataPath, 'index.json')

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true })
}

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

