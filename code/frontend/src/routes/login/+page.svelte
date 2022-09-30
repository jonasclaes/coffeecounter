<script>
	import { goto } from '$app/navigation';
	import { tokenStore } from '../../lib/token';
	import { login } from './store';
	let loading = false;

	/**
	 * Do login.
	 * @param event {SubmitEvent}
	 */
	async function doLogin(event) {
		event.preventDefault();
		loading = true;

		try {
			const res = await fetch(
				`https://tm-coffeecounter.jonasclaesbe.workers.dev/api/account/login`,
				{
					method: 'POST',
					body: JSON.stringify($login),
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					}
				}
			);

			if (res.status != 200) {
				throw new Error('Status code not equal to 200');
			}

			const data = await res.json();

			tokenStore.set(data.accessToken);
			goto('/usage');
		} catch (err) {
		} finally {
			loading = false;
		}
	}
</script>

<div class="p-4 text-primary-content">
	<div class="flex flex-col gap-4 max-w-2xl mx-auto rounded-box bg-base-200 p-4 text-base-content">
		<div>
			<h1 class="text-5xl font-bold">Login</h1>
			<sub class="text-lg italic">Just checking if you are who you say you are.</sub>
		</div>
		<form class="flex flex-col gap-2" on:submit={doLogin}>
			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">What is your email address?</span>
				</label>
				<input
					type="text"
					id="email"
					placeholder="Type here"
					class="input input-bordered w-full"
					bind:value={$login.email}
				/>
				<label class="label" for="email">
					<span class="label-text-alt">Enter the email address that you used to sign up with.</span>
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
					bind:value={$login.password}
				/>
				<label class="label" for="password">
					<span class="label-text-alt">Enter your password please.</span>
				</label>
			</div>
			<button type="submit" class="btn btn-primary btn-block disabled:loading" disabled={loading}
				>Login</button
			>
		</form>
	</div>
</div>
