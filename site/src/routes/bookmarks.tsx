import { For } from "solid-js";
import { createLocalStorage } from '@solid-primitives/storage';

export default function Bookmarks() {
    return <ul>
        <For each={createLocalStorage()[0].bookmarks?.split(',').slice(1) || []}>
            {bookmark => <li><a href={`/letter/${bookmark}`}>{bookmark}</a></li>}
        </For>
    </ul>
}