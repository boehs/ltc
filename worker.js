//import { updatedb } from './db.ts'
const encoder = new TextEncoder()
console.log('worker first run')


self.onmessage = async (e) => {
    const { offset, endpoint, folder } = e.data
    const letter = offset
    const start = Date.now()
    const letters = await fetch(`${endpoint}/${letter}`, {
        headers: new Headers({
            "User-Agent": "Letters to crushes data analysis project for AP statistics (evan@boehs.org)"
        })
    })
    const json = await letters.json()
    switch (letters.status) {
        case 404 || 500:
            console.log(`404! for letter ${letter}`)
            break
        case 200: {
            console.log(`got letter ${letter}, took ${(Date.now()-start)/1000} seconds`)
            await Deno.writeFile(`./${folder}/${letter}.json`,encoder.encode(JSON.stringify(json, null, 4)))
            //for (const item of json) {
            //    console.log(await updatedb(item))
            //}
            break
        }
        default: console.log(`${letters.status} for ${letter}`)
    }
    await self.postMessage({status: letters.status, json: json})
}