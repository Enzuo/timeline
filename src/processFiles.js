import * as fs from '@tauri-apps/api/fs'
import exifr from 'exifr'
import piexif from 'piexifjs'

// comment path & nodeFs to run with Tauri
// import * as nodeFs from 'fs/promises'
// import path from 'path'

import {base64ArrayBuffer} from './utils.js'
// import { PerformanceObserver, performance } from 'perf_hooks'



export async function openFolder(folderPath, useNode) {
    let dir = await (useNode ? nodeFs.readdir(folderPath, {withFileTypes:true}) : fs.readDir(folderPath))
    // console.log(dir)

    let dataDescriptor = dir.find(a => a.name === 'data.json')
    if(dataDescriptor && !useNode){
        let dataJsonPromise = fs.readTextFile(dataDescriptor.path)
        let dataJson = await dataJsonPromise
        return JSON.parse(dataJson)
    }

    // performance.mark('A');
    let files = dir.filter(d => {
        if (d.children) return false
        if (!d.name.match(/.*\.jpg|\.png/i)) return false
        return true
    })
    let filesExif = files.map(d => {
        let filepath = d.path || path.join(folderPath, d.name)
        return useNode ? getExifNode(filepath) : getExif(filepath)
    })

    // console.log(filesExif)

    let files_data = await Promise.all(filesExif)

    
    
    // performance.measure('A to Now', 'A');
    let sorted_files = files_data.sort((a, b) => a.date < b.date ? -1 : 1)
    console.log(JSON.stringify(sorted_files))
    return sorted_files
}



/**
 * Tauri
 * 
 */

async function getExif(filePath){
    return fs.readBinaryFile(filePath).then(binaryArray => {
        let uint = Uint8Array.from(binaryArray)
        return parseExif(filePath, uint)
    })
}

export async function loadImage(path){
    let imgDataBuffer = await fs.readBinaryFile(path)
    return base64ArrayBuffer(imgDataBuffer)
}

/** 
 * Node fs
 * 
 */


async function getExifNode(filePath){
    console.log(filePath)
    let fd = await nodeFs.open(filePath, 'r')
    let buf = Buffer.alloc(65000)
    await fd.read(buf, 0, 65000)
    fd.close()

    // console.log(filePath, buf)
    return parseExif(filePath, buf)
}

/** --- */


async function parseExif(filePath, fileData) {
    // let uint = fileData
    let fileExif = await exifr.parse(fileData)
    let infos = {coord:[fileExif.latitude, fileExif.longitude], date: fileExif.CreateDate}
    return {path:filePath, ...infos}
}


export async function saveExif(filePath, fileData, exif){
    let base64data = 'data:image/jpeg;base64,'+fileData
    let new_exif = piexif.load(base64data)
    console.log('saveExif', new_exif)
    // piexif.insert(exif,fileData)
}

