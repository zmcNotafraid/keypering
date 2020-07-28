import type { ServerResponse } from 'http'
export default (res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json")
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}
