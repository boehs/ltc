import { Navigate, useRouteData } from 'solid-app-router'
import { db } from '../../../shared'
import { createServerResource } from 'solid-start/server'
import { Resource, Show } from 'solid-js';
import { sql } from 'kysely';

export function routeData() {
    return createServerResource(async function () {
        return await db
            .selectFrom('ltc')
            .orderBy(sql`random()`, 'asc')
            .limit(1)
            .select('id')
            .executeTakeFirst()
    })
}

export default function LetterID() {
    const data: Resource<{id:number}> = useRouteData()
    console.log(data())
    return (<p>
        Loading...
        <Show when={data()}>
            <Navigate href={`/letter/${data().id}`} />
        </Show>
    </p>)
}