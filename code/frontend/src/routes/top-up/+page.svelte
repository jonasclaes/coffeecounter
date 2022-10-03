<script>
	import { goto } from '$app/navigation';
	import { tokenStore } from '$lib/token';
	import { onMount } from 'svelte';

	let loading = false;
	let lastError = '';
	let balance = 0;

	onMount(async () => {
		if ($tokenStore == '') {
			return goto('/login');
		}
	});

	/**
	 * Do register.
	 * @param event {SubmitEvent}
	 */
	async function doTopUp(event) {
		event.preventDefault();
		loading = true;

		try {
			if (!balance) throw new Error('Amount is missing');

			const res = await fetch(
				`https://tm-coffeecounter.jonasclaesbe.workers.dev/api/account/top-up`,
				{
					method: 'POST',
					body: JSON.stringify({
						amount: balance * 100
					}),
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						Authorization: $tokenStore
					}
				}
			);

			if (res.status != 200) {
				throw new Error('Status code not equal to 200');
			}

			const data = await res.json();

			goto('/usage');
		} catch (err) {
			if (err instanceof Error) {
				lastError = err.message;
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-4 text-primary-content">
	<div class="flex flex-col gap-4 max-w-2xl mx-auto rounded-box bg-base-200 p-4 text-base-content">
		<div>
			<h1 class="text-5xl font-bold">Top up</h1>
			<sub class="text-lg italic">Spending money again?</sub>
		</div>
		<div class="flex flex-col gap-2">
			{#if lastError}
				<div class="alert alert-error shadow-lg">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span>{lastError}</span>
					</div>
				</div>
			{/if}
			<form class="flex flex-col gap-2" on:submit={doTopUp}>
				<div class="form-control w-full">
					<label class="label" for="balance">
						<span class="label-text">How much do you want to top up?</span>
					</label>
					<label class="input-group">
						<input
							type="number"
							id="balance"
							step="0.10"
							placeholder="Type here"
							class="input input-bordered w-full"
							required
							bind:value={balance}
						/>
						<span>EUR</span>
					</label>
					<label class="label" for="balance">
						<span class="label-text-alt">Enter the amount to top up.</span>
					</label>
				</div>
				<button type="submit" class="btn btn-primary btn-block disabled:loading" disabled={loading}
					>Top up</button
				>
			</form>
		</div>
	</div>
</div>
