export default (id: string, time: string, salt: string) => {
  console.warn("This is just for demo")
  return `${id}:${time}:${salt}`
}
