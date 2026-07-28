export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!removeRecipe(id)) {
    throw createError({ statusCode: 404, statusMessage: 'recipe not found' })
  }

  setResponseStatus(event, 204)
  return null
})
