import { Worker } from 'worker_threads'
import { db, LtcJson, patchJson, writeLettersToDB } from '../../shared.js'
import { sql } from 'kysely';

const workers: [Worker, string][] = []
let endpoints: string[] = ['http://letterstocrushes.com/Home/GetLetter']

for (let k of endpoints) {
    workers.push([new Worker("./worker.js"), k])
}

const missing = (await sql<{
    allid: number
}>`select allid
from generate_series((select min(id) from ltc), (select max(id) from ltc)) allid
except select id from ltc
order by allid`.execute(db)).rows.map(row => row.allid)
let i = 0

console.log('yo')

workers.forEach(([w, k]) => {
    w.postMessage({
        offset: missing[i],
        endpoint: k
    });
    i++
    w.on('message', async (m: { status: 'done' | 200, json: LtcJson }) => {
        if (m.status == 'done') return
        else if (m.status == 200) {
            await writeLettersToDB(patchJson([m.json]))
        }
        i++
        w.postMessage({
            offset: missing[i],
            endpoint: k
        });
    })
})
