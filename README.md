# @zero-dependency/fetcher

[![npm version](https://img.shields.io/npm/v/@zero-dependency/fetcher)](https://npm.im/@zero-dependency/fetcher)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@zero-dependency/fetcher)](https://bundlephobia.com/package/@zero-dependency/fetcher@latest)
![npm license](https://img.shields.io/npm/l/@zero-dependency/fetcher)

## Installation

```sh
npm install @zero-dependency/fetcher
```

```sh
yarn add @zero-dependency/fetcher
```

```sh
pnpm add @zero-dependency/fetcher
```

## Usage

```ts
import { Fetcher, fetcher } from '@zero-dependency/fetcher'

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

const api = new Fetcher('https://jsonplaceholder.typicode.com')
const post = await api.get<Post>('/posts/1')
console.log(post) // { id: 1, postId: 1, ... }
```
