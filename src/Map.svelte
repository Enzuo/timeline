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
    const redIcon = L.icon({
        iconRetinaUrl: 'assets/marker-icon-red-2x.png',
        iconUrl: 'assets/marker-icon-red.png',
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });



	let map
    let markerLayers

    export let data
    export let step


    function createMap(container) {

        let initialView = [46.31, -0.99];
        let m = L.map(container, {preferCanvas: true }).setView(initialView, 5);
        // https://leaflet-extras.github.io/leaflet-providers/preview/
        var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        tiles.addTo(m);

        return m;
    }

    function createMarker(location, focus){
        if(focus){
            return L.marker(location, {icon: redIcon})
        }
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
            return d.coord // d[2].split(', ') // [51.508, -0.11] // d[2]
        })
        markerLocations.forEach((location, index) => {
            if(!location[0]) return
 			let marker = createMarker(location, index === step );
			markerLayers.addLayer(marker);
 		})

        // let panTo = 
        if(markerLocations[step][0]){
            map.panTo(markerLocations[step]);
        }
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

<div class="map" style="height:100%;width:100%" use:mapAction />	
