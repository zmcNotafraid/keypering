import React from 'react'
import MainHeader from '../../components/MainHeader'
import AuthList from '../../components/AuthList'
import TxList from '../../components/TxList'
import styles from './main.module.scss'

const Main = () => (
  <div className={styles.container}>
    <MainHeader />
    <div>
      <TxList />
      <AuthList />
    </div>
  </div>
)

export default Main
