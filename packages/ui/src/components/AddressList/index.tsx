import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { getAddressList } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './addressList.module.scss'

const AddressList = () => {
  const [list, setList] = useState<Channel.Address[]>([])
  useEffect(() => {
    getAddressList().then(res => {
      if (isSuccessResponse(res)) {
        setList(res.result)
      }
    })
  }, [setList])

  return (
    <div className={styles.container}>
      {list.map(address => (
        <div key={address.address} className={styles.item}>
          <span className={styles.tag}>{address.tag}</span>
          <span className={styles.address}>{address.address}</span>
          <div className={styles.capacity}>
            <div>
              <span>Free</span>
              <span>{address.free}</span>
            </div>
            <span className={styles.separate} />
            <div>
              <span>In Use</span>
              <span>{address.inUse}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
