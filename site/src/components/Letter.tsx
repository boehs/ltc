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
    return (<div class="letter">
        <div class="letter-actions">
            <div>
                <a href={`/letter/${props.id}`}>{props.date.toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })} {getFlagEmoji(props.location)}</a>
            </div>
            <div>
                <a href={`/letter/${props.id}`}><span>{props.hearts} <b>♡</b></span> <span>{props.commentsN} <b>🗩</b></span></a>
            </div>
        </div>
        <div innerHTML={props.message} />
    </div>)
}