import { resolve } from "node:path";
import { pool } from './shared.js'
import { readdir, readFile } from "node:fs/promises"
import * as csv from '@fast-csv/format'
import { createWriteStream } from "node:fs";


async function* getFiles(dir: string) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

;(async () => {
    for await (const f of getFiles('./analysis')) {
      const fileName = f.split('/').at(-1)
      if (fileName == 'query.pgsql') {
        const dir = f.substring(0, f.lastIndexOf("/"));
        ;(async () => {
            const client = await pool.connect()
            const now = performance.now()
            try {
              const res = await client.query(await (await readFile(f)).toString())
              const jsonData = JSON.parse(JSON.stringify(res.rows))
              csv
                .write(jsonData, { headers: true })
                .on("finish", function() {
                    console.log(`did ${dir.split('/').at(-1)} in ${(performance.now() - now) / 1000} seconds`);
                })
                .pipe(createWriteStream(`${dir}/data.csv`));
            } finally {
              // Make sure to release the client before any error handling,
              // just in case the error handling itself throws an error.
              client.release()
            }
          })().catch(err => console.log(err.stack))
      }
    }
})()

