/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getChat(flat_id: string, user_id : string){
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM chat WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  async dontReadMessageUser(user_id : string){
    const conect = await conect2.getConnection();
    let [r]: [any, any] = await conect.execute('SELECT * FROM chat WHERE user_id = ?;', [user_id])
    let a = 0
    if(r[0] !== undefined){
    await Promise.all(r.map(async(i :any) => {
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS unread_count FROM message WHERE chat_id = ? AND flat_id = ? AND is_read = FALSE", [i.chat_id, i.flat_id]);
      a += rows[0].unread_count
    }))
    }
    conect.release();
    if(a != 0){
      return a
    }else{
      return false
    } 
  }


  async dontReadMessageFlat(flat_id: string){
    const conect = await conect2.getConnection();
    let [r]: [any, any] = await conect.execute('SELECT * FROM chat WHERE flat_id = ?;', [flat_id])
    let a = 0
    if(r[0] !== undefined){
    await Promise.all(r.map(async(i :any) => {
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS unread_count FROM message WHERE chat_id = ? AND user_id = ? AND is_read = FALSE", [i.chat_id ,i.user_id]);
      a += rows[0].unread_count
    }))
    }
    conect.release();
    if(a != 0){
      return a
    }else{
      return false
    }   
  }

  async getNewmessage(chat_id: string, data: Date, offs : string){
    const startDate = new Date(data);
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT flat_id, user_id, chat_id, message, data, is_read, sender_id FROM message WHERE chat_id = ? AND data > ? ORDER BY data DESC LIMIT 50 OFFSET ?",
     [chat_id, startDate, offs.toString()])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async readMessageUser( flat_id : string, chat_id: string){
    try{
      const conee = mysql.createConnection(config)
      conee.query('UPDATE message SET is_read = ? WHERE flat_id = ? AND chat_id = ? AND is_read = false;', [true, flat_id, chat_id],(e)=>{});
      conee.end()
      return true
    }catch{
      return false
    }
  }

  async readMessageFlat( user_id : string, chat_id: string){
    try{
      const conee = mysql.createConnection(config)
      conee.query('UPDATE message SET is_read = ? WHERE user_id = ? AND chat_id = ? AND is_read = false;', [true, user_id, chat_id],(e)=>{});
      conee.end()
      return true
    }catch{
      return false
    }
  }

  async getChatsFlat(flat_id: string, offs : string){
    const conect = await conect2.getConnection();
    let [rows, fields]: [any, any] = await conect.execute('SELECT * FROM chat WHERE flat_id = ? ORDER BY data DESC LIMIT 20 OFFSET ?;', [flat_id, offs.toString()])
    let a = await Promise.all(rows.map(async(i:any)=>{
      let [rows2, fields2] = await conect.execute("SELECT COUNT(*) AS unread_count FROM message WHERE user_id = ? AND is_read = false AND chat_id = ?", [ i.user_id, i.chat_id]);
      let [rows3, fields3] = await conect.execute("SELECT flat_name FROM flat WHERE flat_id = ? LIMIT 1", [i.flat_id]);

      return{flat_id:i.flat_id, user_id:i.user_id, chat_id:i.chat_id, unread:rows2[0].unread_count, last_message: i.message, flat_name:rows3[0].flat_name}
    }))
    conect.release();
    if (rows[0] !== undefined) {
      return a
    } else {
      return false
    }
  }

  async getChatsUser(user_id: string, offs : string){
    const conect = await conect2.getConnection();
    let [rows, fields]: [any, any] = await conect.execute('SELECT * FROM chat WHERE user_id = ? ORDER BY data DESC LIMIT 20 OFFSET ?;', [user_id, offs.toString()])
    let a = await Promise.all(rows.map(async(i:any)=>{
      let [rows2, fields2] = await conect.execute("SELECT COUNT(*) AS unread_count FROM message WHERE flat_id = ? AND is_read = false AND chat_id = ?", [ i.flat_id, i.chat_id]);
      let [rows3, fields3] = await conect.execute("SELECT flat_name FROM flat WHERE flat_id = ? LIMIT 1", [i.flat_id]);

      return{flat_id:i.flat_id, user_id:i.user_id, chat_id:i.chat_id, unread:rows2[0].unread_count, last_message: i.message, flat_name:rows3[0].flat_name}
    }))
    conect.release();
    if (rows[0] !== undefined) {
      return a
    } else {
      return false
    }
  }

  async getmessage(chat_id: string, offs : string){
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute("SELECT flat_id, user_id, chat_id, message, data, sender_id, is_read FROM message WHERE chat_id = ? AND is_read = true ORDER BY data DESC LIMIT 50 OFFSET ?",
     [chat_id, offs.toString()])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async sendMessageUser(user_id : string, chat_id: string, message: string){
    try{
      let d = new Date()
      const conee = mysql.createConnection(config)
      conee.query("UPDATE chat SET message = ?, data = ? WHERE chat_id = ?;", [message, d, chat_id],(e)=>{})
      conee.query("INSERT INTO message (user_id, chat_id, message, data) VALUES (?, ?, ?, ?);", [user_id, chat_id, message, d],(e)=>{});
      conee.end()
      return true
    }catch{
      return false
    }
  }

  async sendMessageFlat( user_id : string, flat_id: string, chat_id: string, message: string){
    try{
      let d = new Date()
      const conee = mysql.createConnection(config)
      conee.query("UPDATE chat SET message = ?, data = ? WHERE chat_id = ?;", [message, d, chat_id],(e)=>{});
      conee.query("INSERT INTO message (sender_id, flat_id, chat_id, message, data) VALUES (?, ?, ?, ?, ?);", [user_id, flat_id, chat_id, message, d],(e)=>{});
      conee.end()
      return true
    }catch{
      return false
    }
  }

  async addChat(flat_id: string, user_id : string){
    try{
      var random = Math.floor(Math.random() * 9000000000) + 1000000000;
      const conee = mysql.createConnection(config)
      conee.query("INSERT INTO chat_name (chat_id) VALUES (?);", [flat_id + user_id + random],(e)=>{});
      conee.query("INSERT INTO chat (flat_id, user_id, chat_id) VALUES (?, ?, ?);", [flat_id, user_id, flat_id + user_id + random],(e)=>{});
      conee.end()      
      return true
    }catch{
      return false
    }
  }

}