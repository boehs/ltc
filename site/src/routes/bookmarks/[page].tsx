import { For, onMount } from "solid-js";
import { createLocalStorage } from '@solid-primitives/storage';
import { Title, useRouteData } from "solid-start";
import { createServerData } from "solid-start/server";
import { db, getLocation } from "../../../../shared";
import { IPv4 } from "ip-num/IPNumber";
import { isServer } from "solid-js/web";

export function routeData({ params }) {
    const [LS] = createLocalStorage()

    return createServerData(() => isServer || !LS.bookmarks ? false : LS.bookmarks
        .split(',').slice(1)
        .map(id => Number(id))
        .sort((a, b) => a - b)
        .slice((Number(params.page) * 10) - 10, Number(params.page) * 10) as number[]
        , async (ids) => {
            console.log(ids)
            if (!ids) {
                return false
            }
            const stuffs = await db
                .selectFrom('ltc')
                .limit(10)
                .where('id', 'in', ids)
                .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
                .execute()
            if (stuffs && stuffs.length != 0) {
                return stuffs.map(stuffs => {
                    return {
                        message: stuffs.lettermessage,
                        hearts: stuffs.letterup,
                        id: stuffs.id,
                        date: stuffs.letterpostdate,
                        location: stuffs.senderip ? getLocation(IPv4.fromString(stuffs.senderip.trim())) : null,
                        commentsN: stuffs.lettercomments
                    }
                })
            } else {
                return false
            }
        })
}

export default function Bookmarks() {
    const [LS, setLS] = createLocalStorage()

    // @ts-expect-error
    const fn: ReturnType<typeof routeData> = useRouteData()
    console.log(fn())

    onMount(() => {
        const blob = new Blob([LS.bookmarks], { type: "text/plain" })
        const link = URL.createObjectURL(blob)
        const linkElm = document.getElementById('export') as HTMLAnchorElement
        linkElm.href = link
        linkElm.download = `${Date.now()}.ltc.txt`
    })

    return <>
        <Title>Bookmarks</Title>
        <p>Your bookmarks are saved in your browser. To sync them, log in.</p>
        <ul>
            <For each={LS.bookmarks?.split(',').slice(1) || []} fallback={
                <li>But you have no bookmarks sooo</li>
            }>
                {bookmark => <li><a href={`/letter/${bookmark}`}>{bookmark}</a></li>}
            </For>
        </ul>
        <p>You can also:</p>
        <ul>
            <li>
                <label for="upload"><a style={{
                    cursor: "pointer",
                    "text-decoration": "underline"
                }}>Import a backup</a></label>
                <input type="file" id="upload" accept=".ltc.txt" style={{ display: "none" }} onChange={((change) => {
                    const input = change.target as EventTarget & HTMLInputElement
                    if ('files' in input && input.files.length > 0) {
                        const reader = new FileReader()
                        reader.onload = e => setLS('bookmarks', [...new Set([
                            ...LS.bookmarks?.split(','),
                            ...e.target.result.toString().split(',').slice(1)
                        ])].toString())
                        reader.readAsText(input.files[0])
                    }
                })} />
            </li>
            <li>
                <a id="export">Export a backup</a>
            </li>
        </ul>
    </>
}