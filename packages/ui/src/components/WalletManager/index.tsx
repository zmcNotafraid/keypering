import React, { useEffect } from 'react'
import styles from './walletManager.module.scss'
import { createPortal } from 'react-dom'
import { useHistory } from 'react-router-dom'
import { backupWallet, deleteWallet } from '../../services/channels'
import { Routes, isSuccessResponse } from '../../utils'

const dialogRoot = document.getElementById('dialog') as HTMLDivElement

const WalletManager = ({ show, setShow }: { show?: boolean; setShow: Function }) => {
  const element = document.createElement('div')
  const history = useHistory()

  const changeWalletName = () => {
    history.push(Routes.ChangeWalletName)
    setShow(false)
  }

  const handleBackupWallet = () => {
    backupWallet().then(res => {
      if (isSuccessResponse(res)) {
        setShow(false)
      }
    })
  }

  const handleDeleteWallet = () => {
    deleteWallet().then(res => {
      if (isSuccessResponse(res)) {
        setShow(false)
        if (!res.result) {
          history.push(Routes.Welcome)
        }
      }
    })
  }

  useEffect(() => {
    dialogRoot.appendChild(element)
    return () => {
      dialogRoot.removeChild(element)
    }
  }, [element])

  return show
    ? createPortal(
        <div className={styles.container} onClick={() => setShow(false)}>
          <div className={styles.modal}>
            <div className={styles.navs}>
              <button onClick={changeWalletName}>Change Wallet Name</button>
              <button>Change Password</button>
              <button onClick={handleBackupWallet}>Backup Wallet</button>
              <button onClick={handleDeleteWallet}>Delete Wallet</button>
            </div>
          </div>
        </div>,
        element
      )
    : null
}
export default WalletManager
