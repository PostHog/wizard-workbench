export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logPostHogServer('authentication_session_cleared', {
    authentication_method: 'demo',
  })
  return { success: true }
})
