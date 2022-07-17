import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerData } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { ErrorBoundary, For, Resource, Show } from 'solid-js';
import NotFound from '../[...404]';
import Pagination from '~/components/Pagination';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export function routeData({params}) {
    return createServerData(() => params.offset, async function (offset) {
        const stuffs = await db
            .selectFrom('ltc')
            .orderBy('id', 'desc')
            .limit(10)
            .where('hidden','=',false)
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
    const data: Resource<LetterData[]> = useRouteData()
    const id = () => Number(useParams().offset)
    return (<main>
        <ErrorBoundary fallback={<NotFound/>}>
            <Show when={data()} fallback={<NotFound/>}>
                <For each={data()}>
                    {letter => <Letter expanded={true} {...letter} />}
                </For>
            </Show>
        </ErrorBoundary>
        <Pagination id={id()}/>
    </main>)
}