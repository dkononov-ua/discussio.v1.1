/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


@Injectable()
export class Service {

  async checkParamsForRent(flat_id: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields]: [any, any] = await conect.execute('SELECT region, city, street, houseNumber FROM flat WHERE flat_id = ?;', [flat_id])
      let flatCheck : any = []
      for (const property in rows[0]) {
        if(rows[0][property] == null){
          flatCheck.push(property)
        }
      }
      let [rows2, fields2]: [any, any] = await conect.execute('SELECT rooms, area, floor, option_flat FROM parametrs WHERE flat_id = ?;', [flat_id])
      for (const property in rows2[0]) {
        if(rows2[0][property] == null){
          flatCheck.push(property)
        }
      }
      let [rows3, fields3]: [any, any] = await conect.execute('SELECT option_pay, room FROM about WHERE flat_id = ?;', [flat_id])
      for (const property in rows3[0]) {
        if(rows3[0][property] == null){
          flatCheck.push(property)
        }
      }
      let [rows4, fields4]: [any, any] = await conect.execute('SELECT * FROM flat_img WHERE flat_id = ?;', [flat_id])

      if (flatCheck.length == 0) {
        if(rows4.length > 1){
          return true
        }else{
          let [rows4, fields4]: [any, any] = await conect.execute('UPDATE about SET rent = ? WHERE flat_id = ?;', [false ,flat_id])
          return "Додайте фото"
        }
      } else {
        let [rows4, fields4]: [any, any] = await conect.execute('UPDATE about SET rent = ? WHERE flat_id = ?;', [false ,flat_id])
        return flatCheck
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }









  async getFlatinf(flat_id: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM flat_inf WHERE flat_id = ?;', [flat_id])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }

  async addFlatinf(tok: any, flat_id: string) {
    let inf = await this.getFlatinf(flat_id)
    const conect = await conect2.getConnection();
    try{
      if (inf[0]) {
        let [rows, fields] = await conect.execute('UPDATE flat_inf SET osbb_phone = ?, pay_card = ?, wifi = ?, osbb_name = ?, info_about = ? WHERE flat_id = ?;',
          [tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about, flat_id])
        return rows
      } else {
        let [rows, fields] = await conect.execute('INSERT INTO flat_inf (flat_id, osbb_phone, pay_card, wifi, osbb_name, info_about) VALUES (?, ?, ?, ?, ?, ?)',
          [flat_id, tok.osbb_phone, tok.pay_card, tok.wifi, tok.osbb_name, tok.info_about]) 
        return rows
      }
    }catch(err){
      console.log(err)
      return "Не правильно передані данні"
    }finally{conect.release();}
  }

  async deleteFlat(flat_id: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] : [any, any] = await conect.execute('SELECT * FROM chat WHERE flat_id = ?', [flat_id])
      try{
        try {
          let [rows6, fields6]: [any, any] = await conect.execute('SELECT * FROM agreement WHERE flat_id = ?', [flat_id])
          await Promise.all(rows6.map(async (e: any) => {
            await conect.execute('DELETE FROM agreement_act WHERE agreement_id = ?', [e.agreement_id])
            await conect.execute('DELETE FROM agreement_filling WHERE agreement_id = ?', [e.agreement_id])
            await conect.execute('DELETE FROM agreement WHERE agreement_id = ?', [e.agreement_id])
          }))
        } catch (err) {console.log(err) }
        let [rowsqwe, fieldsqwe]: [any, any] = await conect.execute('SELECT * FROM comunal_name WHERE flat_id = ?;', [flat_id])
            await Promise.all(rowsqwe.map(async (e: any) => {
              await conect.execute('DELETE FROM comunal_img WHERE comunal_name = ?;', [e.comunal_name])
              await conect.execute('DELETE FROM comunal WHERE comunal_name = ?;', [e.comunal_name])
            }))
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
      await conect.execute('DELETE FROM flat_reports WHERE flat_id = ?', [flat_id])

      await Promise.all(rows.map( async(i :any) => {
        await conect.execute('DELETE FROM message WHERE chat_id = ?', [i.chat_id])
        await conect.execute('DELETE FROM chat WHERE chat_id = ?', [i.chat_id])
        await conect.execute('DELETE FROM chat_name WHERE chat_id = ?', [i.chat_id])
      }))
      }catch(err){
        console.log(err)
        return false
      }
      
    return true
  
    }catch(err){
      return false
    }finally{conect.release();}
  }

  async getFlatNames(flat_ids: any){
    let b = []
    const conect = await conect2.getConnection();
    try{
      await Promise.all(flat_ids.map(async(i :any) => {
        let [rows, fields] = await conect.execute("SELECT flat_id, flat_name FROM flat WHERE flat_id = ? LIMIT 1", [i.flat_id]);
        i.flat_name =  rows[0].flat_name
        b.push(i)
      }))
      if (b) {
        return b
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

}