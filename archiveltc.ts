import { updatedb } from './db.ts'

const workers = []
const endpoints = [{
    endpoint: 'http://letterstocrushes.com/api/get_letters/-1',
    folder: 'letter',
    offset: 39587
//}
}
//{
//    endpoint: 'http://letterstocrushes.com/api/get_letters/-10',
//    folder: 'mod',
//    offset: 0
//}]
]

const NUM_WORKERS = endpoints.length

for (let i = 0; i < NUM_WORKERS; i++) {
    workers.push(new Worker(new URL("./worker.js", import.meta.url).href, {
        type: "module",
        deno: {
            namespace: true
        }
    }))
}

console.log('yo')

workers.forEach((w, i) => {
    w.postMessage(endpoints[i]);
    w.addEventListener('message', async (m) => {
        if (m.data.status == 'done') return
        else if (m.data.status == 200) {
            endpoints[i].offset++
            for (const item of m.data.json) {
                await updatedb(item)
            }
        }
        w.postMessage(endpoints[i]);
    })
})