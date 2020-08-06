import React, { useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import TextField from '../TextField'
import { createWallet } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'
import styles from './walletSubmitForm.module.scss'

interface WalletSubmitFormProps {
  mnemonic: string
  onBack: () => void
}
const initState = {
  name: '',
  password: '',
  rePassword: '',
}

type FormState = typeof initState

const reducer = (state: FormState, { fieldName, value }: { fieldName: keyof FormState; value: string }) => {
  switch (fieldName) {
    case 'name':
    case 'password':
    case 'rePassword': {
      return { ...state, [fieldName]: value }
    }
    default: {
      return state
    }
  }
}

const WalletSubmitForm = ({ mnemonic, onBack }: WalletSubmitFormProps) => {
  const [form, dispatch] = useReducer(reducer, initState)
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      value,
      dataset: { fieldName },
    } = e.target
    dispatch({ fieldName: fieldName as keyof FormState, value })
  }

  const rePasswordError =
    form.password && form.rePassword && form.password !== form.rePassword ? 'Please re-confirm password' : undefined

  const disabled = Object.values(form).some(v => !v) || !!rePasswordError || submitting
  const handleConfirm = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!disabled) {
      setSubmitting(true)
      createWallet({ name: form.name, password: form.password, mnemonic })
        .then(res => {
          if (isSuccessResponse(res)) {
            history.push(Routes.Main)
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  return (
    <form className={styles.container} onSubmit={handleConfirm}>
      <h1>Setup your new wallet</h1>
      <div className={styles.fields}>
        <TextField
          label="Wallet Name"
          fieldName="name"
          value={form.name}
          onChange={handleInput}
          disabled={submitting}
        />
        <TextField
          label="Password"
          fieldName="password"
          value={form.password}
          onChange={handleInput}
          type="password"
          disabled={submitting}
        />
        <TextField
          label="Confirm Password"
          fieldName="rePassword"
          value={form.rePassword}
          onChange={handleInput}
          type="password"
          disabled={submitting}
          error={rePasswordError}
        />
      </div>
      <div className={styles.buttons}>
        <button type="button" onClick={onBack}>
          Back
        </button>
        <button type="submit" disabled={disabled}>
          Confirm
        </button>
      </div>
    </form>
  )
}

export default WalletSubmitForm
