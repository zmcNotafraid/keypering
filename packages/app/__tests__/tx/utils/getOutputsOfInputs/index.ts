jest.mock('node-fetch')

import { getOutputsOfInputs } from '../../../../src/tx/utils'
import fixtures from './fixtures.json'
import mockTx from '../../../../__mock__/transactions/txOfMockInput'

import fetchMock from 'node-fetch'

describe('Test getTxCellInfo', () => {
  beforeAll(() => {
    const mockId = 1
    jest.spyOn(global.Math, 'random').mockReturnValue(mockId);
    (fetchMock as any).mockResolvedValue({
      json() {
        return [{
          id: mockId * 10000,
          jsonrpc: '2.0',
          result: {
            transaction: mockTx,
            tx_status: {
              block_hash: '0xa22d0246be61068bf8dbadc9f75d969538f52081ad235b2d3b0df7d79cb1478c',
              status: 'committed',
            },
          },
        }]

      }
    })

  })
  afterAll(() => {
    jest.restoreAllMocks()
  })

  const fixtureTable = Object.entries(fixtures).map(([name, { params, expected }]: any) => [name, params, expected])
  test.each(fixtureTable)(`%s`, async (_name, params: [any], expected) => {
    expect.assertions(1)
    const actual = await getOutputsOfInputs(...params)
    expect(actual).toEqual(expected)
  })
})
