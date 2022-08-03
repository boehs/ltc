import { For, onMount } from "solid-js";
import { createLocalStorage } from '@solid-primitives/storage';
import { Title } from "solid-start";

export default function Bookmarks() {
    const [LS,setLS] = createLocalStorage()
    
    onMount(() => {
        const blob = new Blob([localStorage.getItem('bookmarks')],{type: "text/plain"})
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
                        reader.onload = e => setLS('bookmarks',[...new Set([
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