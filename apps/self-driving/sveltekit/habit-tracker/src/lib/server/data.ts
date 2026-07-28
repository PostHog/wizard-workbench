import type { Habit } from '$lib/types';

let habits: Habit[] = [
	{
		id: 1,
		name: 'Read for 20 minutes',
		cadence: 'daily',
		streak: 4,
		checkedToday: false,
		createdAt: new Date().toISOString()
	},
	{
		id: 2,
		name: 'Ship one small PR',
		cadence: 'daily',
		streak: 12,
		checkedToday: true,
		createdAt: new Date().toISOString()
	},
	{
		id: 3,
		name: 'Review the roadmap',
		cadence: 'weekly',
		streak: 2,
		checkedToday: false,
		createdAt: new Date().toISOString()
	}
];

let nextId = 4;

export function getHabits(): Habit[] {
	return habits;
}

export function createHabit(data: { name: string; cadence?: Habit['cadence'] }): Habit {
	const habit: Habit = {
		id: nextId++,
		name: data.name,
		cadence: data.cadence ?? 'daily',
		streak: 0,
		checkedToday: false,
		createdAt: new Date().toISOString()
	};
	habits.push(habit);
	return habit;
}

/** Checking in bumps the streak; unchecking rolls it back. */
export function setChecked(id: number, checked: boolean): Habit | undefined {
	const habit = habits.find((h) => h.id === id);
	if (!habit) return undefined;
	if (habit.checkedToday === checked) return habit;

	habit.checkedToday = checked;
	habit.streak = checked ? habit.streak + 1 : Math.max(0, habit.streak - 1);
	return habit;
}

export function deleteHabit(id: number): boolean {
	const index = habits.findIndex((h) => h.id === id);
	if (index === -1) return false;
	habits.splice(index, 1);
	return true;
}
