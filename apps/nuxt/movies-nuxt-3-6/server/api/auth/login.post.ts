export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  // Fake auth - accepts any username and password
  if (username && password) {
    setCookie(event, 'auth-user', username, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      success: true,
      user: username,
    }
  }

  throw createError({
    statusCode: 400,
    message: 'Username and password are required',
  })
})
