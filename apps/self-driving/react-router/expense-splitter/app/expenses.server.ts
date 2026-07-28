export interface Expense {
  id: number;
  description: string;
  amountCents: number;
  paidBy: string;
  settled: boolean;
  createdAt: string;
}

export const PEOPLE = ['Ana', 'Bruno', 'Cleo'] as const;

let expenses: Expense[] = [
  {
    id: 1,
    description: 'Groceries',
    amountCents: 8420,
    paidBy: 'Ana',
    settled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    description: 'Train tickets',
    amountCents: 15600,
    paidBy: 'Bruno',
    settled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    description: 'Coffee run',
    amountCents: 1250,
    paidBy: 'Cleo',
    settled: true,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 4;

export function listExpenses(): Expense[] {
  return expenses;
}

export function addExpense(data: {
  description: string;
  amountCents: number;
  paidBy: string;
}): Expense {
  const expense: Expense = {
    id: nextId++,
    description: data.description,
    amountCents: data.amountCents,
    paidBy: data.paidBy,
    settled: false,
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  return expense;
}

export function settleExpense(id: number, settled: boolean): Expense | undefined {
  const expense = expenses.find((e) => e.id === id);
  if (!expense) return undefined;

  expense.settled = settled;
  return expense;
}

export function deleteExpense(id: number): boolean {
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return false;

  expenses.splice(index, 1);
  return true;
}

/** What each person owes or is owed once the unsettled expenses are split evenly. */
export function balances(): Record<string, number> {
  const open = expenses.filter((expense) => !expense.settled);
  const total = open.reduce((sum, expense) => sum + expense.amountCents, 0);
  const share = PEOPLE.length ? total / PEOPLE.length : 0;

  return Object.fromEntries(
    PEOPLE.map((person) => {
      const paid = open
        .filter((expense) => expense.paidBy === person)
        .reduce((sum, expense) => sum + expense.amountCents, 0);
      return [person, Math.round(paid - share)];
    }),
  );
}
