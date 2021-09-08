import https from 'https';
import fs from 'fs';
import { logger } from './logger.js'

const PORT = process.env.PORT || 3000;

const localHostSSL = {
  key: fs.readFileSync('./certificates/key.pem', 'utf-8'),
  key: fs.readFileSync('./certificates/cert.pem', 'utf-8'),
}

const server = https.createServer(
  localHostSSL,
  (req, res) => {
    res.end('hello world');
  }
)

const startServer = () => {
  const { address, port } = server.address()
  logger.info(`app runing at https://${address}:${port}`)
}

server.listen(PORT, startServer)
