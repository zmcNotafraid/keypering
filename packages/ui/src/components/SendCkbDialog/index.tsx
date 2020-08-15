import React, { useState, useReducer, useRef, useEffect } from 'react'
import TextField from '../TextField'
import { showAlert } from '../../services/channels'
import styles from './sendCkbDialog.module.scss'

export interface FormState {
  address: string
  amount: string
}

const formState: FormState = {
  address: '',
  amount: '',
}

const reducer: React.Reducer<FormState, { type: keyof FormState | 'reset'; payload: string }> = (state, action) => {
  switch (action.type) {
    case 'amount':
    case 'address': {
      return { ...state, [action.type]: action.payload }
    }
    case 'reset': {
      return formState
    }
    default: {
      return state
    }
  }
}
interface SendCkbDialogProps {
  onSubmit: (params: FormState) => Promise<boolean>
  onCancel: () => void
  show: boolean
}

const SendCkbDialog = ({ onSubmit, onCancel, show }: SendCkbDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, dispatch] = useReducer(reducer, formState)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const disabled = isSubmitting

  useEffect(() => {
    const ref = dialogRef.current
    if (ref) {
      ref.addEventListener('close', onCancel)
    }
    return () => {
      if (ref) {
        ref.removeEventListener('close', onCancel)
      }
    }
  }, [dialogRef, onCancel])

  useEffect(() => {
    if (show) {
      if (!dialogRef.current?.open) {
        // eslint-disable-next-line
        dialogRef.current?.showModal()
      }
    } else {
      setIsSubmitting(false)
      dispatch({ type: 'reset', payload: '' })
      // eslint-disable-next-line
      dialogRef.current?.close()
    }
  }, [show, dialogRef, dispatch, setIsSubmitting])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (disabled) {
      return
    }
    setIsSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      showAlert({
        message: err.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      dataset: { fieldName },
      value,
    } = e.target
    dispatch({ type: fieldName as keyof FormState, payload: value })
  }

  return (
    <dialog ref={dialogRef} className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h1>Send CKBytes</h1>
        <div className={styles.fields}>
          <TextField fieldName="address" label="Send to" value={form.address} onChange={handleInput} autoFocus />
          <TextField fieldName="amount" label="Amount" value={form.amount} onChange={handleInput} />
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onCancel} disabled={disabled}>
            Cancel
          </button>
          <button type="submit" disabled={disabled} onClick={handleSubmit} data-is-submitting={isSubmitting}>
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default SendCkbDialog
