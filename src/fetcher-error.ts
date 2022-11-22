export class FetcherError<T> extends Error {
  response: Response
  data: T

  constructor({ response, data }: { response: Response; data: T }) {
    super(response.statusText)

    this.name = 'FetcherError'
    this.response = response
    this.data = data
  }
}
