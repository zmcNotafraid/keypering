import React from 'react'
import styles from './changePassword.module.scss'
import { useHistory } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useState } from 'react'
import { updatePassword } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'
import { useReducer } from 'react'

const initState = {
  currentPassword: '',
  newPassword: '',
  rePassword: '',
}

type FormState = typeof initState

const reducer = (state: FormState, { fieldName, value }: { fieldName: keyof FormState; value: string }) => {
  switch (fieldName) {
    case 'currentPassword':
    case 'newPassword':
    case 'rePassword': {
      return { ...state, [fieldName]: value }
    }
    default: {
      return state
    }
  }
}

const ChangePassword = () => {
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
    form.newPassword && form.rePassword && form.newPassword !== form.rePassword
      ? 'Please re-confirm password'
      : undefined

  const handleBack = () => {
    history.push(Routes.Main)
  }

  const disabled = Object.values(form).some(v => !v) || !!rePasswordError || submitting
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!disabled) {
      setSubmitting(true)
      const { currentPassword, newPassword } = form
      updatePassword({ currentPassword, newPassword }).then(res => {
        if (isSuccessResponse(res) && res.result) {
          alert('Change password successfully')
          history.push(Routes.Main)
        }
      }).finally(() => {
        setSubmitting(false)
      })
    }
  }

  return (
    <div className={styles.container}>
      <h2>Change Wallet Password</h2>
      <TextField
        label="Current Password"
        fieldName="currentPassword"
        type="password"
        onChange={handleInput}
        disabled={submitting}
      />
      <TextField
        label="New Password"
        fieldName="newPassword"
        type="password"
        onChange={handleInput}
        disabled={submitting}
      />
      <TextField
        label="Confirm Password"
        fieldName="rePassword"
        type="password"
        onChange={handleInput}
        disabled={submitting}
      />
      <div className={styles.buttons}>
        <button type="button" onClick={handleBack}>
          Back
        </button>
        <button type="button" onClick={handleSubmit} disabled={disabled}>
          Confirm
        </button>
      </div>
    </div>
  )
}
export default ChangePassword
