import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../../shared'
import Letter from '~/components/Letter'
import { createServerResource } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { For, Show } from 'solid-js';
import NotFound from '../../[...404]';
import Pagination from '~/components/Pagination';
import { sql } from 'kysely';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export function routeData({params}) {
    return createServerResource(() => [params.offset,params.search], async function ([offset,search]) {
        const stuffs = await db
            .selectFrom('ltc')
            .orderBy('id', 'desc')
            .limit(10)
            .where('hidden','=',false)
            .where('lmts','@@',sql<"tsquery">`websearch_to_tsquery(${search})`)
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
                    location: getLocation(IPv4.fromString(stuffs.senderip)),
                    commentsN: stuffs.lettercomments
                }
            })
        } else {
            return false
        }
    })
}

export default function LetterID() {
    const data: ReturnType<typeof routeData> = useRouteData()
    const id = () => Number(useParams().offset)
    return (<main>
        <Show when={data()} fallback={<NotFound/>}>
            <For each={data()}>
                {letter => <Letter expanded={true} {...letter} />}
            </For>
        </Show>
        <Pagination id={id()}/>
        {/*<Show when={data() && data() != false}>
            {\/* @ts-expect-error *\/}
            <i>showing {data().length} results for '{useParams().search}'</i>
        </Show>*/}
        
    </main>)
}