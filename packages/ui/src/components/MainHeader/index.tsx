import React, { useEffect, useState } from 'react'
import styles from './mainHeader.module.scss'
import { getWalletIndex } from '../../services/channels'
import { useHistory } from 'react-router'
import { Channel } from '@keypering/specs'
import { isSuccessResponse, Routes } from '../../utils'
import WalletManager from '../WalletManager'
import MenuIcon from '../../assets/menu.png'
import ManagerIcon from '../../assets/manager.png'
import DropdownIcon from '../../assets/dropdown.png'
import MainSidebar from '../MainSidebar'
import WalletList from '../WalletList'

const checkWalletIndex = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
}

const getCurrentWalletName = (walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
  const { current, wallets } = walletIndex
  return current && wallets.length > 0
    ? wallets.filter(wallet => wallet.id === current)[0].name
    : 'Unknown Wallet'
}

const MainHeader = () => {
  const [walletIndex, setWalletIndex] = useState<{ current: string; wallets: Channel.WalletProfile[] }>({
    current: '',
    wallets: [],
  })
  const [showWalletManager, setShowWalletManager] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showWalletList, setShowWalletList] = useState(false)
  const history = useHistory()

  const openWalletManager = () => setShowWalletManager(true)
  const openSidebar = () => setShowSidebar(true)
  const toggleWalletList = () => setShowWalletList(!showWalletList)
  
  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex()
      .then(res => {
        if (isSuccessResponse(res)) {
          if (checkWalletIndex(res.result)) {
            setWalletIndex(res.result)
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
    const listener = (_e: any, p: { current: string; wallets: Channel.WalletProfile[] }) => {
      if (checkWalletIndex(p)) {
        setWalletIndex(p)
      } else {
        history.push(Routes.Welcome)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, listener)
    }
  }, [setWalletIndex, history])

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <img onClick={openSidebar} src={MenuIcon} />
        <MainSidebar show={showSidebar} setShow={setShowSidebar} />
        <div className={styles.title}>
          <h1>{getCurrentWalletName(walletIndex)}</h1>
          <img src={DropdownIcon} onClick={toggleWalletList} />
          <WalletList show={showWalletList} setShow={setShowWalletList} />
        </div>
        <img onClick={openWalletManager} src={ManagerIcon} />
        <WalletManager show={showWalletManager} setShow={setShowWalletManager} />
      </div>
    </div>
  )
}

export default MainHeader
