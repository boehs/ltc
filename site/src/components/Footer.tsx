import { useIsRouting } from 'solid-app-router'
import { createEffect, createSignal, Show } from 'solid-js'
import { isServer } from 'solid-js/web'
import './Footer.scss'

export default function Footer() {
    const [dark,setDark] = createSignal(false)
    if (!isServer) {
        createEffect(() => dark() ? document.body.classList.add('dark') : document.body.classList.remove('dark'))
    }

    return (
        <footer>
            <ul>
                <li><a class="secondary" href="/about">about</a></li>
                {/*<li><a href="/login">login</a></li>
                <li><a href="/terms" target="_blank" style="">terms of use</a></li>
                <li><a href="/privacy" target="_blank">privacy policy</a></li>
                <li><a href="/apps">apps</a></li>
                <li><a href="/chat">chat</a></li>*/}
                <li><a class="secondary" href="/feedback">feedback</a></li>
                <li><a class="secondary" href="/search">search</a></li>
                <li><a class="secondary" href="/shortcuts">shortcuts</a></li>
                <li><a class="secondary" href="/bookmarks">bookmarks</a></li>
                <li><a class="secondary" href='' onClick={() => setDark(dark => !dark)}>{dark() ? 'light' : 'dark'}</a></li>
            </ul>
            <Show when={useIsRouting()()}>
                <p class='secondary slowfade'>☕ Loading...</p>
            </Show>
        </footer>)
}