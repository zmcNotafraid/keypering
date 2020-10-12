import type { KeyperingAgency } from '@keypering/specs'
import { Container } from '@nervosnetwork/keyper-container'
import { SignatureAlgorithm } from '@nervosnetwork/keyper-specs'
import ECPair from '@nervosnetwork/ckb-sdk-utils/lib/ecpair'
import { getSetting } from '../setting'

export const signTx = (sk: string, params: Omit<KeyperingAgency.SignTransaction.Params['params'], 'description'>) => {

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

export const signMsg = (sk: string, message: string) => {
  const key  = new ECPair(sk)
  let hexMessage = Buffer.from(message).toString('hex')
  // needs 32 bytes length
  if (hexMessage.length < 64){
    hexMessage = hexMessage.padEnd(64, "0")
  }
  return key.sign(`0x${hexMessage}`)
}
