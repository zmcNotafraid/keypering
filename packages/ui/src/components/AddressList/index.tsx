import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getAddressList, getWalletIndex, getSetting } from '../../services/channels'
import { isSuccessResponse, shannonToCkb, formatAddress } from '../../utils'
import styles from './addressList.module.scss'

const copyAddress = (address: string) => {
  const element = document.createElement('textarea')
  element.value = address
  document.body.appendChild(element)
  element.select()
  document.execCommand('copy')
  document.body.removeChild(element)
  alert('Copied')
}

const checkWalletIndex = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
}

const AddressList = () => {
  const [list, setList] = useState<Channel.Address[]>([])
  const [walletId, setWalletId] = useState('')
  const [network, setNetwork] = useState<{ id: Channel.NetworkId; url: string } | null>(null)

  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex().then(res => {
      if (isSuccessResponse(res) && checkWalletIndex(res.result)) {
        setWalletId(res.result.current)
      }
    })
    const walletListener = (_e: any, p: { current: string; wallets: Channel.WalletProfile[] }) => {
      if (checkWalletIndex(p)) {
        setWalletId(p.current)
      }
    }

    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        const currentNetwork = res.result.networks[res.result.networkId]
        setNetwork(currentNetwork ? { id: res.result.networkId, url: currentNetwork.url } : null)
      }
    })
    const settingListener = (_e: Event, setting: Channel.Setting) => {
      const currentNetwork = setting.networks[setting.networkId]
      setNetwork(currentNetwork ? { id: setting.networkId, url: currentNetwork.url } : null)
    }

    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, walletListener)
    ipcRenderer.on(Channel.ChannelName.GetSetting, settingListener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, walletListener)
      ipcRenderer.removeListener(Channel.ChannelName.GetSetting, settingListener)
    }
  }, [setWalletId, setNetwork])

  useEffect(() => {
    const { ipcRenderer } = window
    if (walletId && network) {
      getAddressList({ id: walletId, networkId: network.id }).then(res => {
        if (isSuccessResponse(res)) {
          setList(res.result)
        }
      })
    }
    const addressListener = (_e: Event, list: Channel.Address[]) => {
      if (list && list.length > 0) {
        setList(list)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetAddrList, addressListener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetAddrList, addressListener)
    }
  }, [setList, walletId, network])

  return (
    <div className={styles.container}>
      {list.map(address => (
        <div key={address.address} className={styles.item}>
          <span className={styles.tag}>{address.tag}</span>
          <div
            className={styles.address}
            id="address"
            onClick={() => copyAddress(address.address)}
            title={address.address}
          >
            {formatAddress(address.address)}
          </div>
          <div className={styles.capacity}>
            <div>
              <span>Free</span>
              <span>{shannonToCkb(address.free)}</span>
            </div>
            <span className={styles.separate} />
            <div>
              <span>In Use</span>
              <span>{shannonToCkb(address.inUse)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
