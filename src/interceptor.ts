import type { FetcherInterceptor } from './types.js'

export class Interceptor {
  private readonly interceptors = new Set<any>()
  private fetch: typeof fetch

  constructor() {
    if (window && window.fetch) {
      this.fetch = window.fetch.bind(window)
    } else if (globalThis && globalThis.fetch) {
      this.fetch = globalThis.fetch.bind(globalThis)
    }
  }

  get values() {
    return this.interceptors.values()
  }

  request(...args: Parameters<typeof fetch>) {
    let promise = Promise.resolve(args)

    this.interceptors.forEach(({ request, requestError }) => {
      if (request || requestError) {
        // @ts-ignore
        promise = promise.then((args) => request(...args), requestError)
      }
    })

    promise = promise.then(async (args) => {
      const response = await this.fetch(...args)

      if (this.interceptors.size) {
        return response
      } else {
        return await response.json()
      }
    })

    this.interceptors.forEach(({ response, responseError }) => {
      if (response || responseError) {
        // @ts-ignore
        promise = promise.then(response, responseError)
      }
    })

    return promise
  }

  register(
    interceptor: FetcherInterceptor.Response | FetcherInterceptor.Request
  ): void {
    this.interceptors.add(interceptor)
  }

  unregister(
    interceptor: FetcherInterceptor.Response | FetcherInterceptor.Request
  ): void {
    this.interceptors.delete(interceptor)
  }

  clear(): void {
    this.interceptors.clear()
  }
}
