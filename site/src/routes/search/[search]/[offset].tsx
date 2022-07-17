import { db, getLocation } from '../../../../../shared'
import { createServerData } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { sql } from 'kysely';
import LetterList from '~/components/LetterList';

export function routeData({ params }) {
    return createServerData(() => [params.offset, params.search], async function ([offset, search]) {
        const stuffs = await db
            .selectFrom('ltc')
            .orderBy('id', 'desc')
            .limit(10)
            .where('hidden', '=', false)
            .where('lmts', '@@', sql<"tsquery">`websearch_to_tsquery(${search})`)
            .offset((Number(offset) * 10) - 10)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
            .execute()
        if (stuffs && stuffs.length != 0) {
            return stuffs.map(stuffs => {
                return {
                    message: stuffs.lettermessage,
                    hearts: stuffs.letterup,
                    id: stuffs.id,
                    date: stuffs.letterpostdate,
                    location: getLocation(IPv4.fromString(stuffs.senderip.trim())),
                    commentsN: stuffs.lettercomments
                }
            })
        } else {
            return false
        }
    })
}

export default function LetterID() {
    return <LetterList/>
}