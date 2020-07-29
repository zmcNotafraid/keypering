export const datetime = (time: Date) => {
  const YYYY = time.getFullYear()
  const MM = (time.getMonth() + 1).toString().padStart(2, '0')
  const DD = time.getDate().toString().padStart(2, '0')
  const hh = time.getHours().toString().padStart(2, '0')
  const mm = time.getMinutes().toString().padStart(2, '0')
  const ss = time.getSeconds().toString().padStart(2, '0')
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

export default { datetime }
