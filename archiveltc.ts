import { Worker } from 'worker_threads'
import { LtcJson, patchJson, writeLettersToDB } from './shared.js'

const workers: Worker[] = []
const endpoints = [{
    endpoint: 'http://letterstocrushes.com/api/get_letters/-1',
    folder: 'letter',
    offset: 68296
}
//{
//    endpoint: 'http://letterstocrushes.com/api/get_letters/-10',
//    folder: 'mod',
//    offset: 0
//}]
]

const NUM_WORKERS = endpoints.length

for (let i = 0; i < NUM_WORKERS; i++) {
    workers.push(new Worker("./worker.js"))
}

console.log('yo')

workers.forEach((w, i) => {
    w.postMessage(endpoints[i]);
    w.on('message', async (m: {status: 'done' | 200, json: LtcJson[]}) => {
        if (m.status == 'done') return
        else if (m.status == 200) {
            endpoints[i].offset++
            await writeLettersToDB(patchJson(m.json))
        }
        w.postMessage(endpoints[i]);
    })
})
