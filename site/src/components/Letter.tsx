import { ErrorBoundary, Show } from 'solid-js'
import { createLocalStorage } from '@solid-primitives/storage'
import './Letter.scss'
import xss from 'xss'
import RenderError from './RenderError'

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
    if (countryCode == null) return '❓'
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const [storage, setStorage] = createLocalStorage()

export default function Letter(props: LetterProps) {
    if (!storage.bookmarks) setStorage('bookmarks', '')
    let bookmarkArray = () => new Set(storage.bookmarks?.split(',') || [])
    let date = () => new Date(props.date)
    return (<ErrorBoundary fallback={err => <RenderError error={err} />}>
        <div class="letter" style={`${props.hidden ? 'color: var(--lighter)' : ''}`}>
            <div class="letter-actions">
                <ErrorBoundary fallback={err => <>Error rendering date: {err}</>}>
                    <div>
                        <a href={`/letter/${props.id}`}>
                            {date().toLocaleDateString([], { dateStyle: 'long' })}, {date().toLocaleTimeString([], { timeStyle: 'short' })}
                        </a>
                    </div>
                </ErrorBoundary>
                <ErrorBoundary fallback={err => <RenderError error={err} />}>
                    <div>
                        <Show when={props.commentsN > 0}>
                            <span>{props.commentsN} <img src='/comment.png' /></span>
                        </Show>
                        <span>{props.hearts} <img src='/heart.png' /></span>
                        <span onclick={() => {                            
                            setStorage('bookmarks', bookmarkArray().has(String(props.id))
                                ? [...bookmarkArray()].filter(i => i != String(props.id)).toString()
                                : [...bookmarkArray(),props.id].toString())
                        }}>
                            <img src={bookmarkArray().has(String(props.id)) ? '/bookmarked.svg' : '/bookmark.svg'} style={{
                                "padding-bottom": `${(16 - 10) / 2}px`
                            }} />
                        </span>
                        <span>{getFlagEmoji(props.location)}</span>
                    </div>
                </ErrorBoundary>
            </div>
            <div innerHTML={xss(props.message)
                .replace(LetterLinkRegex, '<a href="/$1">letterstocrushes.com/$1</a>')
                .replace(LetterHashRegex, '<a href="/$1$2">$1$2</a>')
                .replaceAll('\n','<br/>')
            } />
        </div>
    </ErrorBoundary>)
}