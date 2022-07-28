import { parentPort } from "worker_threads"
import fetch, { Headers } from 'node-fetch';

console.log('worker first run')

parentPort.on('message', async (e) => {
    const { offset, endpoint } = e
    const start = performance.now()
    const letters = await fetch(`${endpoint}/${offset}`, {
        headers: new Headers({
            "User-Agent": "Letters to crushes data analysis project for AP statistics (evan@boehs.org)"
        })
    })
    let json = {}
    switch (letters.status) {
        case 404 || 500:
            console.log(`404! for letter ${offset}`)
            break
        case 200: {
            if (json.length == 0) console.log(`got page ${offset} in ${(performance.now()-start)/1000} seconds BUT it was empty`)
            else console.log(`got page ${offset} in ${(performance.now()-start)/1000} seconds`)
            json = await letters.json()
            break
        }
        default: console.log(`${letters.status} for ${offset}`)
    }
    await parentPort.postMessage({status: letters.status, json: json})
})