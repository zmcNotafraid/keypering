export const SECP256K1_SCRIPT: { CODE_HASH: string; HASH_TYPE: CKBComponents.ScriptHashType } = {
  CODE_HASH: '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8',
  HASH_TYPE: 'type',
}

export const SECP256K1_SCRIPT_DEPS: Record<
  'ckb' | 'ckb_test',
  { codeHash: string; hashType: CKBComponents.ScriptHashType; outPoint: CKBComponents.OutPoint }
> = {
  ckb: {
    codeHash: SECP256K1_SCRIPT.CODE_HASH,
    hashType: SECP256K1_SCRIPT.HASH_TYPE,
    outPoint: {
      txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
      index: '0x0',
    },
  },
  ckb_test: {
    codeHash: SECP256K1_SCRIPT.CODE_HASH,
    hashType: SECP256K1_SCRIPT.HASH_TYPE,
    outPoint: {
      txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
      index: '0x0',
    },
  },
}

export default { SECP256K1_SCRIPT, SECP256K1_SCRIPT_DEPS }
