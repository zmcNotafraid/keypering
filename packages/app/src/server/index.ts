import path from 'path'
import http from 'http'
import dotenv from 'dotenv'
import { KeyperingAgency } from '@keypering/specs'
import setCors from './setCors'
import routes from './routes'
import { validateJsonRpcFields } from '../utils'

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const PORT = process.env.PORT

if (!PORT) {
  throw new Error(`Port is required`)
}

http
  .createServer((req, res) => {
    setCors(res)
    const {
      method,
      headers: { origin = '', referer = '' },
    } = req

    switch (method) {
      case 'OPTIONS': {
        res.statusCode = 200
        res.end()
        break
      }
      case 'POST': {
        let data = ''
        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })
        req.on('end', async () => {
          data = Buffer.concat(chunks).toString('utf8')
          let parsed: any = {}

          try {
            parsed = JSON.parse(data)
            validateJsonRpcFields(parsed)
            const result = await routes(parsed.method, parsed.params, { origin, referer })
            res.statusCode = 200
            res.end(JSON.stringify({ id: parsed.id, jsonrpc: parsed.jsonrpc, result }))
          } catch (err) {
            res.statusCode = 200
            res.end(
              JSON.stringify({
                id: parsed.id,
                jsonrpc: '2.0',
                error: err.code || KeyperingAgency.Code.UnknownError,
                message: err.message,
              })
            )
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
  })
  .listen(PORT, () => {
    console.info(`Server is running on ${PORT}`)
  })
