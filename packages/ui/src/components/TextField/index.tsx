import React from 'react'
import styles from './textField.module.scss'

interface TextFieldProps {
  fieldName: string
  type?: 'password' | 'text' | 'file'
  label?: string
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  readOnly?: boolean
}
const TextField = ({
  fieldName,
  label,
  type = 'text',
  error,
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: TextFieldProps) => (
  <div className={styles.container}>
    {label ? <label>{label}</label> : null}
    <input
      type={type}
      data-field-name={fieldName}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
    />
    {error ? <span className={styles.error}>{error}</span> : null}
  </div>
)

export default TextField
