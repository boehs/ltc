import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerResource } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { Resource, Show } from 'solid-js';
import { main } from './[id].module.css'

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export function routeData() {
    return createServerResource(() => useParams().letter, async function(letter) {
        const stuffs = await db
            .selectFrom('ltc')
            .where('id', '=', Number(letter))
            .limit(1)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
            .executeTakeFirst()
        return {
            message: stuffs.lettermessage,
            hearts: stuffs.letterup,
            id: stuffs.id,
            date: stuffs.letterpostdate,
            location: getLocation(IPv4.fromString(stuffs.senderip)),
            commentsN: stuffs.lettercomments
        }
    })

}

export default function LetterID() {
    const data: Resource<LetterData> = useRouteData()
    return (<main class={main}>
        <Show when={data()}>
            <Letter expanded={true} {...data()}/>
        </Show>
        <hr/>
        <Show when={data()}>
            <h3>{data().commentsN} comments</h3>
        </Show>
        
    </main>)
}