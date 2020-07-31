import { Channel } from '@keypering/specs'

const {
  ipcRenderer: { invoke },
} = window

export const createWallet = (params: Channel.CreateWallet.Params): Promise<Channel.CreateWallet.Response> =>
  invoke(Channel.ChannelName.CreateWallet, params)
export const getMnemonic = (): Promise<Channel.GetMnemonic.Response> => invoke(Channel.ChannelName.GetMnemonic)
export const importKeystore = (params: Channel.ImportKeystore.Params): Promise<Channel.ImportKeystore.Response> =>
  invoke(Channel.ChannelName.ImportKeystore, params)

export const getWalletIndex = (): Promise<Channel.GetWalletIndex.Response> => invoke(Channel.ChannelName.GetWalletIndex)

export const selectWallet = (params: Channel.SelectWallet.Params): Promise<Channel.SelectWallet.Response> =>
  invoke(Channel.ChannelName.SelectWallet, params)

export const updateWalletName = (params: Channel.UpdateWallet.Params): Promise<Channel.UpdateWallet.Response> =>
  invoke(Channel.ChannelName.UpdateWallet, params)

export const backupWallet = (): Promise<Channel.BackupWallet.Response> => invoke(Channel.ChannelName.BackupWallet)

export const deleteWallet = (): Promise<Channel.DeleteWallet.Response> => invoke(Channel.ChannelName.DeleteWallet)

export const updatePassword = (params: Channel.SubmitPassword.Params): Promise<Channel.SubmitPassword.Response> =>
  invoke(Channel.ChannelName.SubmitPassword, params)

export const getAuthList = (): Promise<Channel.GetAuthList.Response> => invoke(Channel.ChannelName.GetAuthList)

export const revokeAuth = (params: Channel.DeleteAuth.Params): Promise<Channel.DeleteAuth.Response> =>
  invoke(Channel.ChannelName.DeleteAuth, params)

export const getSetting = (): Promise<Channel.GetSetting.Response> => invoke(Channel.ChannelName.GetSetting)

export const updateSetting = (params: Channel.UpdateSetting.Params): Promise<Channel.UpdateSetting.Response> =>
  invoke(Channel.ChannelName.UpdateSetting, params)

export const getTxList = (): Promise<Channel.GetTxList.Response> =>
  invoke(Channel.ChannelName.GetTxList)

export const openInBrowser = (params: Channel.OpenInBrowser.Params): Promise<Channel.OpenInBrowser.Response> =>
  invoke(Channel.ChannelName.OpenInBrowser, params)

export const updateScriptDir = () => invoke(Channel.ChannelName.UpdateScriptsDir)
