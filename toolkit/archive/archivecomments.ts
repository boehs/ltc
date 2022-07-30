import { Worker } from 'worker_threads'
import { db, LtcCommentJSON, patchCommentJson, writeCommentsToDB } from '../../shared.js'
import { sql } from 'kysely';

const workers: [Worker, string][] = []
let endpoints: string[] = ['http://letterstocrushes.com/Comment/GetComments']

for (let k of endpoints) {
    workers.push([new Worker("./worker.js"), k])
}

const missing = (await sql<{
    id: number
}>`select id
from ltc l
where 
    lettercomments != (select count(*) from ltccomments where letterid = l.id)
    and lettercomments > 0
order by id`.execute(db)).rows.map(row => row.id)
let i = 0

console.log('yo')

workers.forEach(([w, k]) => {
    w.postMessage({
        offset: missing[i],
        endpoint: k
    });
    i++
    w.on('message', async (m: { status: 'done' | 200, json: LtcCommentJSON[] }) => {
        if (m.status == 'done') return
        else if (m.status == 200) {
            await writeCommentsToDB(patchCommentJson(m.json))
        }
        i++
        w.postMessage({
            offset: missing[i],
            endpoint: k
        });
    })
})
