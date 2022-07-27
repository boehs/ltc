#!/usr/bin/env ts-node

import { readFile, readdir as readDir} from 'node:fs/promises'
import { LtcJson, patchJson, writeLettersToDB } from '../shared.js'

const files = await readDir('../letter')

for (const file of files) {
    console.log(file)
    const contents = await readFile(`./letter/${file}`)
    const json: LtcJson[] = JSON.parse(contents.toString())
    
    writeLettersToDB(patchJson(json))
}