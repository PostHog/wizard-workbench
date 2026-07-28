import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteHabit, setChecked } from '$lib/server/data';

export const PATCH: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	if (typeof body?.checkedToday !== 'boolean') error(400, 'checkedToday is required');

	const habit = setChecked(Number(params.id), body.checkedToday);
	if (!habit) error(404, 'habit not found');

	return json(habit);
};

export const DELETE: RequestHandler = ({ params }) => {
	if (!deleteHabit(Number(params.id))) error(404, 'habit not found');
	return new Response(null, { status: 204 });
};
