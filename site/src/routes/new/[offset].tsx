import { db, getLocation, patchJson, writeLettersToDB } from '../../../../shared'
import { createServerData } from 'solid-start/server'
import { IPv4 } from "ip-num/IPNumber.js";
import LetterList from '~/components/LetterList';

export function routeData({params}) {
    return createServerData(() => params.offset, async function (offset) {
        fetch('http://letterstocrushes.com/api/get_letters/-1/' + offset)
        .then(async (res) => {
            if (res.status == 200) {
                console.log('got letters ' + offset)
                const json = await res.json()
                if(json.length > 0) writeLettersToDB(patchJson(json))
            }
        })
        const stuffs = await db
            .selectFrom('ltc')
            .orderBy('id', 'desc')
            .limit(10)
            .where('hidden','=',false)
            .where('letterlevel', '>=', 0)
            .offset((Number(offset) * 10) - 10)
            .select(['lettermessage', 'id', 'letterpostdate', 'senderip', 'lettercomments', 'letterup'])
            .execute()
        if (stuffs && stuffs.length != 0) {
            return stuffs.map(stuffs => {
                return {
                    message: stuffs.lettermessage,
                    hearts: stuffs.letterup,
                    id: stuffs.id,
                    date: stuffs.letterpostdate,
                    location: stuffs.senderip ? getLocation(IPv4.fromString(stuffs.senderip.trim())) : null,
                    commentsN: stuffs.lettercomments
                }
            })
        } else {
            return false
        }
    })
}

export default function LetterId() {
    return <LetterList/>
}