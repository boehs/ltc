import { Worker } from 'worker_threads'
import { db, LtcCommentJSON, patchCommentJson, writeCommentsToDB } from '../../shared.js'
import { sql } from 'kysely';
import { EventEmitter } from 'node:events';
const freeWorkerEmitter = new EventEmitter()

const workers: [Worker, string][] = []
let endpoints: string[] = ['http://letterstocrushes.com/Comment/GetComments', 'http://letterstocrushes.com/Comment/GetComments', 'http://letterstocrushes.com/Comment/GetComments']

for (let k of endpoints) {
    const worker = new Worker("./worker.js")
    worker.on('message', async (m: { status: 'done' | 200, json: LtcCommentJSON[] }) => {
        if (m.status == 'done') return
        else if (m.status == 200) {
            if (m.json.length > 0) await writeCommentsToDB(patchCommentJson(m.json))
        }
        workers.push([worker, k])
        freeWorkerEmitter.emit('free')
    })
    workers.push([worker, k])
}

const stream = db
    .selectFrom('ltc')
    .select('id')
    .where(sql`lettercomments > (select count(*) from ltccomments where letterid = ltc.id)`)
    .where('lettercomments', '>', 0)
    .stream()

let i = 0
for await (const id of stream) {
    if (id.id == 779960) {
        throw new Error('repeat id cannary')
    }
    console.log(i++)
    if (workers.length == 0) {
        await new Promise(function (resolve, reject) {
            freeWorkerEmitter.once('free', resolve)
        })
    }
    const [worker, k] = workers[workers.length - 1]
    workers.pop()
    worker.postMessage({
        offset: id.id,
        endpoint: k
    });
}