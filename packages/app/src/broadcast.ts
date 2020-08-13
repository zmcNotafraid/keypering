import { Channel } from '@keypering/specs'
import type { getWalletIndex } from './wallet'
import type { getTxList } from './tx'
import type { getSetting } from './setting'
import type { getAuthList } from './auth'
import MainWindow from './MainWindow'

export const broadcastWalletIndex = (walletIndex: ReturnType<typeof getWalletIndex>) => {
  MainWindow.broadcast<{ current: string; wallets: Channel.WalletProfile[] }>(
    Channel.ChannelName.GetWalletIndex,
    walletIndex
  )
}

export const broadcastTxList = (list: ReturnType<typeof getTxList>) => {
  MainWindow.broadcast<Channel.GetTxList.TxProfile[]>(Channel.ChannelName.GetTxList, list)
}

export const broadcastSetting = (setting: ReturnType<typeof getSetting>) => {
  MainWindow.broadcast(Channel.ChannelName.GetSetting, setting)
}

export const broadcastAuthList = (list: ReturnType<typeof getAuthList>) => {
  MainWindow.broadcast<Channel.GetAuthList.AuthProfile[]>(
    Channel.ChannelName.GetAuthList,
    list.map(auth => ({ url: auth.url, time: auth.time }))
  )
}
