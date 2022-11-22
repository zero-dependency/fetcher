import { METHODS } from './constants.js'
import { FetcherError } from './fetcher-error.js'
import { combineHeaders, combineURLs } from './helpers.js'
import type {
  FetcherInit,
  FetcherMethod,
  FetcherRequest,
  RequestMethods
} from './types.js'

export class Fetcher {
  get: FetcherMethod
  post: FetcherMethod
  put: FetcherMethod
  patch: FetcherMethod
  delete: FetcherMethod

  constructor(
    private readonly baseURL: string,
    private readonly baseInit?: FetcherInit
  ) {
    for (const method of METHODS) {
      // @ts-ignore
      this[method.toLowerCase()] = (path: string, init?: FetcherRequest) => {
        return this.request(path, { ...init, method })
      }
    }
  }

  extends(path: string, baseInit?: FetcherInit): Fetcher {
    const { url, init } = this.fetcherParameters(path, baseInit)
    return new Fetcher(url, init)
  }

  async request<T>(
    path: string,
    initRequest: FetcherRequest & { method: RequestMethods }
  ): Promise<T> {
    const { url, init } = this.fetcherParameters(path, initRequest)
    return await fetcher<T>(url, init)
  }

  private fetcherParameters(path: string, baseInit?: FetcherInit) {
    const url = combineURLs(this.baseURL, path)
    const headers = combineHeaders(this.baseInit?.headers!, baseInit?.headers!)
    const init = { ...this.baseInit, ...baseInit, headers }
    return { url, init }
  }
}

export async function fetcher<T = unknown>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const response = await fetch(...args)
  const data = (await response.json()) as T

  if (response.ok) {
    return data
  }

  throw new FetcherError({
    response,
    data
  })
}
