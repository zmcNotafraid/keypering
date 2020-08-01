import React from 'react'
import styles from './textField.module.scss'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string
  label?: string
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const TextField = ({
  fieldName,
  label,
  error,
  value,
  onChange,
  ...rest
}: TextFieldProps) => (
  <div className={styles.container}>
    {label ? <label>{label}</label> : null}
    <input
      data-field-name={fieldName}
      value={value}
      onChange={onChange}
      {...rest}
    />
    {error ? <span className={styles.error}>{error}</span> : null}
  </div>
)

export default TextField
