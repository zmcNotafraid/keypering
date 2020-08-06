import type { KeyperingAgency } from '@keypering/specs'
import { Container } from '@keyper/container'
import { SignatureAlgorithm } from '@keyper/specs'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { getSetting } from '../setting'

const sign = (sk: string, params: Omit<KeyperingAgency.SignTransaction.Params['params'], 'description'>) => {

  const container = new Container([
    {
      algorithm: SignatureAlgorithm.secp256k1,
      provider: {
        sign(_: any, message: string | Uint8Array) {
          const key = new ECPair(sk)
          return key.signRecoverable(message)
        },
      },
    },
  ])

  const { locks } = getSetting()

  Object.values(locks).forEach(lock => {
    try {
      if (lock.enabled) {
        container.addLockScript(lock.ins)
      }
    } catch (err) {
      console.error(`[${__filename}]: adding lock ${lock.name} => ${err.message}`)
    }
  })

  container.addPublicKey({ payload: new ECPair(sk).publicKey, algorithm: SignatureAlgorithm.secp256k1 })

  return container.sign({ lockHash: params.lockHash }, params.tx, params.inputSignConfig)
}

export default sign
