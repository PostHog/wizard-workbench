import { createServerFn } from '@tanstack/react-start'

export type User = {
  id: number
  name: string
  email: string
}

export const fetchUsers = createServerFn().handler(async () => {
  console.info('Fetching users...')
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = (await res.json()) as Array<User>
  return data.slice(0, 10).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }))
})

export const fetchUser = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: userId }) => {
    console.info(`Fetching user with id ${userId}...`)
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    )
    if (!res.ok) {
      throw new Error('Failed to fetch user')
    }
    const user = (await res.json()) as User
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  })
