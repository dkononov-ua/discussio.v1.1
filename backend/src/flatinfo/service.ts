/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';



const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getFlatinf(flat_id: any) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM flat_inf WHERE flat_id = ?;', [flat_id])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async addFlatinf(tok: any, flat_id: string) {
    let inf = await this.getFlatinf(flat_id)
    try{
      if (inf[0]) {
        let [rows, fields] = await (await conect).execute('UPDATE flat_inf SET osbb_phone = ?, pay_card = ?, wifi = ?, osbb_name = ?, info_about = ? WHERE flat_id = ?;',
          [tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about, flat_id])
        return rows
      } else {
        let [rows, fields] = await (await conect).execute('INSERT INTO flat_inf (flat_id, osbb_phone, pay_card, wifi, osbb_name, info_about) VALUES (?, ?, ?, ?, ?, ?)',
          [flat_id, tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about]) 
        return rows
      }
    }catch{
      return "Не правильно передані данні"
    }
  }

  async deleteFlat(flat_id: any) {
    let [rows, fields] : [any, any] = await (await conect).execute('SELECT * FROM chat WHERE flat_id = ?', [flat_id])
    try{
      await (await conect).execute('DELETE FROM comunal WHERE flat_id = ?;', [flat_id])
    await (await conect).execute('DELETE FROM comunal_name WHERE flat_id = ?;', [flat_id])
    await (await conect).execute('DELETE FROM about WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM parametrs WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM flat_status WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM flat_img WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM filling WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM flat_inf WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM subscribes WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM user_subscribes WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM accept_subs WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM citizen WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM agreement WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM citizen WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM agreement WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM flat_reports WHERE flat_id = ?', [flat_id])
    await (await conect).execute('DELETE FROM flat_status WHERE flat_id = ?', [flat_id])
    await Promise.all(rows.map( async(i :any) => {
      await (await conect).execute('DELETE FROM message WHERE chat_id = ?', [i.chat_id])
      await (await conect).execute('DELETE FROM chat WHERE chat_id = ?', [i.chat_id])
      await (await conect).execute('DELETE FROM chat_name WHERE chat_id = ?', [i.chat_id])
    }))
    }catch{
      return false
    }
    
  return true
  }

  async getFlatNames(flat_ids: any){
    let b = []
    await Promise.all(flat_ids.map(async(i :any) => {
      let [rows, fields] = await (await conect).execute("SELECT flat_id, flat_name FROM flat WHERE flat_id = ? LIMIT 1", [i.flat_id]);
      i.flat_name =  rows[0].flat_name
      b.push(i)
    }))
    if (b) {
      return b
    } else {
      return false
    }
  }

}