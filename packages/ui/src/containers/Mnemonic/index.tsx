import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import MnemonicGenerator from '../../components/MnemonicGenerator'
import MnemonicImporter from '../../components/MnemonicImporter'
import WalletSubmitForm from '../../components/WalletSubmitForm'
import styles from './mnemonic.module.scss'

enum Step {
  Generate,
  Validate,
  Submit,
}

const Mnemonic = () => {
  const [mnemonic, setMnemonic] = useState('')
  const history = useHistory()
  const { type } = useParams<{ type: 'create' | 'import' }>()
  const [step, setStep] = useState(type === 'create' ? Step.Generate : Step.Validate)
  const handleMnemonic = (value: string) => {
    setMnemonic(value)
    setStep(s => s + 1)
  }
  const handleBack = () => {
    if (type === 'import' && step === Step.Validate) {
      history.goBack()
    } else {
      setStep(s => s - 1)
    }
  }

  switch (step) {
    case Step.Generate: {
      return (
        <div className={styles.container}>
          <MnemonicGenerator onNext={handleMnemonic} />
        </div>
      )
    }
    case Step.Validate: {
      return (
        <div className={styles.container}>
          <MnemonicImporter generated={mnemonic} onNext={handleMnemonic} onBack={handleBack} />
        </div>
      )
    }
    default: {
      return (
        <div className={styles.container}>
          <WalletSubmitForm onBack={handleBack} mnemonic={mnemonic} />
        </div>
      )
    }
  }
}
export default Mnemonic
