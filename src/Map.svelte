<script>
    import L from 'leaflet';
	let map;

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

    function resizeMap() {
        if(map) { map.invalidateSize(); }
    }
</script>
<svelte:window on:resize={resizeMap} />

<style>
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
</style>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>
<div class="map" style="height:300px;width:300px" use:mapAction />	
