import { Link, NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <header className="App-header">
      <Link to="/">
        <strong>Pantry</strong>
      </Link>
      <nav>
        <NavLink to="/" end>
          Recipes
        </NavLink>
        <NavLink to="/shopping-list">Shopping list</NavLink>
      </nav>
    </header>
  );
}

export default NavBar;
