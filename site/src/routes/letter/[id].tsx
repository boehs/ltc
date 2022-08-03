import { createEffect, ErrorBoundary, For, Show } from 'solid-js';
import { useParams, useRouteData, Title } from 'solid-start'
import { createServerData } from 'solid-start/server'

import { activeStateListener, setActivePopup } from '~/lib/shortcuts';

import NotFound from '../[...404]';

import Letter from '~/components/Letter'
import Pagination from '~/components/Pagination';
import RenderError from '~/components/RenderError';

import { IPv4 } from "ip-num/IPNumber.js";
import { db, getLocation, patchCommentJson, patchJson, writeCommentsToDB, writeLettersToDB } from '../../../../shared'
import { sql } from 'kysely';

import xss from 'xss';

export function routeData({ params }) {
    return {
        letter: createServerData(() => params.id, async function (id) {
            const useId = () => Number(id)
            fetch('http://letterstocrushes.com/Home/GetLetter/' + useId())
                .then(async (res) => {
                    if (res.status == 200) {
                        console.log('got letter ' + useId())
                        const json = await res.json()
                        writeLettersToDB(patchJson([json]))
                    }
                })
            const stuffs = await db
                .selectFrom('ltc')
                .where('id', '=', useId())
                .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'letterup', 'hidden',(ns) => {
                    return ns
                        .selectFrom('ltccomments')
                        // @ts-expect-error
                        .select(sql`count(*)`)
                        .where('letterid','=',useId())
                        .as('lettercomments')
                }])
                .executeTakeFirst()
            if (stuffs) {
                return {
                    message: stuffs.lettermessage,
                    hidden: stuffs.hidden,
                    hearts: stuffs.letterup,
                    id: stuffs.id,
                    date: stuffs.letterpostdate,
                    location: stuffs.senderip ? getLocation(IPv4.fromString(stuffs.senderip.trim())) : null,
                    commentsN: stuffs.lettercomments
                }
            }
        }),
        comments: createServerData(() => params.id, async function (id) {
            const useId = () => Number(id)
            fetch('http://letterstocrushes.com/Comment/GetComments/' + useId())
                .then(async (res) => {
                    if (res.status == 200) {
                        const json = await res.json()
                        console.log(`got ${json.length} comments for ${useId()}`)
                        if (json.length > 0) writeCommentsToDB(patchCommentJson(json))
                    }
                })
            let comments = await db
                .selectFrom('ltccomments')
                .select([
                    "commentdate",
                    "commentername",
                    "commentmessage",
                    "viadisqus"
                ])
                .where('letterid', '=', useId())
                .orderBy('commentdate')
                .execute()
            comments = comments.map(comment => {
                return {
                    ...comment,
                    commentmessage: xss(comment.commentmessage),
                    commentername: xss(comment.commentername)
                }
            })
            return comments
        })
    }
}

export default function LetterID() {
    const data: ReturnType<typeof routeData> = useRouteData()
    createEffect(() => { if (data.letter()) setActivePopup(false) })
    return (<>
        <ErrorBoundary fallback={err => <RenderError error={err} />}>
            <Show when={data.letter()} fallback={<NotFound />}>
                <Title>Letter {data.letter().id}</Title>
                <ErrorBoundary fallback={err => <RenderError error={err} />}>
                    <Letter expanded={true} {...data.letter()} />
                </ErrorBoundary>
                <ErrorBoundary fallback={err => <p>{err}</p>}>
                    <div class='comments'>
                        <h3>{data.letter().commentsN} comments</h3>
                        <Show when={data.comments()}>
                            <ul>
                                <For each={data.comments()}>
                                    {comment => <li class='comment'>
                                        <div class='comment-actions'>
                                            <h4>
                                                <Show when={comment.viadisqus}>
                                                    <small style={{
                                                        "font-size": "8px"
                                                    }}>disqus </small>
                                                </Show>
                                                {comment.commentername}
                                            </h4>
                                            <span>{(() => new Date(comment.commentdate))().toLocaleDateString([], { dateStyle: 'long' })}, {(() => new Date(comment.commentdate))().toLocaleTimeString([], { timeStyle: 'short' })}</span>
                                        </div>
                                        <div class='comment-text' innerHTML={comment.commentmessage}/>
                                    </li>}
                                </For>
                            </ul>
                        </Show>
                        <form class='disabled'>
                            <Show when={!data.letter().hidden} fallback={<>
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
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = "1px";
                                    const height = target.scrollHeight + 2
                                    target.style.height = (height > 192 ? 192 : height) + "px";
                                }}></textarea>
                                <input type='submit' value="Send 💌"></input>
                            </Show>
                        </form>
                    </div>
                </ErrorBoundary>
            </Show>
        </ErrorBoundary>
        <Pagination id={(() => Number(useParams().id))()} />
    </>)
}