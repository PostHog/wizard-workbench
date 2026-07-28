export interface Habit {
	id: number;
	name: string;
	cadence: 'daily' | 'weekly';
	streak: number;
	checkedToday: boolean;
	createdAt: string;
}
