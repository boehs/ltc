import './Footer.scss'

export default function Footer() {
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
            </ul>
        </footer>)
}