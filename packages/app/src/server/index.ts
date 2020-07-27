import path from 'path'
import http from 'http'
import dotenv from 'dotenv'
import setCors from './setCors'
import routes from './routes'
import { validateJsonRpcFields } from '../utils'

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const PORT = process.env.PORT

if (!PORT) {
  throw new Error(`Port is required`)
}

http.createServer((req, res) => {
  const { method, headers: { origin = '' }, url = ''} = req
  setCors(res)

  switch (method) {
    case 'OPTIONS': {
      res.statusCode = 200
      res.end()
      break
    }
    case 'POST': {
      let data = ''
      const chunks: Buffer[] = []
      req.on('data', chunk => {
        chunks.push(chunk)
      })
      req.on('end', async () => {
        data = Buffer.concat(chunks).toString('utf8')
        try {
          const parsed = JSON.parse(data)
          validateJsonRpcFields(parsed)
          const result = await routes(parsed.method, parsed.params, { origin, url })
          res.statusCode = 200
          res.end(JSON.stringify({ id: parsed.id, jsonrpc: parsed.jsonrpc, result }))
        } catch (err) {
          res.statusCode = 200
          res.end(JSON.stringify({ error: err.code, message: err.message }))
        }
      })
      break
    }
    default: {
      res.statusCode = 404
      res.end()
      break
    }
  }

}).listen(PORT, () => {
  console.info(`Server is running on ${PORT}`)
})

