import React from 'react'
import MainHeader from '../../components/MainHeader'
import AuthList from '../../components/AuthList'
import TxList from '../../components/TxList'
import AddressList from '../../components/AddressList'
import styles from './main.module.scss'

const Main = () => (
  <div className={styles.container}>
    <MainHeader />
    <div>
      <AddressList />
      <TxList />
      <AuthList />
    </div>
  </div>
)

export default Main
