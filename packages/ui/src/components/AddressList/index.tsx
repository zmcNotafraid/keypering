import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getAddressList, getWalletIndex } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './addressList.module.scss'

const adaptAddress = (value: string) => {
  if (value === undefined || value === null) return ''
  if (value.length <= 40) return value
  return `${value.substr(0, 20)}...${value.substr(value.length - 20, 20)}`
}

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

  const fetchAddressList = (id: string) => {
    getAddressList({ id }).then(res => {
      if (isSuccessResponse(res)) {
        setList(res.result)
      }
    })
  }

  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex().then(res => {
      if (isSuccessResponse(res) && checkWalletIndex(res.result)) {
        fetchAddressList(res.result.current)
      }
    })
    const listener = (_e: any, p: { current: string; wallets: Channel.WalletProfile[] }) => {
      if (checkWalletIndex(p)) {
        fetchAddressList(p.current)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, listener)
    }
  }, [])

  return (
    <div className={styles.container}>
      {list.map(address => (
        <div key={address.address} className={styles.item}>
          <span className={styles.tag}>{adaptAddress(address.tag)}</span>
          <div className={styles.address} id="address" onClick={() => copyAddress(address.address)}>
            {adaptAddress(address.address)}
          </div>
          <div className={styles.capacity}>
            <div>
              <span>Free</span>
              <span>{(address.free / 10 ** 8).toFixed(8)}</span>
            </div>
            <span className={styles.separate} />
            <div>
              <span>In Use</span>
              <span>{(address.inUse / 10 ** 8).toFixed(8)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
