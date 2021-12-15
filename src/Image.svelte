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


{path}
{#if imgData}
<img style='display:block; width:300px;height:300px;' id='base64image'
src='data:image/png;base64,{imgData}' />
{/if}