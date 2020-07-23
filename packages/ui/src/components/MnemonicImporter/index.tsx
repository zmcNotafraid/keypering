import React, { useState, useRef, useEffect } from 'react'
import styles from './mnemonicImporter.module.scss'

interface MnemonicImporterProps {
  generated: string
  onNext: (mnemonic: string) => void
  onBack: () => void
}
const MnemonicImporter = ({ generated, onNext, onBack }: MnemonicImporterProps) => {
  const [mnemonic, setMnemonic] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (inputRef.current?.focus) {
      inputRef.current.focus()
    }
  }, [inputRef])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMnemonic(e.target.value)
  }
  const handleNext = () => {
    onNext(mnemonic)
  }

  const warn = mnemonic && generated && mnemonic !== generated ? 'Please re-confirm mnemonic' : undefined
  const disabled = !!warn || !mnemonic

  return (
    <div className={styles.container}>
      <h1>Enter Mnemonic</h1>
      <textarea ref={inputRef} value={mnemonic} onChange={handleChange} />
      {warn ? <span className={styles.warn}>{warn}</span> : null}
      <div className={styles.buttons}>
        <button type="button" onClick={onBack}>Back</button>
        <button type="button" onClick={handleNext} disabled={disabled}>Next</button>
      </div>
    </div>
  )
}

export default MnemonicImporter
