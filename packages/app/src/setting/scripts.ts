import type { Channel } from '@keypering/specs'

export interface Script {
  codeHash: string
  hashType: CKBComponents.ScriptHashType
  algorithm: Channel.LockAlgorithm
}

const scripts = new Map<string, Script>([
  [
    'secp256k1',
    {
      codeHash: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
      hashType: 'type',
      algorithm: 'secp256k1'
    }
  ],
  [
    'any one can pay',
    {
      codeHash: '0x86a1c6987a4acbe1a887cca4c9dd2ac9fcb07405bbeda51b861b18bbf7492c4b',
      hashType: 'type',
      algorithm: 'secp256k1'
    }
  ]
])

export default scripts
