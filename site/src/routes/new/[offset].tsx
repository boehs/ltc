import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerResource } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { For, Resource, Show } from 'solid-js';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export function routeData() {
    return createServerResource(() => useParams().offset, async function(offset) {
        const stuffs = await db
            .selectFrom('ltc')
            .orderBy('id', 'desc')
            .limit(10)
            .offset((Number(offset) * 10) - 10)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
            .execute()
        return stuffs.map(stuffs => {
            return {
                message: stuffs.lettermessage,
                hearts: stuffs.letterup,
                id: stuffs.id,
                date: stuffs.letterpostdate,
                location: getLocation(IPv4.fromString(stuffs.senderip)),
                commentsN: stuffs.lettercomments
            }
        })
    })
}

export default function LetterID() {
    const data: Resource<LetterData[]> = useRouteData()
    return (<main>
        <Show when={data()}>
            <For each={data()}>
                {letter => <Letter expanded={true} {...letter} />}
            </For>
        </Show>
    </main>)
}