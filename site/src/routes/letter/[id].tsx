import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerResource } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { Resource, Show } from 'solid-js';
import NotFound from '../[...404]';
import Pagination from '~/components/Pagination';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
    hidden: boolean
}

export function routeData({params}) {
    return createServerResource(() => params.id, async function (id) {
        const stuffs = await db
            .selectFrom('ltc')
            .where('id', '=', Number(id))
            .limit(1)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup','hidden'])
            .executeTakeFirst()
        if (stuffs) {
            return {
                message: stuffs.lettermessage,
                hidden: stuffs.hidden,
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
        <Pagination id={(() => Number(useParams().id))()}/>
    </main>)
}