import ShoppingList from '../components/ShoppingList';
import { shoppingList } from '../data/recipes';

function ShoppingListPage() {
  return (
    <>
      <h1>Shopping list</h1>
      <ShoppingList initialItems={shoppingList} />
    </>
  );
}

export default ShoppingListPage;
