import { createShortcut, Popup } from "~/lib/shortcuts";
import { useNavigate } from "solid-start";
import "./Header.scss";
import { isServer, } from "solid-js/web";

export default function Header() {
  const navigate = useNavigate()
  if (!isServer) {
    createShortcut(['B'], () => history.back())
  }
  createShortcut(['R'], () => navigate('/random', { scroll: true }))
  createShortcut(['N'], () => navigate('/new', { scroll: true }))
  createShortcut(['F'], () => navigate('/', { scroll: true }))

  return (<header>
    <Popup callback={(_, d) => {
      navigate(`/letter/${d.get('id')}`)
    }} shortcut={["G"]}>
      <input type="number" min='0' max='9999999' name="id" placeholder="Enter a letter ID" />
    </Popup>
    <Popup callback={(_, d) => {
      navigate(`/search/${d.get('term')}/1`)
    }} shortcut={["S"]}>
      <input type="text" name="term" placeholder="What are you looking for?" />
    </Popup>
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
