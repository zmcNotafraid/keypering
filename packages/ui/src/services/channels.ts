import { Channel } from '@keypering/specs'

const {
  ipcRenderer: { invoke },
} = window

export const createWallet = (params: Channel.CreateWallet.Params): Promise<Channel.CreateWallet.Response> =>
  invoke(Channel.ChannelName.CreateWallet, params)
export const getMnemonic = (): Promise<Channel.GetMnemonic.Response> => invoke(Channel.ChannelName.GetMnemonic)
export const importKeystore = (params: Channel.ImportKeystore.Params): Promise<Channel.ImportKeystore.Response> =>
  invoke(Channel.ChannelName.ImportKeystore, params)

export const getAuthList = (): Promise<Channel.GetAuthList.Response> => invoke(Channel.ChannelName.GetAuthList)

export const revokeAuth = (params: Channel.DeleteAuth.Params): Promise<Channel.DeleteAuth.Response> =>
  invoke(Channel.ChannelName.DeleteAuth, params)

export const getSetting = (): Promise<Channel.GetSetting.Response> =>
  invoke(Channel.ChannelName.GetSetting)

export const updateSetting = (params: Channel.UpdateSetting.Params): Promise<Channel.UpdateSetting.Response> =>
  invoke(Channel.ChannelName.UpdateSetting, params)
