import React, { ReactEventHandler } from 'react'
import styles from './textField.module.scss'

interface TextFieldProps {
  fieldName: string
  type?: 'password' | 'text'
  label?:string
  error?: string
  value: string
  onChange: ReactEventHandler<HTMLInputElement>
  disabled?:boolean
}
const TextField = ({ fieldName, label, type = 'text', error, value, onChange, disabled = false }: TextFieldProps) =>
  (
    <div className={styles.container}>
      {label ? <label>{label}</label> : null}
      <input type={type} data-field-name={fieldName} value={value} onChange={onChange} disabled={disabled} />
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  )

export default TextField
