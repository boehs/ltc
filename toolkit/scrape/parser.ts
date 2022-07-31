// I haven't needed to use this yet. thank god.

const id = 896456

import * as cheerio from 'cheerio';
import { LetterComment, LtcTable } from '../../shared';
import { parseDate } from 'chrono-node';

const $ = cheerio.load(letter)

const comments: LetterComment[] = []

$('.comment').each((_,el) => {
    const comment = cheerio.load(el)
    let commentMessageElm = comment('.comment_message')
    comments.push({
        author: comment('.commenter_name').text().trim(),
        postDate: parseDate(comment('.comment_date').text().trim()),
        text: commentMessageElm.text().trim(),
        id: Number(commentMessageElm.attr('id'))
    })
})

const date = (date: string) => {
    date = date.trim()
    return parseDate(date)
}

const letterJSON: LtcTable = {
    // @ts-expect-error
    id: 896456,
    lettermessage: $(".letterContainer").html().trim(),
    letterpostdate: date($(".dateNav").text()),
    letterup: Number($(`#b${id}`).text().trim()),
    lettercomments: comments.length
}

console.log(letterJSON)