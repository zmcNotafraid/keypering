import { shannonToCkb, messageToHex } from '../../../src/utils/transformer'
import fixtures from './fixtures.json'

describe('Test transformer', () => {
  describe('Test shannonToCkb', () => {
    const fixtureTable = fixtures.shannonToCkb
    test.each(fixtureTable)(`%s`, fixture => {
      expect(shannonToCkb(fixture.shannons as string)).toBe(fixture.expected)
    })

    it('should start with + when show positive is true', () => {
      expect(shannonToCkb('123', true)).toBe('+0.00000123')
    })
    it('should have no comma if delimiter is empty string', () => {
      expect(shannonToCkb('1234567890123456789', false, '')).toBe('12345678901.23456789')
    })
  })

  describe('Test messageToHex', () => {
    it('returns correct length hex', () => {
      expect(messageToHex('helloCKB')).toBe('0x68656c6c6f434b42000000000000000000000000000000000000000000000000')
    })

    it('throws error', () => {
      expect( () => { messageToHex("I am a string and I will longer than 32bytes") }).toThrow('Message length greater than 32 bytes')
    })
  })
})
