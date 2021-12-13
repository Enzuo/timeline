<script>
	import { onMount } from 'svelte';
	import L from 'leaflet';
	let map;

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

	function createMap(container) {

		let initialView = [46.31, -0.99];
		let m = L.map(container, {preferCanvas: true }).setView(initialView, 5);
		L.tileLayer(
			'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
			{
			attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
				&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
			subdomains: 'abcd',
			maxZoom: 14,
			}
		).addTo(m);

		return m;
  	}

	function mapAction(container) {
    	map = createMap(container); 
		return {
       		destroy: () => {
				// toolbar.remove();
				map.remove();
				map = null;
			}
    	};
	}

	onMount(async () => {
		// var mymap = L.map('map').setView([46.31, -0.99], 13)

		// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 	maxZoom: 19,
		// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		// }).addTo(mymap)


		// var marker = L.marker(house.position).addTo(mymap)
		// marker.bindPopup(house.title + '<br>' + house.price + '<br>' + house.surface)
		// marker.on('click', generateClickHandler(house));
	})

	function resizeMap() {
	  	if(map) { map.invalidateSize(); }
  	}
</script>

<svelte:window on:resize={resizeMap} />


<main>
	<h1>Hello {name}!</h1>
	<div class="map" style="height:300px;width:300px" use:mapAction />	
	<button on:click={handleOpen}>Open</button>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>


<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
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

	.map :global(.marker-text) {
		width:100%;
		text-align:center;
		font-weight:600;
		background-color:#444;
		color:#EEE;
		border-radius:0.5rem;
	}
	
	.map :global(.map-marker) {
		width:30px;
		transform:translateX(-50%) translateY(-25%);
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>