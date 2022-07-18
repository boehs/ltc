import { useParams, useRouteData } from 'solid-app-router'
import { db, getLocation } from '../../../../shared'
import Letter from '~/components/Letter'
import { createServerData } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import { ErrorBoundary, Resource, Show } from 'solid-js';
import NotFound from '../[...404]';
import Pagination from '~/components/Pagination';
import { activeStateListener } from '~/lib/shortcuts';

interface LetterData {
    message: string;
    id: number;
    date: Date;
    location: string;
    commentsN: number;
    hearts: number
    hidden: boolean
}

export function routeData({ params }) {
    return createServerData(() => params.id, async function (id) {
        const stuffs = await db
            .selectFrom('ltc')
            .where('id', '=', Number(id))
            .limit(1)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup', 'hidden'])
            .executeTakeFirst()
        if (stuffs) {
            return {
                message: stuffs.lettermessage,
                hidden: stuffs.hidden,
                hearts: stuffs.letterup,
                id: stuffs.id,
                date: stuffs.letterpostdate,
                location: getLocation(IPv4.fromString(stuffs.senderip.trim())),
                commentsN: stuffs.lettercomments
            }
        } else {
            return false
        }
    })

}

export default function LetterID() {
    const data: Resource<LetterData> = useRouteData()
    return (<main>
        <ErrorBoundary fallback={err => <p>{err}</p>}>
            <Show when={data()} fallback={<NotFound />}>
                <ErrorBoundary fallback={err => <p>{err}</p>}>
                    <Letter expanded={true} {...data()} />
                </ErrorBoundary>
                <ErrorBoundary fallback={err => <p>{err}</p>}>
                    <hr />
                    <h3>{data().commentsN} comments</h3>
                    <form>
                        <Show when={!data().hidden} fallback={<>
                            <h4>:/</h4>
                            <p>You can't comment on hidden posts!</p>
                        </>}>
                            <h4>Leave a comment</h4>
                            <label for="name">Name:</label>
                            <input type="text" name="name" onInput={activeStateListener}></input>
                            <label for="name">Email:</label>
                            <input type="email" name="email" onInput={activeStateListener}></input>
                            <small>Email is optional and never shown. Leave yours if you want email notifications on new comments for this letter.</small>
                            <label for="comment">Leave a comment:</label>
                            <textarea rows="1" name='comment' onInput={(e) => {
                                    activeStateListener(e)
                                    
                                    e.target.style.height = "1px";
                                    const height = e.target.scrollHeight + 2
                                    e.target.style.height = (height > 192 ? 192 : height)+"px";
                            }}></textarea>
                            <input type='submit' value="Send 💌"></input>
                        </Show>
                    </form>
                </ErrorBoundary>
            </Show>
        </ErrorBoundary>

        <Pagination id={(() => Number(useParams().id))()} />
    </main>)
}