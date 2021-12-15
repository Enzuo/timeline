<script>
	import { onMount } from 'svelte';
	import Map from './Map.svelte';
	import Image from './Image.svelte';
	import Timeline from './Timeline.svelte';
	import { emit, listen } from '@tauri-apps/api/event'

	const data_points = [
		['/Users/enzo/Desktop/screenshot.png', '20191001','46.29459015418106, -1.107509124775521'],
		['/Users/enzo/Desktop/babysnail.jpg', '20200505','46.33396289931149, -0.9455455579936621'],
		['/Users/enzo/Desktop/Screenshot 2021-09-28 at 00.21.25.png', '20200805','22.270239714591266, 114.20608166675473'],
	]
	
	let currentStep = 0
	let stepsSeen = 0
	let data_points_seen = [
		data_points[currentStep]
	]


	listen('open', event => {
		handleOpen()
	})

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
		currentStep = Math.min(currentStep + 1,data_points.length - 1)
		if(currentStep > stepsSeen){
			stepsSeen = currentStep
			data_points_seen = [...data_points_seen, data_points[stepsSeen]]
		}
	}

	function backward(){
		currentStep = Math.max(currentStep - 1,0)
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
	<div class="screen">
		<div class="content">
			<button on:click={handleOpen}>Open</button>
			<Image path={data_points[currentStep][0]}></Image>
		</div>
		<div class="map">
			<Map data={data_points_seen} step={currentStep}/>
		</div>
		<div class="timeline">
			<Timeline time={data_points[currentStep][1]}></Timeline>
		</div>
	</div>
</main>

<style>
	.screen {
		height:100%;
		display: grid;
		grid-template-rows: [first] auto [last] 50px;
		grid-template-columns: [first] auto [last] 40%;
	}
	.content{
		display:grid;
		grid-row-start: 1;
		grid-row-end: 1;
	}
	.map{

	}
	.timeline{
		grid-column-start: 1;
		grid-column-end: span 2;
		grid-row-start: 2;
		grid-row-end: 2;
	}


	main {
		height:100%;

		color:#fff;
		background:#000;
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