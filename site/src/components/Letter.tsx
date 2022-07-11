import { ErrorBoundary, Show } from 'solid-js'
import './Letter.scss'
import xss from 'xss'

interface LetterProps {
    message: string
    date: Date
    location: string
    id: number
    commentsN: number
    expanded: boolean
    hearts: number
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

export default function Letter(props: LetterProps) {
    let date = new Date(props.date)
    return (<ErrorBoundary>
        <div class="letter">
            <div class="letter-actions">
                <ErrorBoundary fallback={err => <>Error rendering date: {err}</>}>
                    <div>
                        <a href={`/letter/${props.id}`}>
                            {date.toLocaleDateString([], { dateStyle: 'long' })}, {date.toLocaleTimeString([], { timeStyle: 'short' })}
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
            <div innerHTML={xss(props.message)} />
        </div>
    </ErrorBoundary>)
}