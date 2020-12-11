import { signMsg } from '../../src/keyper/sign'

describe("Test signMsg", () => {
  const info = {
    sk: '0xe79f3207ea4980b7fed79956d5934249ceac4751a4fae01a0f7c4a96884bc4e3',
    message: 'HelloWorld',
    signture: '0x97ed8c48879eed50743532bf7cc53e641c501509d2be19d06e6496dd944a21b4509136f18c8e139cc4002822b2deb5cbaff8e44b8782769af3113ff7fb8bd92700'
  }

  it('signMsg', () => {
    expect(signMsg(info.sk, info.message))
      .toEqual(info.signture)
  })
})