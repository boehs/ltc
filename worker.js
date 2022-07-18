import { parentPort } from "worker_threads"
import fetch, { Headers } from 'node-fetch';

console.log('worker first run')

parentPort.on('message', async (e) => {
    const { offset, endpoint } = e
    const start = Date.now()
    const letters = await fetch(`${endpoint}/${offset}`, {
        headers: new Headers({
            "User-Agent": "Letters to crushes data analysis project for AP statistics (evan@boehs.org)"
        })
    })
    const json = await letters.json()
    switch (letters.status) {
        case 404 || 500:
            console.log(`404! for letter ${offset}`)
            break
        case 200: {
            console.log(`got page ${offset}, took ${(Date.now()-start)/1000} seconds`)
            break
        }
        default: console.log(`${letters.status} for ${offset}`)
    }
    await parentPort.postMessage({status: letters.status, json: json})
})