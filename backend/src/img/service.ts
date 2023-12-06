/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';
import conect from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

	async getComunalMo(flat_id: string, comunal_name: string, when_pay_y: number, when_pay_m: string) {
		let [rows, fields] = await (await conect).execute('SELECT * FROM comunal_img WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ? AND when_pay_m = ?;', [flat_id, comunal_name, String(when_pay_y), when_pay_m])
		if (rows[0] !== undefined) {
			return rows
		} else {
			return []
		}
}

async addComunal(tok: any, user_id : string, img : string) {
			let [rows, fields] = await (await conect).execute('INSERT INTO comunal_img (flat_id, img, user_id, comunal_name, when_pay_m, when_pay_y) VALUES (?, ?, ?, ?, ?, ?)',
				[tok.flat_id, img, user_id, tok.comunal_name, tok.when_pay_m, tok.when_pay_y])
			return rows
		// const comunal : any = await this.getComunalMo(tok.flat_id, tok.comunal_name, tok.when_pay_y, tok.when_pay_m)
		// if (comunal[0]) {
		// 	let [rows, fields] = await (await conect).execute('UPDATE comunal_img SET img, user_id WHERE flat_id = ? AND comunal_name = ? AND when_pay_m = ? AND when_pay_y = ?;',
		// 		[img, user_id, comunal.flat_id, comunal.comunal_name, comunal.when_pay_m, comunal.when_pay_y])
		// 	return rows
		// } else {
		// 	let [rows, fields] = await (await conect).execute('INSERT INTO comunal_img (flat_id, img, user_id, comunal_name, when_pay_m, when_pay_y) VALUES (?, ?, ?, ?, ?, ?)',
		// 		[tok.flat_id, img, user_id, tok.comunal_name, tok.when_pay_m, tok.when_pay_y])
		// 	return rows
		// }
	}

}