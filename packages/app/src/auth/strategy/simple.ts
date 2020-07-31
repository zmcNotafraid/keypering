export default (id: string, time: string, salt: string) => {
  return `${id}:${time}:${salt}`
}
