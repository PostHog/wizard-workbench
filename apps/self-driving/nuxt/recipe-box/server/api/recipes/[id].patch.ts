export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ cooked?: number; favorite?: boolean }>(event)

  const recipe = updateRecipe(id, body ?? {})
  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'recipe not found' })
  }

  return recipe
})
