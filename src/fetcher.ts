import { METHODS } from './constants.js'
import { FetcherError } from './fetcher-error.js'
import { combineHeaders, combineURLs } from './helpers.js'
import type {
  FetcherOptions,
  FetcherParams,
  FetcherRequest,
  FetcherRequestOptions
} from './types.js'

export class Fetcher {
  #baseURL: string
  #options: FetcherOptions

  get: FetcherRequest
  post: FetcherRequest
  put: FetcherRequest
  patch: FetcherRequest
  delete: FetcherRequest

  constructor(baseURL: string, options: FetcherOptions = {}) {
    this.#baseURL = baseURL
    this.#options = options

    for (const method of METHODS) {
      this[method] = (path, init) => {
        return this.request(path, { ...init, method })
      }
    }
  }

  /**
   * Create a new Fetcher instance with the same configuration
   *
   * @param path - The path to extend the baseURL with
   * @param options - The options to extend the current options with
   * @returns The new Fetcher instance
   */
  extends(path: string, options?: FetcherOptions): Fetcher {
    const params = this.fetcherParameters(path, options)
    return new Fetcher(...params)
  }

  /**
   * Make a request to the API using the Fetcher instance configuration
   *
   * @param path - The path to make the request to
   * @param options - The options to use for the request
   * @returns The response data
   */
  async request<T>(path: string, options?: FetcherRequestOptions): Promise<T> {
    if (options?.params) {
      path = this.pathParams(path, options?.params)
      delete options.params
    }

    const params = this.fetcherParameters(path, options)
    return await fetcher(...params)
  }

  private fetcherParameters(path: string, options?: FetcherOptions) {
    const url = combineURLs(this.#baseURL, path)
    const headers = combineHeaders(this.#options.headers!, options?.headers!)
    const init = { ...this.#options, ...options, headers }
    return [url, init] as const
  }

  private pathParams(path: string, params: FetcherParams) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, `${value}`)
    }
    return path
  }
}

/**
 * Make a request to the API using the Fetcher instance configuration
 *
 * @param args - The arguments to pass to fetch
 * @returns The response data
 */
export async function fetcher<T = unknown>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const response = await fetch(...args)
  const data = await response.json()

  if (!response.ok) {
    throw new FetcherError({
      message: response.statusText,
      response,
      data
    })
  }

  return data
}
