<script lang="ts">
	import type { Habit } from '$lib/types';

	let habits = $state<Habit[]>([]);
	let name = $state('');
	let cadence = $state<Habit['cadence']>('daily');
	let loading = $state(true);

	$effect(() => {
		fetch('/api/habits')
			.then((res) => res.json())
			.then((data) => (habits = data))
			.finally(() => (loading = false));
	});

	async function addHabit(event: SubmitEvent) {
		event.preventDefault();
		if (!name.trim()) return;

		const res = await fetch('/api/habits', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, cadence })
		});
		if (!res.ok) return;

		habits = [...habits, await res.json()];
		name = '';
	}

	async function toggle(habit: Habit) {
		const res = await fetch(`/api/habits/${habit.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ checkedToday: !habit.checkedToday })
		});
		if (!res.ok) return;

		const updated = await res.json();
		habits = habits.map((h) => (h.id === updated.id ? updated : h));
	}

	async function remove(habit: Habit) {
		const res = await fetch(`/api/habits/${habit.id}`, { method: 'DELETE' });
		if (!res.ok) return;

		habits = habits.filter((h) => h.id !== habit.id);
	}
</script>

<nav><a href="/about">About</a></nav>

<h1>Habit tracker</h1>
<p class="lede">Check in daily and keep the streak alive.</p>

<form class="card row" onsubmit={addHabit}>
	<input type="text" placeholder="New habit" bind:value={name} />
	<select bind:value={cadence}>
		<option value="daily">Daily</option>
		<option value="weekly">Weekly</option>
	</select>
	<button class="primary" type="submit">Add</button>
</form>

{#if loading}
	<p class="lede">Loading…</p>
{:else if habits.length === 0}
	<p class="lede">No habits yet. Add one above.</p>
{:else}
	{#each habits as habit (habit.id)}
		<div class="card row">
			<label class="row" style="gap: 0.6rem; flex: 1;">
				<input
					type="checkbox"
					checked={habit.checkedToday}
					onchange={() => toggle(habit)}
				/>
				<span>{habit.name}</span>
			</label>
			<span class="streak">{habit.streak}-day streak</span>
			<button class="ghost" onclick={() => remove(habit)}>Delete</button>
		</div>
	{/each}
{/if}
