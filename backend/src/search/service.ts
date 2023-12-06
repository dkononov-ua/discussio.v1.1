/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';
import conect from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

	async getFlatRating(user_id: any) {
		let [u_rati, f] : [any, any] = await (await conect).execute('SELECT data, appraiser, mark, about FROM owner_rating WHERE user_id = ?', [user_id])
    if (u_rati[0] !== undefined) {
			let ff = []
			await Promise.all(u_rati.map(async(i : any)=>{
				let [rows, fields] = await (await conect).execute('SELECT firstName, lastName, surName, img FROM users JOIN user_img ON users.user_id = user_img.user_id WHERE users.user_id = ?;', [i.appraiser])
				ff.push({data: i.data, mark: i.mark, about:i.about, reporter: rows[0] })
				return 
			}))
      return ff
    } else {
      return false
    }
  }

}