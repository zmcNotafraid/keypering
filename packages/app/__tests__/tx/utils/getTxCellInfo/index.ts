import { getTxCellInfo } from '../../../../src/tx/utils'
import fixtures from './fixtures.json'

describe('Test getTxCellInfo', () => {
  const fixtureTable = Object.entries(fixtures).map(([name, { params, expected }]: any) => [name, params, expected])
  test.each(fixtureTable)(`%s`, (_name, params: [any], expected) => {
    expect.assertions((1))
    expect(getTxCellInfo(...params)).toEqual(expected)
  })
})
