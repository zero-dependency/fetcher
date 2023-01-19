import { METHODS } from './constants.js'
import type { FetcherError } from './fetcher-error.js'

// Fetcher
export type FetcherRequestInitOptions = Pick<
  RequestInit,
  'headers' | 'credentials' | 'mode' | 'cache' | 'redirect' | 'referrerPolicy'
>

export type FetcherRequestInit = Omit<RequestInit, 'method'>

export type FetcherRequestOptions = FetcherRequestInit & {
  method: FetcherMethods
}

export type FetcherMethods = typeof METHODS[number]

export type FetcherRequest = <T>(
  path: string,
  options?: FetcherRequestInit
) => Promise<T>

type FetcherResponse = Response

// Interceptors
export namespace FetcherInterceptor {
  export interface Response {
    response: (response: FetcherResponse) => void
    responseError?: (error: FetcherError<FetcherResponse>) => void
  }

  export interface Request {
    request: (url: string, init: RequestInit) => [string, RequestInit]
    requestError?: (error: FetcherError<FetcherResponse>) => void
  }

  export type Interceptor = Response | Request
}
