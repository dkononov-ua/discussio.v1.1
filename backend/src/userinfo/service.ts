/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';
import { unlink } from 'fs';


@Injectable()
export class Service {

  async getUserImg(tok: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM user_img WHERE user_id = ?;', [tok.user_id])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return false
      }
    }catch(err){
      return false
    }finally{conect.release();}

  }

  async getContacts(tok: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM contacts WHERE user_id = ?;', [tok.user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      return false
    }finally{conect.release();}

  }



  async countagree(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM agreement WHERE subscriber_id = ? AND i_agree IS NULL", [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      return false
    }finally{conect.release();}

  }

  async deleteUser(user_id: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields]: [any, any] = await conect.execute('SELECT flat_id FROM flat WHERE owner_id = ?', [user_id])
      await Promise.all(rows.map(async (i: any) => {
        let [rows2, fields2]: [any, any] = await conect.execute('SELECT * FROM chat WHERE flat_id = ?', [i.flat_id])
        try {
          try {
            let [rows222, fields222]: [any, any] = await conect.execute('SELECT * FROM flat_img WHERE flat_id = ?;', [i.flat_id])
            await Promise.all(rows222.map(async (e: any) => {
              unlink("../../code/Static/flat/" + e.img, () => { null })
            }))
          } catch (err) { console.log(err)}
  
          try {
            let [rows333, fields333]: [any, any] = await conect.execute('SELECT * FROM filling WHERE flat_id = ?;', [i.flat_id])
            await Promise.all(rows333.map(async (e: any) => {
              unlink("../../code/Static/filling/" + e.img, () => { null })
            }))
          } catch (err) {console.log(err) }
  
          try {
            let [rows444, fields444]: [any, any] = await conect.execute('SELECT * FROM comunal_img WHERE flat_id = ?;', [i.flat_id])
            await Promise.all(rows444.map(async (e: any) => {
              unlink("../../code/Static/comunal/" + e.img, () => { null })
            }))
          } catch (err) { console.log(err)}
  
          try {
            let [rowsqwe, fieldsqwe]: [any, any] = await conect.execute('SELECT * FROM comunal_name WHERE flat_id = ?;', [i.flat_id])
            await Promise.all(rowsqwe.map(async (e: any) => {
              await conect.execute('DELETE FROM comunal_img WHERE comunal_name = ?;', [e.comunal_name])
              await conect.execute('DELETE FROM comunal WHERE comunal_name = ?;', [e.comunal_name])
            }))
            
            await conect.execute('DELETE FROM comunal_name WHERE flat_id = ?;', [i.flat_id])
  
  
            await conect.execute('DELETE FROM about WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM parametrs WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM flat_status WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM flat_img WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM filling WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM flat_inf WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM subscribes WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM user_subscribes WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM accept_subs WHERE flat_id = ?', [i.flat_id])
            await conect.execute('DELETE FROM citizen WHERE flat_id = ?', [i.flat_id])
          } catch (err) { console.log(err)}
  
          try {
            let [rows6, fields6]: [any, any] = await conect.execute('SELECT * FROM agreement WHERE flat_id = ?', [i.flat_id])
            await Promise.all(rows6.map(async (e: any) => {
              await conect.execute('DELETE FROM agreement_act WHERE agreement_id = ?', [e.agreement_id])
              await conect.execute('DELETE FROM agreement_filling WHERE agreement_id = ?', [e.agreement_id])
              await conect.execute('DELETE FROM agreement WHERE agreement_id = ?', [e.agreement_id])
            }))
          } catch (err) {console.log(err) }
  
          try {
            await Promise.all(rows2.map(async (inn: any) => {
              await conect.execute('DELETE FROM message WHERE chat_id = ?', [inn.chat_id])
              await conect.execute('DELETE FROM chat WHERE chat_id = ?', [inn.chat_id])
              await conect.execute('DELETE FROM chat_name WHERE chat_id = ?', [inn.chat_id])
            }))
          } catch (err) {console.log(err) }
          await conect.execute('DELETE FROM flat_reports WHERE flat_id = ?', [i.flat_id])
          await conect.execute('DELETE FROM flat_status WHERE flat_id = ?', [i.flat_id])
          await conect.execute('DELETE FROM flat WHERE flat_id = ?', [i.flat_id])
        } catch(err) {console.log(err)}
      }))
      try {
        let [rows3, fields3]: [any, any] = await conect.execute('SELECT * FROM chat WHERE user_id = ?', [user_id])
        await Promise.all(rows3.map(async (innc: any) => {
          await conect.execute('DELETE FROM message WHERE chat_id = ?', [innc.chat_id])
          await conect.execute('DELETE FROM chat WHERE chat_id = ?', [innc.chat_id])
          await conect.execute('DELETE FROM chat_name WHERE chat_id = ?', [innc.chat_id])
        }))
      } catch (err) { console.log(err)}
      try {
        await conect.execute('DELETE FROM contacts WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM user_parametrs WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM feedback WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM features WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM subscribes WHERE user_id = ?;', [user_id])
      } catch (err) {console.log(err) }
      try {
        let [rows444, fields444]: [any, any] = await conect.execute('SELECT * FROM user_img WHERE user_id = ?;', [user_id])
        await Promise.all(rows444.map(async (e: any) => {
          unlink("../../code/Static/users/" + e.img, () => { null })
          await conect.execute('DELETE FROM user_img WHERE user_id = ?;', [user_id])
        }))
      } catch (err) {console.log(err) }
      try {
        await conect.execute('DELETE FROM user_subscribes WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM accept_subs WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM citizen WHERE user_id = ?;', [user_id])
      } catch (err) { console.log(err)}
      try {
        let [rows7, fields7]: [any, any] = await conect.execute('SELECT * FROM agreement WHERE subscriber_id = ?', [user_id])
        await Promise.all(rows7.map(async (e: any) => {
          await conect.execute('DELETE FROM agreement_act WHERE agreement_id = ?', [e.agreement_id])
          await conect.execute('DELETE FROM agreement_filling WHERE agreement_id = ?', [e.agreement_id])
          await conect.execute('DELETE FROM agreement WHERE agreement_id = ?', [e.agreement_id])
        }))
      } catch (err) { console.log(err)}
      try {
        await conect.execute('DELETE FROM users_rating WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM owner_rating WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM user_reports WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM user_status WHERE user_id = ?;', [user_id])
        await conect.execute('DELETE FROM users WHERE user_id = ?;', [user_id])
      } catch (err) {console.log(err)}
  
    }catch(err){
      return false
    }finally{conect.release();}
  }


  async secure_check(email: string, code: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('SELECT * FROM use_security WHERE email = ? AND em_pass = ? LIMIT 1;', [email, code])
      let [rows, fields] = await conect.execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
      if (rows2[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      return false
    }finally{conect.release();}

  }


  async new_secure2(user_email: any) {
    let numb = Math.floor(Math.random() * 900000) + 100000
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [user_email])
      let [rows, fields] = await conect.execute('INSERT INTO use_security (email, em_pass, attempt_counter) VALUES (?, ?, ?)',
        [user_email, numb, 0,])
      if (rows) {
        return numb
      } else {
        return false
      }
    }catch(err){
      return false
    }finally{conect.release();}

  }

}