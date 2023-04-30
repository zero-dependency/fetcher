import { describe, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { FetcherError } from '../src/fetcher-error.js'
import { Fetcher, fetcher } from '../src/fetcher.js'

interface MockResponse {
  id: number
  userId: number
  title: string
  body: string
}

const mockResponse = (): MockResponse => ({
  userId: 1,
  id: 1,
  title: 'lorem ipsum',
  body: 'lorem ipsum'
})

const fetchMock = createFetchMock(vi)
fetchMock.enableMocks()

describe('Fetcher', (test) => {
  const fetcher = new Fetcher('https://jsonplaceholder.typicode.com', {
    headers: {
      'X-Test': 'foo',
      'X-Null': 'bar'
    }
  })

  test('should be defined', () => {
    expect(fetcher.get).toBeDefined()
    expect(fetcher.post).toBeDefined()
    expect(fetcher.put).toBeDefined()
    expect(fetcher.patch).toBeDefined()
    expect(fetcher.delete).toBeDefined()
    expect(fetcher.request).toBeDefined()
    expect(fetcher.extends).toBeDefined()
    expect(fetcher.options).toBeDefined()
  })

  test('should return a response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse()))
    const response = await fetcher.get<MockResponse>('/posts/1')
    expect(response).toEqual(mockResponse())
  })

  test('should return a response with path params', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse()))
    const response = await fetcher.get<MockResponse>('/posts/:postId', {
      params: { postId: 1 }
    })
    expect(response).toEqual(mockResponse())
  })

  test('extends should return a new fetcher', () => {
    const newFetcher = fetcher.extends('/posts')
    expect(newFetcher).toBeInstanceOf(Fetcher)
    expect(newFetcher).not.toBe(fetcher)
  })

  test('empty path, used basePath', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse()))
    const response = await fetcher.get('')
    expect(response).toEqual(mockResponse())
  })

  test('combine headers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse()))
    const response = await fetcher.get('/posts/1', {
      headers: {
        'X-Test': 'bar', // override
        'X-Test2': 'test'
      }
    })
    expect(response).toEqual(mockResponse())
  })
})

describe('fetcher', (test) => {
  test('should be defined', () => {
    expect(fetcher).toBeDefined()
  })

  test('should return a response', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse()))
    const response = await fetcher<MockResponse>(
      'https://jsonplaceholder.typicode.com/posts/1'
    )
    expect(response).toEqual(mockResponse())
  })

  test('should return error', async () => {
    fetchMock.mockResponseOnce('{}', {
      status: 404,
      statusText: 'Not Found'
    })

    try {
      await fetcher<MockResponse>(
        'https://jsonplaceholder.typicode.com/posts/bad'
      )
    } catch (err) {
      expect(err).toBeInstanceOf(FetcherError)
      expect(err.message).toBe('Not Found')
    }
  })
})
