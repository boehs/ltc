import { Navigate, useRouteData } from 'solid-app-router'
import { db } from '../../../shared'
import { createServerData } from 'solid-start/server'
import { Resource, Show } from 'solid-js';
import { sql } from 'kysely';

export function routeData() {
    return createServerData(async function () {
        return await db
            .selectFrom('ltc')
            .where('letterlevel', 'not in', [-1,-10])
            .orderBy(sql`random()`, 'asc')
            .limit(1)
            .select('id')
            .executeTakeFirst()
    })
}

export default function LetterID() {
    const data: Resource<{id:number}> = useRouteData()
    return (<p>
        Loading...
        <Show when={data()}>
            <Navigate href={`/letter/${data().id}`} />
        </Show>
    </p>)
}