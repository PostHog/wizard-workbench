import { useState } from 'react';

function parseQuantity(item) {
  const match = /^(\d+(?:\.\d+)?)\s*(\w+)?/.exec(item.quantity);
  if (!match) {
    throw new Error(`Cannot parse quantity "${item.quantity}" for ${item.name}`);
  }
  return { amount: Number(match[1]), unit: match[2] || '' };
}

function ShoppingList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [totals, setTotals] = useState(null);

  const handleDoubleQuantities = () => {
    setItems(current =>
      current.map(item => {
        const { amount, unit } = parseQuantity(item);
        return { ...item, quantity: `${amount * 2} ${unit}`.trim() };
      })
    );
  };

  const handleTotals = () => {
    const sum = items.reduce((acc, item) => acc + parseQuantity(item).amount, 0);
    setTotals(sum);
  };

  return (
    <section className="ShoppingList">
      <ul>
        {items.map(item => (
          <li key={item.name}>
            {item.name} — {item.quantity}
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleDoubleQuantities}>
        Double for guests
      </button>
      <button type="button" onClick={handleTotals}>
        Count items
      </button>
      {totals !== null && <p>{totals} units in total</p>}
    </section>
  );
}

export default ShoppingList;
