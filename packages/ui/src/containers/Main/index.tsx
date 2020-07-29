import React, { useState } from 'react'
import AuthList from '../../components/AuthList'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './main.module.scss'
import { getWalletIndex } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'
import { Channel } from '@keypering/specs'
import WalletManager from '../../components/WalletManager'

const Main = () => {
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
        }
      })
      .catch(() => {
        history.push(Routes.Welcome)
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
