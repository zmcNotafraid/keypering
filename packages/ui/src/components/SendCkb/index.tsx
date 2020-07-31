import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { blake160 } from '@nervosnetwork/ckb-sdk-utils'
import { getWalletIndex, getSetting } from '../../services/channels'
import { getCapacityByArgs } from '../../services/rpc'
import styles from './sendCkb.module.scss'
import { isSuccessResponse, shannonToCkb } from '../../utils'

const getArgs = (params: { current: string; wallets: Channel.WalletProfile[] }) => {
  const wallet = params.wallets.find(w => w.id === params.current)
  if (wallet) {
    const pk = wallet.xpub.slice(0, 64)
    const args = `0x${blake160(`0x${pk}`, 'hex')}`
    return args
  }
  return ''
}

const SendCkb = () => {
  const [args, setArgs] = useState('')
  const [indexerUrl, setIndexerUrl] = useState('')
  const [balance, setBalance] = useState<bigint | string>('-')

  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex().then(res => {
      if (isSuccessResponse(res)) {
        setArgs(getArgs(res.result))
      } else {
        // ignore, handled by ipc
      }
    })
    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        const url = res.result.networks[res.result.networkId]?.url ?? ''
        setIndexerUrl(url)
      }
    })
    const walletListener = (_e: Event, walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
      setArgs(getArgs(walletIndex))
    }
    const settingListener = (_e: Event, settings: Channel.Setting) => {
      const url = settings.networks[settings.networkId]?.url ?? ''
      setIndexerUrl(url)
    }
    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, walletListener)
    ipcRenderer.on(Channel.ChannelName.GetSetting, settingListener)

    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, walletListener)
      ipcRenderer.removeListener(Channel.ChannelName.GetSetting, settingListener)
    }
  }, [setArgs, setIndexerUrl])

  useEffect(() => {
    setBalance('-')
    if (args && indexerUrl) {
      getCapacityByArgs({ args, indexerUrl }).then(capacity => {
        if (typeof capacity === 'bigint') {
          setBalance(capacity)
        }
      })
    }
  }, [args, indexerUrl, setBalance])

  return (
    <div className={styles.container}>
      <h1>Balance</h1>
      <div className={styles.balance}>
        {`${typeof balance === 'bigint' ? shannonToCkb(balance.toString()) : balance} CKB`}
      </div>
      <button type="button">Send</button>
    </div>
  )
}

export default SendCkb
