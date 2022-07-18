import { ErrorBoundary, Show } from 'solid-js'
import './Letter.scss'
import xss from 'xss'

const LetterLinkRegex = /(?<!<a.*>)(?:\n|\s)*?https?:\/\/letterstocrushes.com\/(letter\/[0-9]{1,7})(?!(<\/a>)|[0-9]|('?"?>))/gs
const LetterHashRegex = /(?<!<a.*>)(#[0-9]{1,7})|([0-9]{1,7}#)(?!(<\/a>)|[0-9]|('?"?>))/g

interface LetterProps {
    message: string
    date: Date
    location: string
    id: number
    commentsN: number
    expanded: boolean
    hearts: number
    hidden?: boolean
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

export default function Letter(props: LetterProps) {
    let date = () => new Date(props.date)
    return (<ErrorBoundary fallback={err => <>Error rendering this letter: {err}. Sorry :(</>}>
        <div class="letter" style={`${props.hidden ? 'color: var(--lighter)' : ''}`}>
            <div class="letter-actions">
                <ErrorBoundary fallback={err => <>Error rendering date: {err}</>}>
                    <div>
                        <a href={`/letter/${props.id}`}>
                            {date().toLocaleDateString([], { dateStyle: 'long' })}, {date().toLocaleTimeString([], { timeStyle: 'short' })}
                        </a>
                    </div>
                </ErrorBoundary>
                <ErrorBoundary fallback={err => <>Error rendering information: {err}</>}>
                    <div>
                        <Show when={props.commentsN > 0}>
                            <span>{props.commentsN} <img src='/comment.png' /></span>
                        </Show>
                        <span>{props.hearts} <img src='/heart.png' /></span>
                        <Show when={props.location}>
                            <span>{getFlagEmoji(props.location)}</span>
                        </Show>
                    </div>
                </ErrorBoundary>
            </div>
            <div innerHTML={xss(props.message)
                .replace(LetterLinkRegex,'<a href="/$1">letterstocrushes.com/$1</a>')
                .replace(LetterHashRegex,'<a href="/$1$2">$1$2</a>')
            }/>
        </div>
    </ErrorBoundary>)
}