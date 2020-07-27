import React from 'react'
import styles from './keystore.module.scss'
import KeystoreImporter from '../../components/KeystoreImporter'

const Keystore = () => (
  <div className={styles.container}>
    <KeystoreImporter />
  </div>
)

export default Keystore
