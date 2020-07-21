import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './address_list.module.scss'
import Balance from '../balance'
import Address from '../address'
import Tag from '../tag'

interface AddressWithAmount extends API.AddressInfo {
  freeAmount: string
  inUseAmount: string
}

interface AddressListProps {
  addresses: AddressWithAmount[]
}

const AddressList = ({ addresses }: AddressListProps) => {
  const view = addresses.map(({ address, lockScript, lockHash, lockScriptMeta, freeAmount, inUseAmount }) => (
    <div className={styles.item} key={address}>
      <Tag>{lockScriptMeta.name}</Tag>
      <Address className={styles.address} value={address} />
      <Flex>
        <Flex.Item className={styles.freeContainer}>
          <div className={styles.freeLabel}>Free</div>
          <Balance value={freeAmount} className={styles.balance} />
        </Flex.Item>
        <Flex.Item className={styles.inUseContainer}>
          <div className={styles.inUseLabel}>In Use</div>
          <Balance value={inUseAmount} className={styles.balance} />
        </Flex.Item>
      </Flex>
    </div>
  ))
  return <div>{view}</div>
}
export default AddressList
