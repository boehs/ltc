import fetch from 'node-fetch'
import { writeCommentsToDB, db } from '../../shared.js'
import 'dotenv/config'

let params: {
    related: "thread"
    limit: 100
    forum: "crushes"
    cursor?: string
    api_key: string
} = {
    related: "thread",
    limit: 100,
    forum: "crushes",
    cursor: "1264970782551154:0:0",
    api_key: process.env.API_KEY
}


// oddities:
// http://ip.addr.like.this/letter/
// http://mail.letterstocrushes.com/letter/
// http://letterstocrushes.com/(F(Ie3anfATscfBdLjAV7KSIR7Ou7cjwphDJkYmQF0aVPNBGDqdmdMa_x-VsWUiHAKK90Sc71A4LznHuOtT_Ke4PnzsR6hUKRekOXxc8IozA-sfMK5r7lYDHBqs5HRzDOFZuJH5rJ6ArEMKoG484txuvzDFgnKnzIzkrYvIfhbeFGoCR9J_d3EY5haDKzYSx0n1bJD3DQSWeWsZj_X_cSM0yw2))/letter/461848

const letterRegex = /https?:\/\/(([0-9.]*)|((([Ww]ww\.)|(mail\.))?letterstocrushes\.com))\/(.*\/)?(([lL]etter)|(post))\//

const createQueryString = (params: {
    [key: string]: any
}) => Object.keys(params).map(key => key + '=' + params[key]).join('&');

const disqusBase = `https://disqus.com/api/3.0/forums/listPosts.json?`

async function* fetchAndMaybeAgain() {
    let response: Record<string, any>;
    do {
        response = await (await fetch(disqusBase + createQueryString(params))).json() as object
        yield response
        params = {
            ...params,
            cursor: response.cursor.next as string
        }
    } while (response.cursor.hasNext)
}

for await (const response of fetchAndMaybeAgain()) {
    const body: any[] = response.response || []
    if (body.length > 0) {
        const l = body.flatMap(item => {
            const id = Number((item.thread.link as string)
                // wtf
                .replace('%202', '')
                .replace(letterRegex, '')
                // like ?refid=0
                .replace(/\?.*/, '')
            )

            if (
                // crushed.tumblr.com/post/*
                // disqus.com/*
                // crushes.disqus.com/*
                // http://www.dhuck.com/letter/55775
                /(tumblr|post|disqus|dhuck)/.test(item.thread.link as string)
                // comments not on a letter
                || !/(([lL]etter)|(post))\//.test(item.thread.link as string)
                // (this one was hard deleted so there is a fk constraint violation)
                || [36,23121,19660,19547,17450,14540,14257,13700,11141,10573].includes(id)
            )
                return []
            // testing code
            if (Number.isNaN(Number((item.thread.link as string)
                .replace(letterRegex, '')
            ))) console.log(item.thread.link)
            return [{
                id: Number(item.id),
                commentmessage: item.message as string,
                hearts: item.likes as number,
                commentername: item.author.name as string,
                commentdate: new Date(item.createdAt),
                letterid: id,
                // this is actually the commenter username
                commenteremail: item.author.username as string,
                // this is actually a custom input field
                commenterip: item.author.location as string,
                viadisqus: true,
                extradisqusmetadata: {
                    dislikes: item.dislikes,
                    author: {
                        url: item.author.url || null,
                        joinedAt: item.author.joinedAt || null
                    },
                    thread: {
                        posts: item.thread.posts
                    },
                    isEdited: item.isEdited
                }
            }]
        })
        // @ts-expect-error
        if (l.length > 0) writeCommentsToDB(l)
        console.log(response.response[0].id, response.response.length, response.cursor.next, response.response[0].thread.link,l.length)
    }
}

db.destroy()