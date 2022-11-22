import { METHODS } from './constants.js'

export interface FetcherInit
  extends Pick<
    RequestInit,
    'headers' | 'credentials' | 'mode' | 'cache' | 'redirect' | 'referrerPolicy'
  > {}

export type FetcherRequest = Omit<RequestInit, 'method'>
export type RequestMethods = typeof METHODS[number]
export type FetcherMethod = <T>(
  path: string,
  init?: FetcherRequest
) => Promise<T>
