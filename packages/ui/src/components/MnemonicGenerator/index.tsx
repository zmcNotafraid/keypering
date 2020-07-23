import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { AlertCircle as AlertCircleIcon } from 'react-feather'
import { getMnemonic } from '../../services/channels'
import { isSuccessResponse } from '../../utils'
import styles from './mnemonicGenerator.module.scss'

const MnemonicGenerator = ({ onNext }: {onNext: (mnemonic: string) => void}) => {
  const [mnemonic, setMnemonic] = useState('')
  const history = useHistory()

  const updateMnemonic = useCallback(() => getMnemonic()
    .then(res => {
      if (isSuccessResponse(res)) {
        setMnemonic(res.result)
      } else {
        throw new Error(res.message)
      }
    })
    .catch(() => {
      // handle error
    }), [setMnemonic])

  const handleGoBack = () => history.goBack()
  const hadnleGoNext = () => {
    onNext(mnemonic)
  }

  useEffect(() => {
    updateMnemonic()
  }, [updateMnemonic])

  return (
    <div className={styles.container}>
      <h1>Your new wallet seed has been generated</h1>
      <textarea value={mnemonic} readOnly />
      <div className={styles.info}>
        <AlertCircleIcon size={12} />
        <span>Write down your wallet seed and save it in a safe place</span>
      </div>
      <button className={styles.regenerate} type="button" aria-label="regenerate" onClick={updateMnemonic}>Regenerate</button>
      <div className={styles.buttons}>
        <button type="button" onClick={handleGoBack}>Cancel</button>
        <button type="button" onClick={hadnleGoNext}>Next</button>
      </div>
    </div>
  )
}
export default MnemonicGenerator
