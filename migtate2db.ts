#!/usr/bin/env ts-node

import { Generated, Kysely, PostgresDialect } from "kysely"
import pkg from 'pg';
const { Pool } = pkg;
import { readFile, readdir as readDir} from 'node:fs/promises'
import 'dotenv/config'

interface LtcBase {
    lettermessage: string;
    lettertags: string;
    letterup: number;
    letterlevel: number;
    letterlanguage: string;
    senderip: string;
    sendercountry: string;
    senderregion?: string;
    sendercity?: string;
    lettercomments: number
    tofacebookuid?: number
    fromfacebookuid?: number
}

interface LtcTable extends LtcBase {
    id: Generated<number>
    letterpostdate: Date;
}

interface LtcJson extends LtcBase {
    Id: number
    letterPostDate: string
}

interface Database {
    ltc: LtcTable
}

let pool = new Pool({
    database: process.env.db,
    host: process.env.host || "localhost",
    user: process.env.user,
    password: process.env.pass
})

const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: pool
    })
})

const files = await readDir('./letter')

for (const file of files) {
    console.log(file)
    const contents = await readFile(`./letter/${file}`)
    const json: LtcJson[] = JSON.parse(contents.toString())
    
    const patchedJson: LtcTable[] = json.map(letter => {
        // @ts-expect-error
        const newLetter: LtcTable = Object.fromEntries(
            Object.entries(letter).map(([k, v]) => [k.toLowerCase(), v])
        );
        newLetter.lettermessage = newLetter.lettermessage.replaceAll(/[\x00]/g,'')
        newLetter.letterpostdate = new Date(Number(letter.letterPostDate.split('/Date(')[1].split(')/')[0]))
        return newLetter
    })

    await db
        .insertInto('ltc')
        .values(patchedJson)
        .onConflict(oc => oc
            .column('id')
            .doNothing())
        .execute()
}