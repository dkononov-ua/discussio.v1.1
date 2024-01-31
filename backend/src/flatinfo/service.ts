/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getFlatinf(flat_id: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM flat_inf WHERE flat_id = ?;', [flat_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async addFlatinf(tok: any, flat_id: string) {
    let inf = await this.getFlatinf(flat_id)
    try{
      const conect = await conect2.getConnection();
      if (inf[0]) {
        let [rows, fields] = await conect.execute('UPDATE flat_inf SET osbb_phone = ?, pay_card = ?, wifi = ?, osbb_name = ?, info_about = ? WHERE flat_id = ?;',
          [tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about, flat_id])
        conect.release();
        return rows
      } else {
        let [rows, fields] = await conect.execute('INSERT INTO flat_inf (flat_id, osbb_phone, pay_card, wifi, osbb_name, info_about) VALUES (?, ?, ?, ?, ?, ?)',
          [flat_id, tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about]) 
        conect.release();
        return rows
      }
    }catch{
      return "Не правильно передані данні"
    }
  }

  async deleteFlat(flat_id: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] : [any, any] = await conect.execute('SELECT * FROM chat WHERE flat_id = ?', [flat_id])
    try{
      await conect.execute('DELETE FROM comunal_img WHERE flat_id = ?;', [flat_id])
      await conect.execute('DELETE FROM comunal WHERE flat_id = ?;', [flat_id])
    await conect.execute('DELETE FROM comunal_name WHERE flat_id = ?;', [flat_id])
    await conect.execute('DELETE FROM about WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM parametrs WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM flat_status WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM flat_img WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM filling WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM flat_inf WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM subscribes WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM user_subscribes WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM accept_subs WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM citizen WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM agreement WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM citizen WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM agreement WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM flat_reports WHERE flat_id = ?', [flat_id])
    await conect.execute('DELETE FROM flat_status WHERE flat_id = ?', [flat_id])
    await Promise.all(rows.map( async(i :any) => {
      await conect.execute('DELETE FROM message WHERE chat_id = ?', [i.chat_id])
      await conect.execute('DELETE FROM chat WHERE chat_id = ?', [i.chat_id])
      await conect.execute('DELETE FROM chat_name WHERE chat_id = ?', [i.chat_id])
    }))
    conect.release();
    }catch{
      conect.release();
      return false
    }
    
  return true
  }

  async getFlatNames(flat_ids: any){
    let b = []
    const conect = await conect2.getConnection();
    await Promise.all(flat_ids.map(async(i :any) => {
      let [rows, fields] = await conect.execute("SELECT flat_id, flat_name FROM flat WHERE flat_id = ? LIMIT 1", [i.flat_id]);
      i.flat_name =  rows[0].flat_name
      b.push(i)
    }))
    conect.release();
    if (b) {
      return b
    } else {
      return false
    }
  }

}