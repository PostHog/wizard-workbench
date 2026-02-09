export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  return { success: true }
})
