import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getAuthList, revokeAuth } from '../../services/channels'
import { isSuccessResponse, datetime } from '../../utils'
import styles from './authList.module.scss'

const AuthList = () => {
  const [list, setList] = useState<Channel.GetAuthList.AuthProfile[]>([])
  useEffect(() => {
    const { ipcRenderer } = window
    getAuthList().then(res => {
      if (isSuccessResponse(res)) {
        setList(res.result.sort((auth1, auth2) => +auth2.time - +auth1.time))
      }
    })
    const listener = (_e: Event, authList: Channel.GetAuthList.AuthProfile[]) => {
      if (Array.isArray(authList)) {
        setList(authList.sort((auth1, auth2) => +auth2.time - +auth1.time))
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
          <div className={styles.time}>{datetime(new Date(+auth.time))}</div>
          <button className={styles.revoke} type="button" onClick={() => revokeAuth({ url: auth.url })}>
            Revoke
          </button>
        </div>
      ))}
    </div>
  )
}

export default AuthList
