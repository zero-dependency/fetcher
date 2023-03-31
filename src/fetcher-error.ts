export class FetcherError<T> extends Error {
  response: Response
  data: T

  constructor({
    message,
    response,
    data
  }: {
    message: string
    response: Response
    data: T
  }) {
    super(message)

    this.name = 'FetchError'
    this.response = response
    this.data = data
  }
}
