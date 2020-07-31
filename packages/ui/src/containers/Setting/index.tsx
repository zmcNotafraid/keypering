import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Channel } from '@keypering/specs'
import { Settings, ChevronLeft } from 'react-feather'
import { getSetting, updateSetting, updateScriptDir } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './setting.module.scss'

const Setting = () => {
  const [setting, setSetting] = useState<Channel.Setting>({ locks: {}, networks: {}, networkId: 'ckb' })
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()

  useEffect(() => {
    const { ipcRenderer } = window
    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        setSetting(res.result)
      }
    })
    const listener = (_e: Event, p: Channel.Setting) => {
      setSetting(p)
    }
    ipcRenderer.on(Channel.ChannelName.GetSetting, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetSetting, listener)
    }
  }, [setSetting])

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    const li = target.closest('li')
    if (submitting || !li) {
      return
    }
    const { dataset: { type, id } } = li
    if (!id) {
      return
    }
    setSubmitting(true)
    switch (type) {
      case 'lock': {
        const lockIds: string[] = Object.entries(setting.locks)
          .map(([lockId, lock]) => (lock.enabled ? lockId : ''))
          .filter(lockId => lockId)
        if (lockIds.includes(id)) {
          await updateSetting({ lockIds: lockIds.filter(lockId => lockId !== id) })
        } else {
          await updateSetting({ lockIds: [...lockIds, id] })
        }
        break
      }
      case 'network': {
        await updateSetting({ networkId: id })
        break
      }
      default: {
        // ignore
      }
    }
    setSubmitting(false)
  }

  const sortedLocks = Object.entries(setting.locks).sort(([, a], [, b]) => {
    if (a.system && b.system) {
      return a.name.localeCompare(b.name)
    }
    if (a.system) {
      return -1
    }
    if (b.system) {
      return 1
    }
    return a.name.localeCompare(b.name)
  })

  const sortedNetworks = Object.entries(setting.networks).sort(([id0], [id1]) => id0.localeCompare(id1))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ChevronLeft size={15} className={styles.back} onClick={history.goBack} />
        <h1>Setting</h1>
      </div>
      <div role="presentation" className={styles.body} onClick={handleClick}>
        <div className={styles.locks}>
          <h2>
            Lock plug-ins
            <Settings size={12} onClick={updateScriptDir} />
          </h2>
          <ul>
            {sortedLocks.map(([id, lock]) => (
              <li key={id} data-checked={lock.enabled} data-type="lock" data-id={id}>
                <span>{lock.name}</span>
                {lock.system ? <span>(system)</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.networks}>
          <h2>Rich Node RPC</h2>
          <ul>
            {sortedNetworks.map(([id, network]) => (
              <li key={id} data-checked={id === setting.networkId} data-type="network" data-id={id}>
                {network.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Setting
