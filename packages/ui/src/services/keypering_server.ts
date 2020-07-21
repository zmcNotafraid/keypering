import type { API } from '@keypering/specs'
import Storage from "./storage"
import { getLiveCell, getLiveCellsByLockHash } from "./rpc"
import { formatDate } from "../widgets/timestamp"
import { camelCaseKey } from "./misc"

export function sendAck(token: any, payload: any) {
  const { __TAURI__ } = window as any
  __TAURI__.invoke({
    cmd: "webSocketResponse",
    token,
    payload: JSON.stringify(payload),
  })
}

export default class KeyperingServer {
  constructor(public history: any, public addresses: API.AddressInfo[]) {
    this.install()
  }

  install() {
    window.document.addEventListener("ws-event", this.handleWsEvent)
  }

  uninstall() {
    window.document.removeEventListener("ws-event", this.handleWsEvent)
  }

  requestAuth = async (request: API.AuthRequest): Promise<API.AuthResponse | void> => {
    const { history } = this
    history.push("/authorization_request")
  };

  queryAddresses = async (request: API.QueryAddressesRequest): Promise<API.QueryAddressesResponse | void> => {
    const { id } = request
    const { addresses } = this
    return {
      id,
      jsonrpc: "2.0",
      result: {
        addresses,
      }
    } as API.QueryAddressesResponse
  };

  queryLiveCells = async (request: API.QueryLiveCellsRequest): Promise<API.QueryLiveCellsResponse | void> => {
    const { id, params } = request
    const { lockHash, withData } = params
    let liveCells = await getLiveCellsByLockHash(lockHash, "0x0", "0x32")
    liveCells = camelCaseKey(liveCells) as API.LiveCell[]
    if (withData) {
      await Promise.all(liveCells.map(async (cell: any) => {
        const cellWithData = await getLiveCell({ tx_hash: cell.createdBy.txHash, index: cell.createdBy.index }, true)
        cell.data = camelCaseKey(cellWithData.cell.data)
      }))
    }
    return {
      id,
      jsonrpc: "2.0",
      result: {
        liveCells,
      }
    } as API.QueryLiveCellsResponse
  };

  signSend = async (url: string, request: API.SignSendRequest): Promise<API.SignSendResponse | void> => {
    const { id, params } = request
    const { description, tx } = params
    const txMeta = {
      url,
      state: "pending",
      description,
      timestamp: formatDate(new Date().getTime()),
    }
    const storage = Storage.getStorage()
    await storage.addTransaction(id, txMeta, tx)
    this.history.push("/transaction_request")
  };

  handleWsEvent = async (msg: any) => {

    const { detail } = msg
    const request = JSON.parse(detail.payload)
    const { token: wsToken } = detail

    const storage = Storage.getStorage()
    await storage.setCurrentRequest({
      payload: request,
      token: wsToken,
    })

    const { id, method, params } = request
    let response
    if (method === "auth") {
      response = await this.requestAuth(request as API.AuthRequest)
    } else {
      const { token } = params
      const auth = await storage.getAuthorization(token)
      if (!auth) {
        sendAck(wsToken, {
          id,
          jsonrpc: "2.0",
          error: {
            code: 1,
            message: "Invalid token"
          }
        })
        return
      }

      if (method === "query_addresses") {
        response = await this.queryAddresses(request as API.QueryAddressesRequest)
      } else if (method === "query_live_cells") {
        response = await this.queryLiveCells(request as API.QueryLiveCellsRequest)
      } else if (method === "sign" || method === "sign_send") {
        response = await this.signSend(auth.origin, request as API.SignSendRequest)
      }

      if (response) {
        sendAck(wsToken, response)
      }
    }
  };


}
