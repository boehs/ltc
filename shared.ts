import { Generated } from "kysely";
import { Kysely, PostgresDialect } from "kysely"
import pkg from 'pg';
const { Pool } = pkg;
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

export interface LtcTable extends LtcBase {
    id: Generated<number>
    letterpostdate: Date;
}

export interface LtcJson extends LtcBase {
    Id: number
    letterPostDate: string
}

interface Database {
    ltc: LtcTable
}

const pool = new Pool({
    database: process.env.db,
    host: process.env.host || "localhost",
    user: process.env.user,
    password: process.env.pass
})

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: pool
    })
})

export async function writeLettersToDB(letters: LtcTable[]) {
    return await db
        .insertInto('ltc')
        .values(letters)
        .onConflict(oc => oc
            .column('id')
            .doNothing())
        .execute()
}

export function patchJson(json: LtcJson[]): LtcTable[] {
    return json.map(letter => {
        // @ts-expect-error
        const newLetter: LtcTable = Object.fromEntries(
            Object.entries(letter).map(([k, v]) => [k.toLowerCase(), v])
        );
        newLetter.lettermessage = newLetter.lettermessage.replaceAll(/[\x00]/g,'')
        newLetter.letterpostdate = new Date(Number(letter.letterPostDate.split('/Date(')[1].split(')/')[0]))
        return newLetter
    })
}

