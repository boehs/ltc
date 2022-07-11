import { Generated } from "kysely";
import { Kysely, PostgresDialect } from "kysely"
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config'
import { IPv4 } from "ip-num/IPNumber.js";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs'

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
    hidden: Generated<boolean>
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
        .onConflict(oc => {
            return oc
                .column('id')
                .doNothing()
        })
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

const IpDB: [number,number,string][] = await new Promise(function(resolve,reject) {
    const result: [number,number,string][] = [];
    createReadStream('./node_modules/@ip-location-db/asn-country/asn-country-ipv4-num.csv')
    .pipe(parse())
    .on("data", (data) => {
        result.push([Number(data[0]),Number(data[1]),data[2]]);
    })
    .on('end', () => {
        resolve(result);
    })
    .on('error',reject)
})

export function getLocation(ip: IPv4) {
    for (const entry of IpDB) {
        if(entry[0] < ip.getValue() && ip.getValue() < entry[1])  {
            return entry[2]
        }
    }
}