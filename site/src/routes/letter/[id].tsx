import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerResource, StartContext, StatusCode } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { Resource, Show, useContext } from 'solid-js';
import NotFound from '../[...404]';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export function routeData({ params }) {
    return createServerResource(() => useParams().id, async function (id) {
        const stuffs = await db
            .selectFrom('ltc')
            .where('id', '=', Number(id))
            .limit(1)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
            .executeTakeFirst()
        if (stuffs) {
            return {
                message: stuffs.lettermessage,
                hearts: stuffs.letterup,
                id: stuffs.id,
                date: stuffs.letterpostdate,
                location: getLocation(IPv4.fromString(stuffs.senderip)),
                commentsN: stuffs.lettercomments
            }
        } else {
            return false
        }
    })

}

export default function LetterID() {
    const data: Resource<LetterData> = useRouteData()
    return (<main>
        <Show when={data()} fallback={<NotFound/>}>
            <Letter expanded={true} {...data()} />
            <hr />
            <h3>{data().commentsN} comments</h3>
        </Show>

    </main>)
}