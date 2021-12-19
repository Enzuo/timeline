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
            return parseExif(d.path, uint)
        })
    })

    // console.log(filesExif)

    let files_data = await Promise.all(filesExif)

    
    
    // performance.measure('A to Now', 'A');
    console.log(files_data)
    return files_data
}

async function parseExif(filePath, fileData) {
    // let uint = fileData
    let fileExif = await exifr.parse(fileData)
    let infos = {coord:[fileExif.latitude, fileExif.longitude], date: fileExif.CreateDate}
    return {path:filePath, ...infos}
}