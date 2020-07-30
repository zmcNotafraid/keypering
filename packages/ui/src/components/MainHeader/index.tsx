import React, { useEffect, useState } from 'react'
import styles from './mainHeader.module.scss'
import { getWalletIndex } from '../../services/channels'
import { useHistory } from 'react-router'
import { Channel } from '@keypering/specs'
import { isSuccessResponse, Routes } from '../../utils'
import WalletManager from '../WalletManager'

const MainHeader = () => {
  const [currentWallet, setCurrentWallet] = useState<Channel.WalletProfile>({ name: '', id: '', xpub: '' })
  const [showWalletManager, setShowWalletManager] = useState(false)
  const history = useHistory()

  const toggleWalletManager = () => setShowWalletManager(!showWalletManager)

  useEffect(() => {
    getWalletIndex()
      .then(res => {
        if (isSuccessResponse(res)) {
          const { current, wallets } = res.result
          if (current && wallets.length > 0) {
            setCurrentWallet(wallets.filter((wallet: Channel.WalletProfile) => wallet.id === current)[0])
          } else {
            history.push(Routes.Welcome)
          }
        } else {
          history.push(Routes.Welcome)
        }
      })
      .catch(() => {
        history.push(Routes.Welcome)
      })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <h1>{currentWallet.name}</h1>
        <button onClick={toggleWalletManager}>Manager</button>
        <WalletManager show={showWalletManager} setShow={setShowWalletManager} />
      </div>
    </div>
  )
}

export default MainHeader
