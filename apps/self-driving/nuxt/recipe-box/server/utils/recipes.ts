export interface Recipe {
  id: number
  title: string
  minutes: number
  tags: string[]
  cooked: number
  favorite: boolean
}

let recipes: Recipe[] = [
  { id: 1, title: 'Weeknight ramen', minutes: 25, tags: ['dinner', 'quick'], cooked: 6, favorite: true },
  { id: 2, title: 'Sourdough focaccia', minutes: 180, tags: ['bread'], cooked: 2, favorite: false },
  { id: 3, title: 'Green shakshuka', minutes: 30, tags: ['brunch'], cooked: 4, favorite: false },
]

let nextId = 4

export function listRecipes(): Recipe[] {
  return recipes
}

export function findRecipe(id: number): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id)
}

export function addRecipe(data: { title: string; minutes: number; tags?: string[] }): Recipe {
  const recipe: Recipe = {
    id: nextId++,
    title: data.title,
    minutes: data.minutes,
    tags: data.tags ?? [],
    cooked: 0,
    favorite: false,
  }
  recipes.push(recipe)
  return recipe
}

export function updateRecipe(
  id: number,
  data: { cooked?: number; favorite?: boolean },
): Recipe | undefined {
  const recipe = findRecipe(id)
  if (!recipe) return undefined

  if (typeof data.cooked === 'number') recipe.cooked = data.cooked
  if (typeof data.favorite === 'boolean') recipe.favorite = data.favorite
  return recipe
}

export function removeRecipe(id: number): boolean {
  const index = recipes.findIndex((recipe) => recipe.id === id)
  if (index === -1) return false

  recipes.splice(index, 1)
  return true
}
