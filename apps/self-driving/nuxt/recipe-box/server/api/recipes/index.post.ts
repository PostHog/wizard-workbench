export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string; minutes?: number; tags?: string[] }>(event)
  const title = body?.title?.trim()

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'title is required' })
  }

  setResponseStatus(event, 201)
  return addRecipe({
    title,
    minutes: Number(body.minutes) > 0 ? Number(body.minutes) : 30,
    tags: body.tags?.filter(Boolean),
  })
})
