import React, { useEffect } from 'react'
import styles from './walletSelector.module.scss'
import { createPortal } from 'react-dom'
import { Channel } from '@keypering/specs'
import { getWalletIndex, selectWallet } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import { useState } from 'react'

const dialogRoot = document.getElementById('dialog') as HTMLDivElement

const checkWalletIndex = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
}

const WalletSelector = ({ show, setShow }: { show?: boolean; setShow: Function }) => {
  const element = document.createElement('div')
  const [walletIndex, setWalletIndex] = useState<{ current: string; wallets: Channel.WalletProfile[] }>({
    current: '',
    wallets: [],
  })

  const handleSelectWallet = (id: string) => {
    selectWallet({id}).then(res => {
      if (isSuccessResponse(res)) {
        setShow(false)
      }
    })
  }

  const hideSelector = () => {
    setShow(false)
  }

  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex().then(res => {
      if (isSuccessResponse(res) && checkWalletIndex(res.result)) {
        setWalletIndex(res.result)
      }
    })
    const listener = (_e: any, p: { current: string; wallets: Channel.WalletProfile[] }) => {
      if (checkWalletIndex(p)) {
        setWalletIndex(p)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, listener)
    }
  }, [setWalletIndex])

  useEffect(() => {
    dialogRoot.appendChild(element)
    return () => {
      dialogRoot.removeChild(element)
    }
  }, [element])

  return show
    ? createPortal(
        <div className={styles.container} onClick={hideSelector}>
          <div className={styles.navs}>
            {walletIndex.wallets.map(wallet => (
              <button key={wallet.name} onClick={() => {handleSelectWallet(wallet.id)}}>
                {wallet.name}
              </button>
            ))}
          </div>
        </div> ,
        element
      )
    : null
}
export default WalletSelector
