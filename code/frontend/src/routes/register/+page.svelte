<script>
	import { goto } from '$app/navigation';
	import { register } from './store';
	let loading = false;
	let lastError = '';

	/**
	 * Do register.
	 * @param event {SubmitEvent}
	 */
	async function doRegister(event) {
		event.preventDefault();
		loading = true;

		try {
			if (!$register.firstName) throw new Error('First name is missing');
			if (!$register.lastName) throw new Error('Last name is missing');
			if (!$register.email) throw new Error('Email is missing');
			if (!$register.password) throw new Error('Password is missing');

			const res = await fetch(`https://tm-coffeecounter.jonasclaesbe.workers.dev/api/account`, {
				method: 'POST',
				body: JSON.stringify($register),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});

			if (res.status != 201) {
				throw new Error('Status code not equal to 200');
			}

			const data = await res.json();

			goto('/login');
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
			<h1 class="text-5xl font-bold">Register</h1>
			<sub class="text-lg italic">Go ahead, join the club, enjoy the coffee.</sub>
		</div>
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
		<form class="flex flex-col gap-2" on:submit={doRegister}>
			<div class="flex flex-col md:flex-row gap-2">
				<div class="form-control w-full">
					<label class="label" for="firstName">
						<span class="label-text">What is your first name?</span>
					</label>
					<input
						type="text"
						id="firstName"
						placeholder="Type here"
						class="input input-bordered w-full"
						required
						bind:value={$register.firstName}
					/>
					<label class="label" for="firstName">
						<span class="label-text-alt">Enter your first name.</span>
					</label>
				</div>
				<div class="form-control w-full">
					<label class="label" for="lastName">
						<span class="label-text">What is your last name?</span>
					</label>
					<input
						type="text"
						id="lastName"
						placeholder="Type here"
						class="input input-bordered w-full"
						required
						bind:value={$register.lastName}
					/>
					<label class="label" for="lastName">
						<span class="label-text-alt">Enter your last name.</span>
					</label>
				</div>
			</div>
			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">What is your email address?</span>
				</label>
				<input
					type="email"
					id="email"
					placeholder="Type here"
					class="input input-bordered w-full"
					required
					bind:value={$register.email}
				/>
				<label class="label" for="email">
					<span class="label-text-alt">Enter your email address.</span>
				</label>
			</div>
			<div class="form-control w-full">
				<label class="label" for="password">
					<span class="label-text">What is your password?</span>
				</label>
				<input
					type="password"
					id="password"
					placeholder="Type here"
					class="input input-bordered w-full"
					required
					bind:value={$register.password}
				/>
				<label class="label" for="password">
					<span class="label-text-alt">Enter your password.</span>
				</label>
			</div>
			<button type="submit" class="btn btn-primary btn-block disabled:loading" disabled={loading}
				>Register</button
			>
		</form>
	</div>
</div>
