import { Navigate, useRouteData } from 'solid-app-router'
import { db } from '../../../shared'
import { createServerData } from 'solid-start/server'
import { Show } from 'solid-js';
import { sql } from 'kysely';
import { Title } from 'solid-meta';

export function routeData() {
    return createServerData(async function () {
        return await db
            .selectFrom('ltc')
            .where('letterlevel', 'not in', [-1, -10])
            .orderBy(sql`random()`, 'asc')
            .limit(1)
            .select('id')
            .executeTakeFirst()
    })
}

export default function LetterID() {
    const data: ReturnType<typeof routeData> = useRouteData()
    return (<>
        <p>
            Loading...
            <Show when={data()}>
                <Title>Letter {data().id}</Title>
                <Navigate href={`/letter/${data().id}/`} />
            </Show>
        </p>
    </>)
}