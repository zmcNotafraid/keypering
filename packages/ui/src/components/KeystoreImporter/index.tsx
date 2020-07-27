import React, { useReducer, useState } from 'react'
import { useHistory } from 'react-router-dom'
import TextField from '../TextField'
import { importKeystore } from '../../services/channels'
import { isSuccessResponse, Routes } from '../../utils'
import styles from './keystoreImporter.module.scss'

const initState = {
  keystore: '',
  name: '',
  password: '',
}

type FormState = typeof initState

const reducer = (state: FormState, { fieldName, value }: { fieldName: keyof FormState; value: string }) => {
  switch (fieldName) {
    case 'name':
    case 'password':
    case 'keystore': {
      return { ...state, [fieldName]: value }
    }
    default: {
      return state
    }
  }
}

const KeystoreImporter = () => {
  const [form, dispatch] = useReducer(reducer, initState)
  const [submitting, setSubmitting] = useState(false)
  const history = useHistory()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      value,
      files,
      dataset: { fieldName },
    } = e.target
    dispatch({ fieldName: fieldName as keyof FormState, value: files ? files[0].path : value })
  }

  const disabled = Object.values(form).some(v => !v) || submitting
  const handleConfirm = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!disabled) {
      setSubmitting(true)
      importKeystore({ name: form.name, keystorePath: form.keystore, password: form.password })
        .then(res => {
          if (isSuccessResponse(res)) {
            history.push(Routes.HomePage)
            window.alert(res.code)
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  }

  return (
    <form className={styles.container} onSubmit={handleConfirm}>
      <h1>Import keystore</h1>
      <div className={styles.fields}>
        <TextField
          label="Keystore File"
          fieldName="keystore"
          type="file"
          disabled={submitting}
          onChange={handleInput}
        />
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
      </div>
      <div className={styles.buttons}>
        <button type="button" onClick={() => history.goBack()}>
          Back
        </button>
        <button type="submit" disabled={disabled}>
          Confirm
        </button>
      </div>
    </form>
  )
}

export default KeystoreImporter
