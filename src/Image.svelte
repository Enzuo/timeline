<script>
    import * as fs from '@tauri-apps/api/fs'
    import {base64ArrayBuffer} from './utils'

    export let path

    let imgData


    async function loadImage(path){
        let imgDataBuffer = await fs.readBinaryFile(path)
        return base64ArrayBuffer(imgDataBuffer)
    }

    $: {
        loadImage(path).then((val) => {imgData = val})
    }

</script>

<style>
    .center-image{
        display: block;
        height:100%;
        width:100%;

        background:black;
        display:flex; align-items: center;
    }
    img {
        display:block;
        max-height: 100%;
	    max-width: 100%;
        margin: 0 auto;
    }
</style>


{path}
{#if imgData}
<div class="center-image">
    <img id='base64image' src='data:image/png;base64,{imgData}' />
</div>
{/if}