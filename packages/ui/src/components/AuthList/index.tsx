import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getAuthList, revokeAuth } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './authList.module.scss'

const AuthList = () => {
  const [list, setList] = useState<Channel.GetAuthList.AuthProfile[]>([])
  useEffect(() => {
    const { ipcRenderer } = window
    getAuthList().then(res => {
      if (isSuccessResponse(res)) {
        setList(res.result)
      }
    })
    const listener = (_e: any, p: Channel.GetAuthList.AuthProfile[]) => {
      if (Array.isArray(p)) {
        setList(p)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetAuthList, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetAuthList, listener)
    }
  }, [setList])

  return (
    <div className={styles.container}>
      {list.map(auth => (
        <div key={auth.url} className={styles.item}>
          <div className={styles.info}>
            Application:
            <span className={styles.url}>{auth.url}</span>
          </div>
          <div className={styles.time}>{auth.time}</div>
          <button className={styles.revoke} type="button" onClick={() => revokeAuth({ url: auth.url })}>
            Revoke
          </button>
        </div>
      ))}
    </div>
  )
}

export default AuthList
