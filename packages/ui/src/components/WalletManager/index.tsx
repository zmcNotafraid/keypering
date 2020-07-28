import React, { useEffect } from 'react'
import styles from './walletManager.module.scss'
import { createPortal } from 'react-dom'
import { useHistory } from 'react-router-dom'
import { Routes } from '../../utils'

const modalRoot = document.getElementById('root-modal') as HTMLDivElement

const WalletManager = ({ show, setShow }: { show?: boolean; setShow: Function }) => {
  const element = document.createElement('div')
  const history = useHistory()

  const openChangeWalletName = () => {
    history.push(Routes.ChangeWalletName)
    setShow(false)
  }

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
              <button onClick={openChangeWalletName}>Change Wallet Name</button>
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
