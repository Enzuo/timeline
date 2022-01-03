<script>
	import { onMount } from 'svelte';
	import { emit, listen } from '@tauri-apps/api/event'
	import { Diamonds } from 'svelte-loading-spinners'


	import Map from './Map.svelte';
	import Image from './Image.svelte';
	import Timeline from './Timeline.svelte';
	import {loadImage, openFolder, saveExif} from './processFiles'

	let data_points = [
		{path : '/Users/enzo/Desktop/screenshot.png', date : '20191001', coord : [46.29459015418106, -1.107509124775521]}
	]
	// 	['/Users/enzo/Desktop/screenshot.png', '20191001','46.29459015418106, -1.107509124775521'],
	// 	['/Users/enzo/Desktop/babysnail.jpg', '20200505','46.33396289931149, -0.9455455579936621'],
	// 	['/Users/enzo/Desktop/Screenshot 2021-09-28 at 00.21.25.png', '20200805','22.270239714591266, 114.20608166675473'],
	// ]
	
	let currentStep = 0
	let stepsSeen = 0
	let data_points_seen = [
		data_points[currentStep]
	]


	listen('open', event => {
		handleOpen()
	})

	/**
	 * Event handle
	 */
	async function handleOpen() {
		let dialog = window.__TAURI__.dialog
		// console.log(dialog)
		let folder = await dialog.open({
			directory: true,
		})
		
		data_points = []
		data_points = await openFolder(folder)
		reinit()
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

	async function handleCoordChange(event){
		let filePath = data_points[currentStep].path
		let fileData = await data_points[currentStep].dataPromise
		saveExif(filePath, fileData, {lattidue:1})
	}

	/**
	 * Utils functions
	*/
	function forward(){
		console.log('forward')
		currentStep = Math.min(currentStep + 1,data_points.length - 1)
		if(currentStep > stepsSeen){
			stepsSeen = currentStep
			data_points_seen = [...data_points_seen, data_points[stepsSeen]]
		}
		preloadImages(data_points, currentStep)
	}

	function backward(){
		currentStep = Math.max(currentStep - 1,0)

		preloadImage(datas,currentStep)
		preloadImage(datas,currentStep-1)
	}

	function reinit () {
		currentStep = 0
		stepsSeen = 0
		data_points_seen = [
			data_points[currentStep]
		]
		preloadImages(data_points, currentStep)
	}

	function preloadImages(datas, index){
		preloadImage(datas,index)
		preloadImage(datas,index+1)
		preloadImage(datas,index+2)
		preloadImage(datas,index+3)
		preloadImage(datas,index+4)
		unloadImage(datas,index-3)
	}

	function preloadImage(datas, index){
		if(datas[index] && !datas[index].dataPromise){
			datas[index].dataPromise = loadImage(datas[index].path)
		}
	}
	function unloadImage(datas,index){
		if(datas[index] && datas[index].dataPromise){
			datas[index].dataPromise = undefined
		}
	}

</script>

<svelte:window on:keydown={handleKeydown}/>

<main>
	<div class="screen">
		{#if data_points && data_points.length}
		<div class="content">
			<Image data={data_points[currentStep]}></Image>
		</div>
		<div class="map">
			<Map data={data_points_seen} step={currentStep}/>
		</div>
		<div class="timeline">
			<Timeline data={data_points} step={currentStep}></Timeline>
		</div>
		{:else}
		<Diamonds size="60" color="#FF3E00" unit="px" duration="1s"></Diamonds>
		<button on:click={handleOpen}>Open</button>
		{/if}
	</div>
</main>

<style>
	.screen {
		height:100%;
		display: grid;
		grid-template-rows: 95% 5%;
		grid-template-columns: [first] auto [last] 20%;
	}
	.content{
		display:grid;
		grid-row-start: 1;
		grid-row-end: 1;
	}
	.map{
		grid-row-start: 1;
		grid-row-end: 1;
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>