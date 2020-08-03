import React, { useState, useEffect } from 'react'
import { Channel } from '@keypering/specs'
import { ArrowRight, CheckCircle, XCircle } from 'react-feather'
import { getTxList, getSetting, openInBrowser } from '../../services/channels'
import { isSuccessResponse, datetime } from '../../utils'
import styles from './txList.module.scss'

enum ExplorerUrl {
  Mainnet = 'https://explorer.nervos.org/',
  Testnet = 'https://explorer.nervos.org/aggron/'
}

const TxList = () => {
  const [list, setList] = useState<Channel.GetTxList.TxProfile[]>([])
  const [networkId, setNetworkId] = useState('')

  useEffect(() => {
    const { ipcRenderer } = window
    getTxList().then(res => {
      if (isSuccessResponse(res)) {
        setList(res.result.sort((tx1, tx2) => +tx2.time - +tx1.time))
      }
    })

    getSetting().then(res => {
      if (isSuccessResponse(res)) {
        setNetworkId(res.result.networkId)
      }
    })

    const listener = (_e: Event, txList: Channel.GetTxList.TxProfile[]) => {
      if (Array.isArray(txList)) {
        setList(txList.sort((tx1, tx2) => +tx2.time - +tx1.time))
      }
    }
    ipcRenderer.on(Channel.ChannelName.GetTxList, listener)
    return () => {
      ipcRenderer.removeListener(Channel.ChannelName.GetTxList, listener)
    }
  }, [setList, setNetworkId])

  const openExplorer = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { dataset: { txHash } } = e.currentTarget
    openInBrowser({ url: `${networkId === 'ckb' ? ExplorerUrl.Mainnet : ExplorerUrl.Testnet}transaction/${txHash}` })
  }

  const isOnExplorer = ['ckb', 'ckb_test'].includes(networkId)

  return (
    <div className={styles.container}>
      {list.map(tx => (
        <div key={`${tx.hash}:${tx.time}`} className={styles.item}>
          <span className={styles.originLabel}>Request from:</span>
          <span className={styles.originValue}>{tx.referer}</span>
          <span className={styles.metaLabel}>Meta Info:</span>
          <span className={styles.metaValue}>{tx.meta}</span>
          <div className={styles.status}>
            <time>{datetime(new Date(+tx.time))}</time>
            <span data-is-approved={tx.isApproved}>
              {tx.isApproved
                ? (
                  <>
                    <CheckCircle size={16} />
                    Approved
                  </>
                )
                : (
                  <>
                    <XCircle size={16} />
                    Declined
                  </>
                )}
            </span>
          </div>
          <button
            className={styles.explorer}
            type="button"
            data-tx-hash={tx.hash}
            hidden={!isOnExplorer || !tx.isApproved}
            onClick={openExplorer}
          >
            <ArrowRight size={12} color="#fff" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default TxList
