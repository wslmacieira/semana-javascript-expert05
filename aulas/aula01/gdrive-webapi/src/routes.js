import { logger } from "./logger";

export default class Routes {
  io
  constructor() { }

  setSocketInstance(io) {
    this.io = io
  }

  async defaultRoute(request, response) {
    response.end('hello world');
  }

  async options(request, response) {
    response.writeHead(204)
    response.end('hello world');
  }

  async get(request, response) {
    logger.info('get')
    response.end();
  }

  async post(request, response) {
    logger.info('post')
    response.end();
  }

  handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    const choosen = this[request.method.toLowerCase()] || this.defaultRoute()

    return choosen.apply(this, [request, response])
  }
}