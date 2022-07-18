import Letter from '~/components/Letter'
import { useNavigate, useParams, useRouteData } from 'solid-app-router'
import { ErrorBoundary, For, Resource, Show } from 'solid-js';
import NotFound from '../routes/[...404]';
import Pagination from '~/components/Pagination';
import { createShortcut } from '~/lib/shortcuts';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
}

export default function LetterList() {
    const data: Resource<LetterData[]> = useRouteData()
    const id = () => Number(useParams().offset)
    const navigate = useNavigate()
    return (<main>
        <ErrorBoundary fallback={<NotFound/>}>
            <Show when={data()} fallback={<NotFound/>}>
                <For each={data()}>
                    {(letter,i) => {
                        if (12 > i()) createShortcut([`${i() == 9 ? 0 : i() + 1}`],() => navigate(`/letter/${letter.id}`))
                        return <Letter expanded={true} {...letter} />
                    }}
                </For>
            </Show>
        </ErrorBoundary>
        <Pagination id={id()}/>
    </main>)
}