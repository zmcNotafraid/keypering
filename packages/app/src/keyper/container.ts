import type { Channel } from '@keypering/specs'
import { SignatureAlgorithm } from '@keyper/specs'
import { Container } from '@keyper/container'

import { Secp256k1LockScript } from '@keyper/container/lib/locks/secp256k1'
import { AnyPayLockScript } from '@keyper/container/lib/locks/anyone-can-pay'

const container = new Container([
  {
    algorightm: SignatureAlgorithm.secp256k1,
    provider: {
      padToEven: (value: string) => {
        if (typeof value !== 'string') {
          throw new Error(`Expect value to be string, but ${typeof value} received`)
        }
        return value.length % 2 ? `0${value}` : value
      },
    }
  }
])

container.addLockScript(
  new Secp256k1LockScript("0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8", "type", [
    {
      outPoint: {
        txHash: "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
        index: "0x0",
      },
      depType: "depGroup",
    },
  ])
)

container.addLockScript(
  new AnyPayLockScript("0x6a3982f9d018be7e7228f9e0b765f28ceff6d36e634490856d2b186acf78e79b", "type", [
    {
      outPoint: {
        txHash: "0x9af66408df4703763acb10871365e4a21f2c3d3bdc06b0ae634a3ad9f18a6525",
        index: "0x0",
      },
      depType: "depGroup",
    },
  ])
)

export const loadWallets = (wallets: Channel.WalletProfile[]) => {
  wallets.forEach(w => {
    container.addpublicKey({
      payload: w.xpub.slice(0, 66), // ?
      algorithm: 'any' // ?
    })
  })
}

export default container
