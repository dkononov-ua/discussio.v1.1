/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';



const conect = mm.createConnection(config)



@Injectable()
export class Service {


  async getUserImg(tok: any) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM user_img WHERE user_id = ?;', [tok.user_id])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async getContacts(tok: any) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM contacts WHERE user_id = ?;', [tok.user_id])
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  

  async countagree(user_id: string){
    let [rows, fields] = await (await conect).execute("SELECT COUNT(*) AS total FROM agreement WHERE subscriber_id = ? AND i_agree IS NULL", [user_id])
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

}