import * as fs from '@tauri-apps/api/fs'
import * as Buffer from 'buffer'
import exifr from 'exifr'
// import { PerformanceObserver, performance } from 'perf_hooks'



export async function openFolder(folderPath) {
    let dir = await fs.readDir(folderPath)
    console.log(dir)

    // performance.mark('A');
    let files = dir.filter(d => {
        if (d.children) return false
        if (!d.path.match(/.*\.jpg|\.png/i)) return false
        return true
    })
    let filesExif = files.map(d => {


        // d.path
        return fs.readBinaryFile(d.path).then(binaryArray => {
            // let buffer = Buffer.Blob(binaryString, "binary");
            let uint = Uint8Array.from(binaryArray)
            console.log(uint)
            return exifr.parse(uint)
        })
    })

    console.log(filesExif)

    let coordinates = await Promise.all(filesExif)
    
    
    
    // performance.measure('A to Now', 'A');
    console.log(coordinates)
}