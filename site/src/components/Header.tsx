import "./Header.scss";

export default function Header() {
  return (<header>
            <h1>
                <a href="/">letters to crushes</a>
            </h1>
            <ul>
                <li><a class="secondary" href="/send">send</a></li>
                <li><a class="secondary" href="/new">new</a></li>
            </ul>
  </header>)
}
