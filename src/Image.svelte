<script>
    import * as fs from '@tauri-apps/api/fs'
    import {base64ArrayBuffer} from './utils'
    import { Square } from 'svelte-loading-spinners'

    export let data

    let imgData


    // async function loadImage(path){
    //     let imgDataBuffer = await fs.readBinaryFile(path)
    //     return base64ArrayBuffer(imgDataBuffer)
    // }

    $: {
        imgData = null
        if(data.dataPromise){
            data.dataPromise.then((val) => {imgData = val})
        }
    }

</script>

<style>
    .center-image{
        display: block;
        height:100%;
        width:100%;

        background:black;
        display:flex; 
        align-items: center;
        text-align: center;
    }
    .center{
        margin: 0 auto;
    }
    img {
        display:block;
        max-height: 100%;
	    max-width: 100%;
        margin: 0 auto;
    }
</style>


{data.path}
<div class="center-image">
    {#if imgData}
    <img id='base64image' src='data:image/png;base64,{imgData}' />
    {:else}
    <div class="center">
        <Square></Square>
    </div>
    {/if}
</div>