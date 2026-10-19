import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ShoppingListPage from './pages/ShoppingListPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="App">
      <NavBar />
      <main className="App-main">
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
