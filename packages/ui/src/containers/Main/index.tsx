import React, { useMemo } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import MainHeader from '../../components/MainHeader'
import SendCkb from '../../components/SendCkb'
import AuthList from '../../components/AuthList'
import TxList from '../../components/TxList'
import AddressList from '../../components/AddressList'
import { Routes } from '../../utils'
import styles from './main.module.scss'

enum Tab {
  Address = 'address',
  Transaction = 'transaction',
  Authorization = 'authorization',
}

const Main = () => {
  const { tab: active = Tab.Address } = useParams<{ tab?: Tab }>()
  const list = useMemo(() => {
    switch (active) {
      case Tab.Address: {
        return <AddressList />
      }
      case Tab.Transaction: {
        return <TxList />
      }
      case Tab.Authorization: {
        return <AuthList />
      }
      default: {
        return null
      }
    }
  }, [active])
  return (
    <div className={styles.container}>
      <MainHeader />
      <div className={styles.balance}>
        <SendCkb />
      </div>
      <div className={styles.listContainer}>
        <div className={styles.listTabs}>
          {[Tab.Address, Tab.Transaction, Tab.Authorization].map(tab => (
            <NavLink to={`${Routes.Main}/${tab}`} key={tab} data-is-active={tab === active ? true : null}>
              {tab}
            </NavLink>
          ))}
        </div>
        <div className={styles.listBody}>
          {list}
        </div>
      </div>
    </div>
  )
}

export default Main
