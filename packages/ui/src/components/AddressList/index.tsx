import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getWalletIndex, getAddressList } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './addressList.module.scss'

const checkWalletIndex = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
}

const AddressList = () => {
  const [list, setList] = useState<Channel.Address[]>([
    {
      tag: 'Secp256k1',
      address: 'ckt1qyqvsv5240xeh85wvnau2eky8pwrhh4jr8ts8vyj37',
      freeCapacity: '3460.12000000',
      inUseCapacity: '9860.12345678',
    },
    {
      tag: 'AnyoneCanPay',
      address: 'ckt1qyqvsv5240xeh85wvnau2eky8pwrhh4jr8ts8vyj37',
      freeCapacity: '12460.12000000',
      inUseCapacity: '569860.12345678',
    },
  ])
  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex()
      .then(res => {
        if (isSuccessResponse(res) && checkWalletIndex(res.result)) {
          getAddressList(res.result.current).then(res => {
            if (isSuccessResponse(res)) {
              setList(res.result)
            }
          })
        } 
      })
    const listener = (_e: any, p: Channel.Address[]) => {
      if (Array.isArray(p)) {
        setList(p)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetAddressList, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetAddressList, listener)
    }
  }, [setList])

  return (
    <div className={styles.container}>
      {list.map(address => (
        <div key={address.address} className={styles.item}>
          <span className={styles.tag}>{address.tag}</span>
          <span className={styles.address}>{address.address}</span>
          <div className={styles.capacity}>
            <div>
              <span>Free</span>
              <span>{address.freeCapacity}</span>
            </div>
            <div className={styles.separate} />
            <div>
              <span>In Use</span>
              <span>{address.inUseCapacity}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
