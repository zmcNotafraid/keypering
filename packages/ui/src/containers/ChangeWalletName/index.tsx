import React from 'react'
import styles from './changeWalletName.module.scss'
import { useHistory } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useState } from 'react'
import { getWalletIndex, updateWalletName } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'

const ChangeWalletName = () => {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleBack = () => {
    history.push(Routes.Main)
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (name) {
      setSubmitting(true)
      getWalletIndex()
        .then(res => {
          if (isSuccessResponse(res) && res.result.current) {
            const id = res.result.current
            updateWalletName({ id, name }).then(res => {
              if (isSuccessResponse(res)) {
                history.push(Routes.Main)
              }
            })
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  return (
    <div className={styles.container}>
      <h2>Change Wallet Name</h2>
      <TextField
        label="New Wallet Name"
        fieldName="walletName"
        type="text"
        onChange={handleInput}
        disabled={submitting}
      />
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
export default ChangeWalletName
