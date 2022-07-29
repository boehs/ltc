import { For } from "solid-js";
import { createLocalStorage } from '@solid-primitives/storage';
import { Title } from "solid-meta";

export default function Bookmarks() {
    return <>
        <Title>Bookmarks</Title>
        <p>Your bookmarks are saved in your browser. To sync them, log in.</p>
        <ul>
            <For each={createLocalStorage()[0].bookmarks?.split(',').slice(1) || []}>
                {bookmark => <li><a href={`/letter/${bookmark}`}>{bookmark}</a></li>}
            </For>
        </ul>
    </>
}