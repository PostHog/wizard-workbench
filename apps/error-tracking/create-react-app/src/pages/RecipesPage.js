import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';

function RecipesPage() {
  return (
    <>
      <h1>Recipes</h1>
      {recipes.map(recipe => (
        <RecipeCard key={recipe.slug} recipe={recipe} />
      ))}
    </>
  );
}

export default RecipesPage;
