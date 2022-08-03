import { Generated, sql } from "kysely";
import { Kysely, PostgresDialect } from "kysely"
import pkg from 'pg';
import Cursor from 'pg-cursor'
const { Pool } = pkg;
import 'dotenv/config'
import { IPv4 } from "ip-num/IPNumber.js";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    lmts: "tsquery"
}
export interface LtcJson extends LtcBase {
    Id: number
    letterPostDate: string
}

export interface LtcCommentBase {
    commentmessage: string
    commentername: string
    letterid: number
    sendemail?: boolean
    hearts: number
    commenteremail: string
    commenterguid?: string
    level?: number
    commenterip: string
}

export interface LtcCommentJSON extends LtcCommentBase {
    Id: number
    commentdate: string
}

export interface LtcCommentTable extends LtcCommentBase {
    id: Generated<number>
    commentdate: Date
    viadisqus?: true
    extradisqusmetadata: any
}

interface Database {
    ltc: LtcTable
    ltccomments: LtcCommentTable
}

export const pool = new Pool({
    database: process.env.db,
    host: process.env.host || "localhost",
    user: process.env.user,
    password: process.env.pass
})

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: pool,
        cursor: Cursor
    })
})

export async function writeLettersToDB(letters: LtcTable[]) {
    letters = letters.map((letter) => {
        // @ts-expect-error
        if (letter.letterlevel == -1) letter.hidden = true
        return letter
    })
    return await db
        .insertInto('ltc')
        .values(letters)
        .onConflict(oc => {
            return oc
                .column('id')
                .doUpdateSet({
                    letterup: sql`excluded.letterup`,
                    letterlevel: sql`excluded.letterlevel`,
                    lettercomments: sql`excluded.lettercomments`,
                    lettermessage: sql`excluded.lettermessage`
                })
        })
        .execute()
}

export function patchJson(json: LtcJson[]): LtcTable[] {
    return json.map(letter => {
        // @ts-expect-error
        const newLetter: LtcTable = Object.fromEntries(
            Object.entries(letter).map(([k, v]) => [k.toLowerCase(), v])
        );
        newLetter.lettermessage = newLetter.lettermessage.replaceAll(/[\x00]/g, '')
        newLetter.letterpostdate = new Date(Number(letter.letterPostDate.split('/Date(')[1].split(')/')[0]))
        return newLetter
    })
}

export async function writeCommentsToDB(comments: LtcCommentTable[]) {
    return await db
        .insertInto('ltccomments')
        .values(comments)
        .onConflict(oc => {
            return oc
                .column('id')
                .doUpdateSet({
                    hearts: sql`excluded.hearts`
                })
        })
        .execute()
}

export function patchCommentJson(json: LtcCommentJSON[]): LtcCommentTable[] {
    return json.map(comment => {
        // @ts-expect-error
        const newComment: LtcCommentTable = Object.fromEntries(
            Object.entries(comment).map(([k, v]) => [k.toLowerCase(), v])
        );
        newComment.commentmessage = newComment.commentmessage.replaceAll(/[\x00]/g, '')
        // @ts-expect-error
        newComment.commentdate = new Date(Number(newComment.commentdate.split('/Date(')[1].split(')/')[0]))
        return newComment
    })
}

const IpDB: [number, number, string][] = await new Promise(function (resolve, reject) {
    const result: [number, number, string][] = [];
    createReadStream(__dirname + '/node_modules/@ip-location-db/asn-country/asn-country-ipv4-num.csv')
        .pipe(parse())
        .on("data", (data) => {
            result.push([Number(data[0]), Number(data[1]), data[2]]);
        })
        .on('end', () => resolve(result))
        .on('error', reject)
})

export function getLocation(ip: IPv4) {
    for (const entry of IpDB) {
        if (entry[0] < ip.getValue() && ip.getValue() < entry[1]) {
            return entry[2]
        }
    }
}