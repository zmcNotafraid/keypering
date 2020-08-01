import { parseAddress } from '@nervosnetwork/ckb-sdk-utils'
import getCellsByArgs, { CellObject } from './getCellsByArgs'

export const getEnoughCellsByAddress = async (address: string, minimum: bigint, indexerUrl: string) => {
  const payload = parseAddress(address, 'hex')
  if (!payload.startsWith('0x0100')) {
    throw new Error('Expect address send to a short version one')
  }

  const cells: { capacity: string, outPoint: CKBComponents.OutPoint, dataHash: string }[] = []
  let total = BigInt(0)
  let lastCursor: string | undefined
  const args = `0x${payload.slice(6)}`

  const EMPTY_DATA_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
  const fillCells = (cellObjects: CellObject[]) => {
    cellObjects.forEach(cellObject => {
      if (cellObject.output_data === '0x' && !cellObject.output.type) {
        total += BigInt(cellObject.output.capacity)
        cells.push({
          capacity: cellObject.output.capacity,
          outPoint: {
            txHash: cellObject.out_point.tx_hash,
            index: cellObject.out_point.index,
          },
          dataHash: EMPTY_DATA_HASH,
        })
      }
    })
  }

  const fetchAndFill = () => getCellsByArgs(args, indexerUrl, lastCursor).then(res => {
    if (res?.objects?.length) {
      fillCells(res.objects)
      lastCursor = res.last_cursor
      return cells
    }
    throw new Error(`Fail to fetch enough cells for ${minimum} shannons`)
  })

  return fetchAndFill().then(() => {
    if (total < minimum) {
      return fetchAndFill()
    }
    return cells
  })
}

export default getEnoughCellsByAddress
