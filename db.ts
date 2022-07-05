import { DataTypes, Database, Model, MySQLConnector } from 'https://deno.land/x/denodb/mod.ts';

export const connection = new MySQLConnector({
	host: '127.0.0.1',
	database: 'letters',
	//password: ommited for privacy,
	//username: ommited for privacy,
	port: 3306
})
const db = new Database(connection);

export class Letter extends Model {
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

export async function updatedb(entry: {
    Id: number,
    letterMessage: string,
    letterPostDate: string,
    letterLanguage: string
}): Promise<void> {
    const data = {
        id: entry.Id,
        letter: entry.letterMessage.replaceAll(';','CHAR(59)'),
        date: new Date(Number(entry.letterPostDate.replace('/Date(','').replace(')/',''))),
        lang: entry.letterLanguage.replaceAll(';','CHAR(59)')
	}

	try {
		await Letter.create(data)
	} catch(e) {
		Letter.where({id: entry.Id}).delete()
		await Letter.create(data)
	}
}

await db.close()