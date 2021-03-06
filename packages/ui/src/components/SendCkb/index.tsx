import React, { useState, useEffect, useCallback } from 'react'
import { Channel } from '@keypering/specs'
import Core from '@nervosnetwork/ckb-sdk-core'
import { blake160, bech32Address } from '@nervosnetwork/ckb-sdk-utils'
import { EMPTY_WITNESS_ARGS } from '@nervosnetwork/ckb-sdk-utils/lib/const'
import SendCkbDialog, { FormState } from '../SendCkbDialog'
import { getWalletIndex, getSetting, requestSign, showAlert, getAddressList } from '../../services/channels'
import { getEnoughCellsByAddress } from '../../services/rpc'
import { isSuccessResponse, shannonToCkb, CkbToShannon, SECP256K1_SCRIPT_DEPS } from '../../utils'
import styles from './sendCkb.module.scss'

const getArgs = (params: { current: string; wallets: Channel.WalletProfile[] }) => {
  const wallet = params.wallets.find(w => w.id === params.current)
  if (wallet) {
    const pk = wallet.childXpub.slice(0, 66)
    const args = `0x${blake160(`0x${pk}`, 'hex')}`
    return args
  }
  return ''
}

const getSum = (shannons: string[]) => shannons.reduce((sum, s) => sum + BigInt(s), BigInt(0))

const SendCkb = () => {
  const [walletId, setWalletId] = useState('')
  const [args, setArgs] = useState('')
  const [currentNetworkId, setCurrentNetworkId] = useState<Channel.NetworkId>('' as any)
  const [network, setNetwork] = useState<{ id: string; url: string } | null>(null)
  const [balance, setBalance] = useState<bigint | string>('-')
  const [dialogShow, setDialogShow] = useState(false)

  useEffect(() => {
    const { ipcRenderer } = window
    getWalletIndex().then(res => {
      if (isSuccessResponse(res)) {
        setArgs(getArgs(res.result))
        setWalletId(res.result.current)
      } else {
        // ignore, handled by ipc
      }
    })

    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        const currentNetwork = res.result.networks[res.result.networkId]
        setNetwork(currentNetwork ? { id: res.result.networkId, url: currentNetwork.url } : null)
        setCurrentNetworkId(res.result.networkId)
      }
    })

    const walletListener = (_e: Event, walletIndex: { current: string; wallets: Channel.WalletProfile[] }) => {
      setArgs(getArgs(walletIndex))
      setWalletId(walletIndex.current)
    }

    const settingListener = (_e: Event, setting: Channel.Setting) => {
      const currentNetwork = setting.networks[setting.networkId]
      setNetwork(currentNetwork ? { id: setting.networkId, url: currentNetwork.url } : null)
      setCurrentNetworkId(setting.networkId)
    }

    const addrListListener = (_e: Event, addrList: Channel.Address[]) => {
      if (addrList?.length) {
        const sum = getSum(addrList.map(addr => addr.free))
        setBalance(sum)
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetWalletIndex, walletListener)
    ipcRenderer.on(Channel.ChannelName.GetSetting, settingListener)
    ipcRenderer.on(Channel.ChannelName.GetAddrList, addrListListener)

    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetWalletIndex, walletListener)
      ipcRenderer.removeListener(Channel.ChannelName.GetSetting, settingListener)
      ipcRenderer.removeListener(Channel.ChannelName.GetAddrList, addrListListener)
    }
  }, [setArgs, setNetwork])

  useEffect(() => {
    setBalance('-')
    if (walletId && currentNetworkId) {
      getAddressList({ id: walletId, networkId: currentNetworkId }).then(res => {
        if (isSuccessResponse(res)) {
          const sum = getSum(res.result.map(addr => addr.free))
          setBalance(sum)
        }
      })
    }
  }, [setBalance, walletId, currentNetworkId])

  const handleOpenDialog = useCallback(() => setDialogShow(true), [setDialogShow])
  const handleCloseDialog = useCallback(() => setDialogShow(false), [setDialogShow])
  const handleSubmitSend: (form: FormState) => Promise<boolean> = useCallback(
    async form => {
      if (!form.address || !form.amount) {
        throw new Error('Address and amount are required')
      }
      if (!network) {
        throw new Error('Network is not set')
      }
      if (!args) {
        throw new Error('Wallet is not set')
      }
      const rpcUrl = [...network.url.split('/').slice(0, -1), 'rpc'].join('/')
      const core = new Core(rpcUrl)
      const deps = SECP256K1_SCRIPT_DEPS[network.id as keyof typeof SECP256K1_SCRIPT_DEPS]
        || (await core.loadDeps().then(config => config.secp256k1Dep!))
      try {
        const requiredShannon = CkbToShannon(form.amount)

        const fromAddress = bech32Address(args, {
          prefix: network.id === 'ckb' ? core.utils.AddressPrefix.Mainnet : core.utils.AddressPrefix.Testnet,
          type: core.utils.AddressType.HashIdx,
          codeHashOrCodeHashIndex: '0x00',
        })

        const cells = await getEnoughCellsByAddress(fromAddress, requiredShannon, network.url)

        const params = {
          fromAddress,
          toAddress: form.address,
          fee: '0x0',
          capacity: `0x${requiredShannon.toString(16)}`,
          cells,
          safeMode: true,
          deps,
        }

        const txTpl = core.generateRawTransaction(params)
        const EXTRA_TX_SIZE = 4
        const txSize = core.utils.serializeRawTransaction(txTpl).length / 2 + EXTRA_TX_SIZE
        const feeRate = 1500 // this is roughly estimated
        const fee = BigInt(txSize * feeRate) / BigInt(1000)
        const tx = core.generateRawTransaction({ ...params, fee })
        tx.witnesses = tx.inputs.map(() => '0x')
        tx.witnesses[0] = EMPTY_WITNESS_ARGS
        tx.cellDeps = []
        const signedRes = await requestSign({ tx })
        setDialogShow(false)
        if (isSuccessResponse(signedRes)) {
          const { hash, ...txToSend } = signedRes.result.tx
          console.info(`Sending tx: ${hash}`)
          await core.rpc.sendTransaction(txToSend)
        } else {
          console.warn(`[Error handled by Main Process]: ${signedRes.message}`)
        }
        return true
      } catch (err) {
        if (err.message === 'Expect address send to a short version one') {
          showAlert({
            message: 'Please enter a short version address of secp256k1 lock',
          })
          return false
        }
        showAlert({
          message: err.message,
        })
        return false
      }
    },
    [args, network, setDialogShow]
  )

  return (
    <div className={styles.container}>
      <h1>Balance</h1>
      <div className={styles.balance}>
        {`${typeof balance === 'bigint' ? shannonToCkb(balance.toString()) : balance} CKB`}
      </div>
      <button type="button" onClick={handleOpenDialog}>
        Send
      </button>
      <SendCkbDialog
        onSubmit={handleSubmitSend}
        onCancel={handleCloseDialog}
        show={dialogShow}
        networkId={currentNetworkId}
      />
    </div>
  )
}

export default SendCkb
