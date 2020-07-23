import type { Channel } from '@keypering/specs'

const { ipcRenderer: { invoke } } = window

const channelName: { [key: string]: Channel.ChannelName } = {
  createWallet: 'create-wallet',
  getMnemonic: 'get-mnemonic',
}

export const createWallet = (params: Channel.CreateWallet.Params): Promise<Channel.CreateWallet.Response> =>
  invoke(channelName.createWallet, params)
export const getMnemonic = (): Promise<Channel.GetMnemonic.Response> => invoke(channelName.getMnemonic)
