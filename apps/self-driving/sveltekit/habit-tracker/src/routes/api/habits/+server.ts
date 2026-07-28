import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createHabit, getHabits } from '$lib/server/data';

export const GET: RequestHandler = () => json(getHabits());

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const name = typeof body?.name === 'string' ? body.name.trim() : '';
	if (!name) error(400, 'name is required');

	const cadence = body?.cadence === 'weekly' ? 'weekly' : 'daily';
	return json(createHabit({ name, cadence }), { status: 201 });
};
