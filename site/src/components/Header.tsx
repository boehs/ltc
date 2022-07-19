import { createShortcut } from "~/lib/shortcuts";
import { useNavigate } from "solid-app-router";
import "./Header.scss";
import { isServer, Portal } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";

export const [popup, setPopup] = createSignal<false | 'goto'>(false)

export default function Header() {
  const navigate = useNavigate()
  if (!isServer) {
    createShortcut(['B'], () => history.back())
  }
  createShortcut(['R'], () => navigate('/random', { scroll: true }))
  createShortcut(['N'], () => navigate('/new', { scroll: true }))
  createShortcut(['S'], () => navigate('/search', { scroll: true }))
  createShortcut(['F'], () => navigate('/', { scroll: true }))
  createShortcut(['G'], () => setPopup(state => state == 'goto' ? false : 'goto'))

  createEffect(() => {
    if (popup() == 'goto') {
      let input: HTMLInputElement
      <Portal>
        <form class="putInCenter" onSubmit={
          (e) => {
            e.preventDefault()
            navigate(`/letter/${input.value}`)
          }
        }>
          <input type="number" ref={input} min='0' max='9999999' placeholder="Enter a letter ID" />
        </form>
      </Portal>
      input.focus()
      createShortcut(['Escape'], () => {
        setPopup(false)
      })
    }
  })

  return (<header>
    <h1>
      <a href="/">letters to crushes</a>
    </h1>
    <ul>
      <li><a class="secondary" href="/send">send</a></li>
      <li><a class="secondary" href="/new">new</a></li>
      <li><a class="secondary" href="/random">random</a></li>
      <li><a class="secondary" href="/search">search</a></li>
    </ul>
  </header>)
}
