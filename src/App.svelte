<script>
	import { emit, listen } from '@tauri-apps/api/event'
	listen('open', event => {
		handleOpen()
	})


	export let name;

	async function handleOpen() {
		let dialog = window.__TAURI__.dialog
		console.log(dialog)
		let file = await dialog.open()
		console.log(file)
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<button on:click={handleOpen}>Open</button>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>