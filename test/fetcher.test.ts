import { describe, expect, vi } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import { Fetcher } from '../src/index.js'

interface Response {
  id: number
  userId: number
  title: string
  body: string
}

const fetchMock = createFetchMock(vi)
fetchMock.enableMocks()

describe('new Fetcher', (test) => {
  const fetcher = new Fetcher('https://jsonplaceholder.typicode.com')

  const mockResponse = {
    userId: 1,
    id: 1,
    title: 'lorem ipsum',
    body: 'lorem ipsum'
  }

  test('should be defined', () => {
    expect(fetcher.get).toBeDefined()
    expect(fetcher.post).toBeDefined()
    expect(fetcher.put).toBeDefined()
    expect(fetcher.patch).toBeDefined()
    expect(fetcher.delete).toBeDefined()
    expect(fetcher.request).toBeDefined()
    expect(fetcher.extends).toBeDefined()
    expect(fetcher.interceptor).toBeDefined()
  })

  test('mockResponse', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse))
    const response = await fetcher.get<Response>('/posts/1')
    expect(response.body).toBe(mockResponse.body)
    expect(fetchMock.mock.calls.length).toBe(1)
  })
})
