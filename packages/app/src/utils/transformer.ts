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
  return +unsignedCKB === 0
    ? '0'
    : `${sign}${unsignedCKB}`
}

export const networksToRpcUrl = (params: { networkId: string, networks: Record<string, { url: string }> }) => {
  const indexerUrl = params.networks[params.networkId]?.url
  if (indexerUrl) {
    return [...indexerUrl.split('/').slice(0, -1), 'rpc'].join('/')
  }
  throw new Error('Url is empty')
}

export default { shannonToCkb, networksToRpcUrl }
