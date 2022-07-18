import { createShortcut } from "~/lib/shortcuts";
import { useNavigate } from "solid-app-router";
import "./Header.scss";
import { isServer } from "solid-js/web";

export default function Header() {
  const navigate = useNavigate()
  if (!isServer) {
    createShortcut(['B'], () => history.back())
  }
  createShortcut(['R'], () => navigate('/random', { scroll: true }))
  createShortcut(['N'], () => navigate('/new', { scroll: true }))
  createShortcut(['S'], () => navigate('/search', { scroll: true }))
  createShortcut(['F'], () => navigate('/', { scroll: true }))

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
