<div class="p-4 text-primary-content">
	<div class="flex flex-col gap-4 max-w-2xl mx-auto rounded-box bg-base-200 p-4 text-base-content">
		<div>
			<h1 class="text-5xl font-bold">Login</h1>
			<sub class="text-lg italic">Just checking if you are who you say you are.</sub>
		</div>
		<form class="flex flex-col gap-2">
			<div class="form-control w-full">
				<label class="label" for="email">
					<span class="label-text">What is your email address?</span>
				</label>
				<input type="text" id="email" placeholder="Type here" class="input input-bordered w-full" />
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
				/>
				<label class="label" for="password">
					<span class="label-text-alt">Enter your password please.</span>
				</label>
			</div>
			<button type="submit" class="btn btn-primary btn-block">Login</button>
		</form>
	</div>
</div>
