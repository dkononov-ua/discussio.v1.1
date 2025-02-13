/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';



@Injectable()
export class Service {

  async secure(email: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('SELECT * FROM use_security WHERE email = ? LIMIT 1;', [email])
    
      if (rows2[0] !== undefined) {
        return rows2[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false}finally{conect.release();}

  }

  async secure_check(email: string, code:string) {
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('SELECT * FROM use_security WHERE email = ? AND em_pass = ? LIMIT 1;', [email, code])
      if (rows2[0] !== undefined) {
        return rows2[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false}finally{conect.release();}

  }

  async new_secure(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [inf.regEmail])    
      let [rows, fields] = await conect.execute('INSERT INTO use_security (email, password, em_pass, attempt_counter, dob) VALUES (?, ?, ?, ?, ?)',
       [inf.regEmail, inf.regPassword, numb, 0, new Date(inf.dob)])  
       
      if (rows) {
        return numb
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false}finally{conect.release();}

  }

  async new_secureforgotpass(inf: any) {
    let numb = Math.floor(Math.random()*900000) + 100000
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [inf.email])    
      let [rows, fields] = await conect.execute('INSERT INTO use_security (email, em_pass, attempt_counter) VALUES (?, ?, ?)',
       [inf.email, numb, 0]) 
       
      if (rows) {
        return numb
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false}finally{conect.release(); }

  }



  async delete_secure(email: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows2, fields2] = await conect.execute('DELETE FROM use_security WHERE email = ?;', [email])
          
      if (rows2) {
        return true
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false}finally{conect.release();}

  }


  async updete_secure(inf: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('UPDATE use_security SET attempt_counter = ? WHERE email = ?;',
      [inf.attempt_counter + 1, inf.regEmail])
        
     if (rows[0] !== undefined) {
       return rows[0]
     } else {
       return false
     }
    }catch(err){
      console.log(err)
      return false}finally{conect.release(); }

  }


  async registercheck(mail:string) {
      const conect = await conect2.getConnection();
      try{
        let [rows, fields] = await conect.execute('SELECT * FROM users WHERE user_mail = ?;', [mail])
      
        if (rows[0] !== undefined) {
        return rows[0]
        } else {
        return undefined
        }
      }catch(err){
        console.log(err)
        return [123]}finally{conect.release();}
  }


}