/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {


  async getUserImg(tok: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM user_img WHERE user_id = ?;', [tok.user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async getContacts(tok: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM contacts WHERE user_id = ?;', [tok.user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  

  async countagree(user_id: string){
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM agreement WHERE subscriber_id = ? AND i_agree IS NULL", [user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

}