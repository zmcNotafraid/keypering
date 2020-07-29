import React from 'react'
import AuthList from '../../components/AuthList'
import styles from './main.module.scss'
import MainHeader from '../../components/MainHeader'

const Main = () => {
  return (
    <div className={styles.container}>
      <MainHeader />
      <div>
        <AuthList />
      </div>
    </div>
  )
}

export default Main
