<script>
    import L from 'leaflet';
    import {afterUpdate} from 'svelte'

    const iconRetinaUrl = 'assets/images/marker-icon-2x.png';
    const iconUrl = 'assets/images/marker-icon.png';
    const shadowUrl = 'assets/images/marker-shadow.png';
    const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;



	let map
    let markerLayers

    export let data
    export let step


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

    function createMarker(location){
        return L.marker(location)
    }

    function mapAction(container) {
        map = createMap(container)
        markerLayers = L.layerGroup()

        markerLayers.addTo(map);


        return {
            destroy: () => {
                // toolbar.remove();
                map.remove();
                map = null;
            }
        };
    }

    function addMarkers(){
        markerLayers.clearLayers()

        let markerLocations = data.map((d) => {
            return d[2].split(', ') // [51.508, -0.11] // d[2]
        })
 		for(let location of markerLocations) {
 			let marker = createMarker(location);
			markerLayers.addLayer(marker);
 		}

        // let panTo = 
        map.panTo(markerLocations[step]);
    }

    afterUpdate(() => {
        console.log("Updated");
        addMarkers()
    });

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

   {data}
<div class="map" style="height:300px;width:300px" use:mapAction />	
