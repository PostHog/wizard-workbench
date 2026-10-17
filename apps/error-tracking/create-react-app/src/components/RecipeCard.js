import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <article className="RecipeCard">
      <h3>
        <Link to={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
      </h3>
      <p>
        {recipe.minutes} min · serves {recipe.serves}
      </p>
    </article>
  );
}

export default RecipeCard;
