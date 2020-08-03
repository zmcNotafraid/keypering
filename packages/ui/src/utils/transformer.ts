export const datetime = (time: Date) => {
  const YYYY = time.getFullYear()
  const MM = (time.getMonth() + 1).toString().padStart(2, '0')
  const DD = time.getDate().toString().padStart(2, '0')
  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const ss = time.getSeconds().toString().padStart(2, '0')
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

export const shannonToCkb = (shannon = '0', showPositiveSign?: boolean, delimiter = ',') => {
  if (Number.isNaN(+shannon)) {
    console.warn('Shannon is not a valid number')
    return shannon
  }
  if (shannon === null) {
    return '0'
  }
  let sign = ''
  if (shannon.startsWith('-')) {
    sign = '-'
  } else if (showPositiveSign) {
    sign = '+'
  }
  const unsignedShannon = shannon.replace(/^-?0*/, '')
  let unsignedCKB = ''
  if (unsignedShannon.length <= 8) {
    unsignedCKB = `0.${unsignedShannon.padStart(8, '0')}`.replace(/\.?0+$/, '')
  } else {
    const decimal = `.${unsignedShannon.slice(-8)}`.replace(/\.?0+$/, '')
    const int = unsignedShannon.slice(0, -8).replace(/\^0+/, '')
    unsignedCKB = `${(
      int
        .split('')
        .reverse()
        .join('')
        .match(/\d{1,3}/g) || ['0']
    )
      .join(delimiter)
      .split('')
      .reverse()
      .join('')}${decimal}`
  }
  return +unsignedCKB === 0 ? '0' : `${sign}${unsignedCKB}`
}

export const formatAddress = (value: string, length = 40) => {
  if (value === undefined || value === null) { return '' }
  if (value.length <= length) { return value }
  const half = length / 2
  return `${value.substr(0, half)}...${value.substr(value.length - half, half)}`
}

export const CkbToShannon = (amount = '0') => {
  if (Number.isNaN(+amount)) {
    throw new Error('Amount is not a valid number')
  }
  const [integer = '0', decimal = ''] = amount.split('.')
  if (decimal.length > 8) {
    throw new Error(`Expect decimal to be 8, but ${decimal.length} received`)
  }
  const decimalLength = 10 ** decimal.length
  const num = integer + decimal
  return BigInt(num) * BigInt(1e8 / decimalLength)
}

export default { datetime, shannonToCkb, CkbToShannon, formatAddress }
