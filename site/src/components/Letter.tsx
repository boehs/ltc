import { ErrorBoundary } from 'solid-js'
import './Letter.scss'

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
                        <a href={`/letter/${props.id}`}>
                            <span> {props.hearts} <img src='/heart.png' /></span>
                            <span> {props.commentsN} <img src='/comment.png' /></span>
                            <span>{' ' + getFlagEmoji(props.location)}</span>
                        </a>
                    </div>
                </ErrorBoundary>
            </div>
            <div innerHTML={props.message} />
        </div>
    </ErrorBoundary>)
}