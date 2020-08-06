import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Channel } from '@keypering/specs'
import { getTip } from '../../services/rpc'
import { getSetting } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './footer.module.scss'

const Footer = () => {
  const [network, setNetwork] = useState<Record<'name' | 'url', string> | null>(null)
  const [online, setOnline] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const { ipcRenderer } = window
    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        setNetwork(res.result.networks[res.result.networkId] ?? null)
      } else {
        // ignore
      }
    })

    const settingListener = (_e: Event, setting: Channel.Setting) => {
      setNetwork(setting.networks[setting.networkId] ?? null)
    }

    ipcRenderer.on(Channel.ChannelName.GetSetting, settingListener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetSetting, settingListener)
    }
  }, [setNetwork])

  useEffect(() => {
    setOnline(false)
    if (network) {
      const updateOnline = () => {
        requestIdRef.current += 1
        const currentRequestId = requestIdRef.current

        getTip(network.url).then(res => {
          if (currentRequestId === requestIdRef.current) {
            setOnline(!!res)
          }
        })
      }
      updateOnline()
      const INTERVAL_TIME = 3000
      const interval = setInterval(updateOnline, INTERVAL_TIME)
      return () => {
        clearInterval(interval)
      }
    }
    return () => {
      // ignore
    }
  }, [network, setOnline])

  return (
    <div className={styles.network} data-is-online={online}>
      {`${online ? 'Connected' : 'Disconnected'} (${network?.name})`}
    </div>
  )
}

export default () => createPortal(<Footer />, document.querySelector<HTMLDivElement>('footer')!)
