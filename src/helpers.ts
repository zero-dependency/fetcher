// https://github.com/axios/axios/blob/v1.x/lib/helpers/combineURLs.js
export function combineURLs(baseURL: string, path?: string): string {
  return path
    ? baseURL.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
    : baseURL
}

export function combineHeaders(...sources: HeadersInit[]): Headers {
  const result: Record<string, string> = {}

  for (const source of sources) {
    const headers = new Headers(source)

    for (const [key, value] of headers.entries()) {
      result[key] = value
    }
  }

  return new Headers(result)
}
