const offset = 0

import { Database, MySQLConnector, Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';

const connection = new MySQLConnector({
	host: '127.0.0.1',
	database: 'letters',
	//password: ommited for privacy,
	//username: ommited for privacy,
	port: 3306
})

const db = new Database(connection);

class Letter extends Model {
	static table = 'letters';
	static fields = {
		id: { 
			type: DataTypes.INTEGER,
		},
		letter: DataTypes.TEXT,
		date: {
			type: DataTypes.DATETIME,
			allowNull: true
		},
		lang: {
			type: DataTypes.STRING,
			length: 5,
			allowNull: true
		},
		country: {
			type: DataTypes.STRING,
			length: 60,
			allowNull: true
		},
		region: {
			type: DataTypes.STRING,
			length: 100,
			allowNull: true	
		}
	}
}

await db.link([Letter])
await db.sync()

await Letter.delete()

let i = 0
for await (const file of Deno.readDir('./letter')) {
	const n = Number(file.name.replace('.json',''))
	if(n < offset) continue
	console.log(n,i)
	
	const pfile: [
		{
			Id: number,
			letterMessage: string,
			letterPostDate: string,
			letterLanguage: string
		}] = JSON.parse(await Deno.readTextFile(`./letter/${file.name}`))
	const data = pfile.map((entry) => {return {
		id: entry.Id,
		letter: entry.letterMessage.replaceAll(';','CHAR(59)'),
		date: new Date(Number(entry.letterPostDate.replace('/Date(','').replace(')/',''))),
		lang: entry.letterLanguage.replaceAll(';','CHAR(59)')
	}})	
	try {
	await Letter.create(data)
	} catch (_) {
		console.log('looks like you got a duplicate in your dataset uwu')
	}
	i++
}