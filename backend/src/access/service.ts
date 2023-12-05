/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';



const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async secure(email: string) {
    let [rows2, fields2] = await (await conect).execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
    if (rows2[0] !== undefined) {
      return rows2[0]
    } else {
      return false
    }
  }

  async secure_check(email: string, code:string) {
    let [rows2, fields2] = await (await conect).execute('SELECT * FROM use_security WHERE email = ? AND em_pass = ? LIMIT 1;', [email, code])
    let [rows, fields] = await (await conect).execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
    if (rows2[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  async new_secure(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    let [rows2, fields2] = await (await conect).execute('DELETE FROM use_security WHERE email = ?;', [inf.regEmail])    
    let [rows, fields] = await (await conect).execute('INSERT INTO use_security (email, password, em_pass, attempt_counter, dob) VALUES (?, ?, ?, ?, ?)',
     [inf.regEmail, inf.regPassword, numb, 0, new Date(inf.dob)])   
    if (rows) {
      return numb
    } else {
      return false
    }
  }

  async new_secureforgotpass(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    let [rows2, fields2] = await (await conect).execute('DELETE FROM use_security WHERE email = ?;', [inf.email])    
    let [rows, fields] = await (await conect).execute('INSERT INTO use_security (email, em_pass, attempt_counter) VALUES (?, ?, ?)',
     [inf.email, numb, 0])   
    if (rows) {
      return numb
    } else {
      return false
    }
  }



  async delete_secure(email: any) {

    let [rows2, fields2] = await (await conect).execute('DELETE FROM use_security WHERE email = ?;', [email])      
    if (rows2) {
      return true
    } else {
      return false
    }
  }


  async updete_secure(inf: any) {
    let [rows, fields] = await (await conect).execute('UPDATE use_security SET attempt_counter = ? WHERE email = ?;',
     [inf.attempt_counter + 1, inf.regEmail])    
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }


  async registercheck(tok: any) {
    let [rows, fields] = await (await conect).execute('SELECT * FROM users WHERE user_mail = ?;', [tok.email])
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return undefined
    }
  }


}