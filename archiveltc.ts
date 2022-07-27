import { Worker } from 'worker_threads'
import { LtcJson, patchJson, writeLettersToDB } from './shared.js'
import { readFile, writeFile } from "fs/promises";

const workers: [Worker,string][] = []
let endpoints: {
    [folder: string]: {
        endpoint: string;
        offset?: number
    }
} = {
    'letter': {
        endpoint: 'http://letterstocrushes.com/api/get_letters/-1',
    },
    //'mod': {
    //    endpoint: 'http://letterstocrushes.com/api/get_letters/-10',
    //}
}

const file: { [key: string]: number } = JSON.parse((await readFile('./offsetStore.json')).toString())

endpoints = Object.fromEntries(Object.entries(endpoints).map(([k,v]) => {
    v.offset = 0
    return [k,v]
}))

for (let [k, v] of Object.entries(file)) {
    endpoints[k].offset = v
}

for (let [k] of Object.entries(endpoints)) {
    workers.push([new Worker("./worker.js"),k])
}

console.log('yo')

workers.forEach(([w,k]) => {
    w.postMessage(endpoints[k]);
    w.on('message', async (m: { status: 'done' | 200, json: LtcJson[] }) => {
        if (m.status == 'done') return
        else if (m.status == 200) {
            endpoints[k].offset++
            if(m.json.length > 0) await writeLettersToDB(patchJson(m.json))
            file[k] = endpoints[k].offset
            writeFile('./offsetStore.json',JSON.stringify(file))
        }
        w.postMessage(endpoints[k]);
    })
})
