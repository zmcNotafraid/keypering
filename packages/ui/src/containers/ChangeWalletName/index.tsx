import React from 'react'
import styles from './changeWalletName.module.scss'
import { useHistory } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useState } from 'react'
import { getWalletIndex, updateWalletName } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'

const ChangeWalletName = () => {
  const [name, setName] = useState('')
  const history = useHistory()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleSubmit = () => {
    getWalletIndex().then(res => {
      if (isSuccessResponse(res) && res.result.current) {
        const id = res.result.current
        updateWalletName({ id, name }).then(res => {
          if (isSuccessResponse(res)) {
            history.push(Routes.Main)
          } else {
            throw new Error(res.message)
          }
        })
      }
    })
  }

  return (
    <div className={styles.container}>
      <TextField label="New Wallet Name" fieldName="walletName" type="text" onChange={handleInput} />
      <button type="submit" disabled={!name} onClick={handleSubmit}>
        Confirm
      </button>
    </div>
  )
}
export default ChangeWalletName
