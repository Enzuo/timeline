<script>
	import { onMount } from 'svelte';
	import Map from './Map.svelte';
	import { emit, listen } from '@tauri-apps/api/event'

	const data_points = [
		['/Users/enzo/Desktop/screenshot.png', '20191001','46.29459015418106, -1.107509124775521'],
		['/Users/enzo/Desktop/babysnail.png', '20200505','46.33396289931149, -0.9455455579936621'],
		['/Users/enzo/Desktop/Screenshot 2021-09-28 at 00.21.25.png', '20200805','22.270239714591266, 114.20608166675473'],
	]
	
	let stepIndex = 0
	let data_points_seen = [
		data_points[stepIndex]
	]


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

	function handleKeydown(event) {
		let key = event.key;
		let keyCode = event.keyCode;
		console.log(keyCode)

		const RIGHT_ARROW = 39
		const LEFT_ARROW = 37

		if(keyCode === RIGHT_ARROW){
			forward()
		}
		if(keyCode === LEFT_ARROW){
			backward()
		}
	}

	function forward(){
		console.log('forward')
		stepIndex += 1
		data_points_seen = [...data_points_seen, data_points[stepIndex]]
	}

	function backward(){
		stepIndex -= 1
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
	<h1>Hello {name}!</h1>
	<Map data={data_points_seen} step={stepIndex}/>
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