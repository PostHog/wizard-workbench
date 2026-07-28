import { Form, Link, data } from 'react-router';

import type { Route } from './+types/home';
import {
  PEOPLE,
  addExpense,
  balances,
  deleteExpense,
  listExpenses,
  settleExpense,
} from '../expenses.server';

export function loader() {
  return { expenses: listExpenses(), balances: balances(), people: PEOPLE };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const intent = form.get('intent');

  if (intent === 'create') {
    const description = String(form.get('description') ?? '').trim();
    const amount = Number(form.get('amount'));
    const paidBy = String(form.get('paidBy') ?? '');

    if (!description || !Number.isFinite(amount) || amount <= 0) {
      return data({ error: 'Give the expense a description and a positive amount.' }, { status: 400 });
    }

    addExpense({ description, amountCents: Math.round(amount * 100), paidBy });
    return { ok: true };
  }

  const id = Number(form.get('id'));

  if (intent === 'settle') {
    settleExpense(id, form.get('settled') === 'true');
    return { ok: true };
  }

  if (intent === 'delete') {
    deleteExpense(id);
    return { ok: true };
  }

  return data({ error: 'Unknown intent' }, { status: 400 });
}

function money(cents: number) {
  return `${cents < 0 ? '-' : ''}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export default function Home({ loaderData, actionData }: Route.ComponentProps) {
  const { expenses, balances, people } = loaderData;

  return (
    <>
      <nav>
        <Link to="/about">About</Link>
      </nav>

      <h1>Expense splitter</h1>
      <p className="lede">Track shared expenses and see who owes what.</p>

      <div className="card row">
        {people.map((person) => (
          <div key={person}>
            <div className="meta">{person}</div>
            <strong className={balances[person] >= 0 ? 'positive' : 'negative'}>
              {money(balances[person])}
            </strong>
          </div>
        ))}
      </div>

      <Form method="post" className="card row">
        <input type="hidden" name="intent" value="create" />
        <input className="grow" type="text" name="description" placeholder="What was it for?" />
        <input type="number" name="amount" step="0.01" min="0" placeholder="0.00" />
        <select name="paidBy">
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
        <button className="primary" type="submit">
          Add
        </button>
      </Form>

      {actionData && 'error' in actionData ? <p className="error">{actionData.error}</p> : null}

      {expenses.length === 0 ? (
        <p className="lede">No expenses yet. Add one above.</p>
      ) : (
        expenses.map((expense) => (
          <div key={expense.id} className="card row">
            <div>
              <strong>{expense.description}</strong>
              <div className="meta">
                {money(expense.amountCents)} · paid by {expense.paidBy}
                {expense.settled ? ' · settled' : ''}
              </div>
            </div>
            <div className="row" style={{ gap: '0.5rem' }}>
              <Form method="post">
                <input type="hidden" name="intent" value="settle" />
                <input type="hidden" name="id" value={expense.id} />
                <input type="hidden" name="settled" value={String(!expense.settled)} />
                <button type="submit">{expense.settled ? 'Reopen' : 'Settle'}</button>
              </Form>
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={expense.id} />
                <button className="ghost" type="submit">
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))
      )}
    </>
  );
}
