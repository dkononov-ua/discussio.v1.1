/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async secure(email: string) {
    const conect = await conect2.getConnection();
    let [rows2, fields2] = await conect.execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
    conect.release();
    if (rows2[0] !== undefined) {
      return rows2[0]
    } else {
      return false
    }
  }

  async secure_check(email: string, code:string) {
    const conect = await conect2.getConnection();
    let [rows2, fields2] = await conect.execute('SELECT * FROM use_security WHERE email = ? AND em_pass = ? LIMIT 1;', [email, code])
    let [rows, fields] = await conect.execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
    conect.release();
    if (rows2[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  async new_secure(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    const conect = await conect2.getConnection();
    let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [inf.regEmail])    
    let [rows, fields] = await conect.execute('INSERT INTO use_security (email, password, em_pass, attempt_counter, dob) VALUES (?, ?, ?, ?, ?)',
     [inf.regEmail, inf.regPassword, numb, 0, new Date(inf.dob)])  
    conect.release(); 
    if (rows) {
      return numb
    } else {
      return false
    }
  }

  async new_secureforgotpass(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    const conect = await conect2.getConnection();
    let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [inf.email])    
    let [rows, fields] = await conect.execute('INSERT INTO use_security (email, em_pass, attempt_counter) VALUES (?, ?, ?)',
     [inf.email, numb, 0]) 
    conect.release();  
    if (rows) {
      return numb
    } else {
      return false
    }
  }



  async delete_secure(email: any) {
    const conect = await conect2.getConnection();
    let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [email])
    conect.release();      
    if (rows2) {
      return true
    } else {
      return false
    }
  }


  async updete_secure(inf: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('UPDATE use_security SET attempt_counter = ? WHERE email = ?;',
     [inf.attempt_counter + 1, inf.regEmail])
    conect.release();    
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }


  async registercheck(mail:string) {
    try{
      const conect = await conect2.getConnection();
      let [rows, fields] = await conect.execute('SELECT * FROM users WHERE user_mail = ?;', [mail])
      conect.release();
      if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return undefined
    }
    }catch(err){
      return [123]
    }
    
  }


}