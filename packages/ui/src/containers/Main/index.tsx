import React, { useState } from 'react'
import AuthList from '../../components/AuthList'
import { useEffect } from 'react'
import styles from './main.module.scss'
import { getWalletIndex } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import { Channel } from '@keypering/specs'
import WalletManager from '../../components/WalletManager'

const Main = () => {
  const [currentWallet, setCurrentWallet] = useState<Channel.WalletProfile>({ name: '', id: '', xpub: '' })
  const [showWalletManager, setShowWalletManager] = useState(false)

  const toggleWalletManager = () => setShowWalletManager(!showWalletManager)

  useEffect(() => {
    getWalletIndex().then(res => {
      if (isSuccessResponse(res) && res.result.wallets.length > 0) {
        setCurrentWallet(res.result.wallets[0])
      }
    })
  }, [])

  return (
    <div className={styles.container}>
      <h1>{currentWallet.name}</h1>
      <div>
        <AuthList />
      </div>

      <button onClick={toggleWalletManager}>Wallet Manager</button>
      <WalletManager show={showWalletManager} setShow={setShowWalletManager} />
    </div>
  )
}

export default Main
