import React, { useState, useReducer } from 'react'
import TextField from '../TextField'
import styles from './sendCkbDialog.module.scss'

interface FormState {
  amount: string
  password: string
}

const formState: FormState = {
  amount: '',
  password: '',
}

const reducer: React.Reducer<FormState, { type: keyof FormState; payload: string }> = (state, action) => {
  switch (action.type) {
    case 'amount':
    case 'password': {
      return { ...state, [action.type]: action.payload }
    }
    default: {
      return state
    }
  }
}

const SendCkbDialog = ({ onSubmit, onCancel }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, dispatch] = useReducer(reducer, formState)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    onSubmit()
    setIsSubmitting(false)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      dataset: { fieldName },
      value,
    } = e.target
    dispatch({ type: fieldName as keyof FormState, payload: value })
  }

  return (
    <dialog>
      <form onSubmit={handleSubmit} />
      <h1>send ckb dialog</h1>
      <div className={styles.fields}>
        <TextField key="amount" fieldName="Amount" onChange={handleInput} />
        <TextField key="amount" fieldName="Password" type="password" onChange={handleInput} />
      </div>

      <div className={styles.footer}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">Confirm</button>
      </div>
    </dialog>
  )
}

export default SendCkbDialog
