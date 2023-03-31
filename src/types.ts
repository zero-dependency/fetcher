import { METHODS } from './constants.js'

export type FetcherOptions = Pick<
  RequestInit,
  'headers' | 'credentials' | 'mode' | 'cache' | 'redirect' | 'referrerPolicy'
>

export type FetcherParams = Record<string, string | number>

export type FetcherRequestInit = Omit<RequestInit, 'method'> & {
  params?: FetcherParams
}

export type FetcherRequestOptions = FetcherRequestInit & {
  method: FetcherMethods
}

export type FetcherMethods = typeof METHODS[number]

export type FetcherRequest = <T>(
  path: string,
  options?: FetcherRequestInit
) => Promise<T>
