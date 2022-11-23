import { METHODS } from './constants.js'
import { FetcherError } from './fetcher-error.js'
import { combineHeaders, combineURLs } from './helpers.js'
import { Interceptor } from './interceptor.js'
import type {
  FetcherRequest,
  FetcherRequestInit,
  FetcherRequestInitOptions,
  FetcherRequestOptions
} from './types.js'

export class Fetcher {
  private readonly interceptors = new Interceptor()

  get: FetcherRequest
  post: FetcherRequest
  put: FetcherRequest
  patch: FetcherRequest
  delete: FetcherRequest

  constructor(
    private readonly baseURL: string,
    private readonly options?: FetcherRequestInitOptions
  ) {
    for (const method of METHODS) {
      // @ts-ignore
      this[method.toLowerCase()] = (
        path: string,
        init?: FetcherRequestInit
      ) => {
        return this.request(path, { ...init, method })
      }
    }
  }

  get interceptor() {
    return this.interceptors
  }

  extends(path: string, options?: FetcherRequestInitOptions): Fetcher {
    const { url, init } = this.fetcherParameters(path, options)
    return new Fetcher(url, init)
  }

  async request<T>(path: string, options?: FetcherRequestOptions) {
    const { url, init } = this.fetcherParameters(path, options)
    return (await this.interceptors.request(url, init)) as T
  }

  private fetcherParameters(path: string, options?: FetcherRequestInitOptions) {
    const url = combineURLs(this.baseURL, path)
    const headers = combineHeaders(this.options?.headers!, options?.headers!)
    const init = { ...this.options, ...options, headers }
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
