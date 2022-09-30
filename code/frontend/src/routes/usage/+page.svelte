<script>
	import { goto } from '$app/navigation';
	import { tokenStore } from '$lib/token';
	import { onMount } from 'svelte';

	let firstName = '';
	let totalAmountOfCoffees = 0;
	let userAmountOfCoffees = 0;
	let calculatedBalance = 0;

	onMount(async () => {
		if ($tokenStore == '') {
			return goto('/login');
		}

		await Promise.all([getAccount(), getCoffeeCount()]);
	});

	async function getAccount() {
		const res = await fetch(`https://tm-coffeecounter.jonasclaesbe.workers.dev/api/account`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				Authorization: $tokenStore
			}
		});

		if (res.status != 200) {
			return goto('/login');
		}

		const data = await res.json();

		firstName = data.account.firstName;
		userAmountOfCoffees = data.coffees.length;
		calculatedBalance = data.calculatedBalance;
	}

	async function getCoffeeCount() {
		const res = await fetch(`https://tm-coffeecounter.jonasclaesbe.workers.dev/api/coffee-count`, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		if (res.status != 200) {
			return goto('/login');
		}

		const data = await res.json();

		totalAmountOfCoffees = data.amountOfCoffees;
	}
</script>

<div class="p-4 text-primary-content">
	<div class="flex flex-col gap-4 max-w-2xl mx-auto rounded-box bg-base-200 p-4 text-base-content">
		<div>
			<h1 class="text-5xl font-bold">Hey, {firstName}!</h1>
			<sub class="text-lg italic">Checking on your coffee usage?</sub>
		</div>
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl">Usage statistics</h2>
			<div class="stats stats-vertical md:stats-horizontal shadow bg-primary text-primary-content">
				<div class="stat">
					<div class="stat-title">Total consumed coffees</div>
					<div class="stat-value">{totalAmountOfCoffees}</div>
					<div class="stat-desc">Since the first of September, 2022</div>
				</div>

				<div class="stat">
					<div class="stat-title">Your consumed coffees</div>
					<div class="stat-value">{userAmountOfCoffees}</div>
					<div class="stat-desc">Caffeinated</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl">Balance</h2>
			<div class="stats shadow bg-primary text-primary-content">
				<div class="stat">
					<div class="stat-title">Your current balance</div>
					<div class="stat-value">
						{Intl.NumberFormat('nl-NL', {
							style: 'currency',
							currency: 'EUR',
							currencyDisplay: 'code'
						}).format(calculatedBalance / 100)}
					</div>
					<div class="stat-desc">Looks a bit sad...</div>
				</div>
			</div>
			<div>
				<button class="btn btn-primary w-32">Top up</button>
			</div>
		</div>
	</div>
</div>
