import React, { useEffect } from 'react'
import styles from './walletManager.module.scss'
import { createPortal } from 'react-dom'
import { useState } from 'react'

const modalRoot = document.getElementById('root-modal') as HTMLDivElement

const WalletManager = ({ show, setShow }: { show?: boolean; setShow: Function }) => {
  const element = document.createElement('div')

  useEffect(() => {
    modalRoot.appendChild(element)
    return () => {
      modalRoot.removeChild(element)
    }
  }, [element])

  return show
    ? createPortal(
        <div className={styles.container} onClick={() => setShow(false)}>
          <div className={styles.modal}>
            <div className={styles.navs}>
              <button>Change Wallet Name</button>
              <button>Change Password</button>
              <button>Backup Wallet</button>
              <button>Delete Wallet</button>
            </div>
          </div>
        </div>,
        element
      )
    : null
}
export default WalletManager
