import React, { useState, useEffect, useRef } from 'react'
import { Channel } from '@keypering/specs'
import { Copy } from 'react-feather'
import { getAddressList, getWalletIndex, getSetting } from '../../services/channels'
import { isSuccessResponse, shannonToCkb } from '../../utils'
import styles from './addressList.module.scss'

const checkWalletIndex = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
}

const AddressList = () => {
  const [list, setList] = useState<Channel.Address[]>([])
  const [walletId, setWalletId] = useState('')
  const [network, setNetwork] = useState<{ id: Channel.NetworkId; url: string } | null>(null)
  const [copied, setCopied] = useState('')
  const copyTimerRef = useRef<NodeJS.Timeout>()

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
    const addressListener = (_e: Event, addrs: Channel.Address[]) => {
      if (addrs?.length > 0) {
        setList(addrs)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetAddrList, addressListener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetAddrList, addressListener)
    }
  }, [setList, walletId, network])

  const handleCopy = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { dataset: { address } } = e.currentTarget
    if (address) {
      window.navigator.clipboard.writeText(address)
      clearTimeout(copyTimerRef.current as any)
      setCopied(address)
      copyTimerRef.current = setTimeout(() => {
        setCopied('')
      }, 300)
    }
  }

  return (
    <div className={styles.container}>
      {list.map(address => (
        <div key={address.address} className={styles.item}>
          <span className={styles.tag}>{address.tag}</span>
          <div
            role="presentation"
            className={styles.address}
            id="address"
            title={address.address}
          >
            <span className={styles.addrLeading}>{address.address.slice(0, -10)}</span>
            <span>{address.address.slice(-10)}</span>
            <button
              title="Copy Address"
              type="button"
              data-address={address.address}
              onClick={handleCopy}
              disabled={copied === address.address}
            >
              <Copy size={12} />
            </button>
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
