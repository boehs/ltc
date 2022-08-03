import { Navigate, useRouteData, Title } from 'solid-start'
import { db } from '../../../shared'
import { createServerData } from 'solid-start/server'
import { Show } from 'solid-js';
import { sql } from 'kysely';

export function routeData() {
    return createServerData(async function () {
        const query = async () => await (await sql<{
            id: number,
            letterlevel: number
        }>`select id, letterlevel from ltc tablesample system_rows(1);`.execute(db)).rows[0]
        let res: Awaited<ReturnType<typeof query>>
        do {
            res = await query()
            console.log(res)
        } while (0 > res.letterlevel)
        return res.id
    })
}

export default function LetterID() {
    const data: ReturnType<typeof routeData> = useRouteData()
    return (<>
        <p>
            Loading...
            <Show when={data()}>
                <Title>Letter {data()}</Title>
                <Navigate href={`/letter/${data()}/`} />
            </Show>
        </p>
    </>)
}