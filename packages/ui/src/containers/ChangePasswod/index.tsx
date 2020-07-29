import React from 'react'
import styles from './changePassword.module.scss'
import { useHistory } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useState } from 'react'
import { getWalletIndex, updateWalletName } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'

const ChangePassword = () => {
  const [name, setName] = useState('')
  const history = useHistory()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleBack = () => {
    history.push(Routes.Main)
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
      <h2>Change Wallet Name</h2>
      <TextField label="Current Password" fieldName="currentPassword" type="password" onChange={handleInput} />
      <TextField label="New Password" fieldName="newPassword" type="password" onChange={handleInput} />
      <TextField label="Confirm Password" fieldName="repPassword" type="password" onChange={handleInput} />
      <div className={styles.buttons}>
        <button type="button" onClick={handleBack}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} disabled={!name}>
          Confirm
        </button>
      </div>
    </div>
  )
}
export default ChangePassword
