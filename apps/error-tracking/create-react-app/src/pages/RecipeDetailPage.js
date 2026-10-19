import { Link, useParams } from 'react-router-dom';
import { recipes } from '../data/recipes';

function RecipeDetailPage() {
  const { slug } = useParams();
  const recipe = recipes.find(r => r.slug === slug);

  if (!recipe) {
    return (
      <p>
        Recipe not found. <Link to="/">Back to recipes</Link>
      </p>
    );
  }

  return (
    <>
      <h1>{recipe.title}</h1>
      <p>
        {recipe.minutes} minutes · serves {recipe.serves}
      </p>
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map(ingredient => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>
    </>
  );
}

export default RecipeDetailPage;
