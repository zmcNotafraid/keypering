import React, { useEffect } from 'react'
import styles from './mainSidebar.module.scss'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import CloseIcon from '../../assets/close.png'

const dialogRoot = document.getElementById('dialog') as HTMLDivElement

const MainSidebar = ({ show, setShow }: { show?: boolean; setShow: Function }) => {
  const element = document.createElement('div')

  const closeSidebar = () => {
    setShow(false)
  }

  useEffect(() => {
    dialogRoot.appendChild(element)
    return () => {
      dialogRoot.removeChild(element)
    }
  }, [element])

  return show
    ? createPortal(
        <div
          className={styles.container}
          onClick={() => setShow(false)}
        >
          <div className={styles.header}>
            <span>Keypering</span>
            <img src={CloseIcon} onClick={closeSidebar} />
          </div>
          <div className={styles.navs}>
            <div>Wallet</div>
            <span className={styles.separate} />
            <Link to="/create_wallet/create">Create a Wallet</Link>
            <Link to="/create_wallet/import">Import Wallet Seed</Link>
            <Link to="/import_keystore">Import from Keystore</Link>

            <div>Settings</div>
            <span className={styles.separate} />
          </div>
        </div>,
        element
      )
    : null
}
export default MainSidebar
