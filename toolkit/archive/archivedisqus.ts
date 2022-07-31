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
    api_key: process.env.API_KEY
}


// oddities:
// http://ip.addr.like.this/letter/
// http://mail.letterstocrushes.com/letter/
// http://letterstocrushes.com/(F(Ie3anfATscfBdLjAV7KSIR7Ou7cjwphDJkYmQF0aVPNBGDqdmdMa_x-VsWUiHAKK90Sc71A4LznHuOtT_Ke4PnzsR6hUKRekOXxc8IozA-sfMK5r7lYDHBqs5HRzDOFZuJH5rJ6ArEMKoG484txuvzDFgnKnzIzkrYvIfhbeFGoCR9J_d3EY5haDKzYSx0n1bJD3DQSWeWsZj_X_cSM0yw2))/letter/461848

const letterRegex = /https?:\/\/(([0-9.]*)|(((www\.)|(mail\.))?letterstocrushes\.com))\/(.*\/)?(([lL]etter)|(post))\//

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
    console.log(response.response[0].id, response.response.length, response.cursor.next,response.response[0].thread.link)
    const body: any[] = response.response || []
    if (body.length > 0) {
        const l = body.flatMap(item => {
            // crushed.tumblr.com/post/*
            if (/(tumblr|post|disqus)/.test(item.thread.link as string))
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
                letterid: Number((item.thread.link as string)
                    .replace(letterRegex, '')
                ),
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
        writeCommentsToDB(l)
    }
}

db.destroy()