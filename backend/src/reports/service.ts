/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getUserReport(user_id: string, repotrer: number) {
    const conect = await conect2.getConnection();
    const [rows, fields] = await conect.execute("SELECT * FROM user_reports WHERE user_id = ? AND repotrer = ?;", [user_id, repotrer])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    }
  }

  async getFlatReport(flat_id: string, repotrer: number) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT * FROM flat_reports WHERE flat_id = ? AND repotrer = ?;', [flat_id, repotrer])
    conect.release();
    if (rows[0] !== undefined) {
      return rows[0]
    } else {
      return false
    }
  }

  async addUserReport(tok: any, repotrer: number) {
    let report = await this.getUserReport(tok.user_id, repotrer)
    if(report){
      const conee = mysql.createConnection(config)
      conee.query('UPDATE user_reports SET  data = ?, reason = ?, about = ? WHERE user_id = ? AND repotrer = ?;', [new Date(), tok.reason, tok.about, tok.user_id, repotrer])
      conee.end()
      return true
    }else{
      const conee = mysql.createConnection(config)
      conee.query('INSERT INTO user_reports (user_id, data, repotrer, reason, about) VALUES (?, ?, ?, ?, ?)', [tok.user_id, new Date(), repotrer, tok.reason, tok.about])
      conee.end()
      return true
    }
  }

  async addFlatReport(tok: any, repotrer: number) {
    let report = await this.getFlatReport(tok.flat_id, repotrer)
    if(report){
      const conee = mysql.createConnection(config)
      conee.query('UPDATE flat_reports SET  data = ?, reason = ?, about = ? WHERE flat_id = ? AND repotrer = ?;', [new Date(), tok.reason, tok.about, tok.flat_id, repotrer])
      conee.end()
      return true
    }else{
      const conee = mysql.createConnection(config)
      conee.query('INSERT INTO flat_reports (flat_id, data, repotrer, reason, about) VALUES (?, ?, ?, ?, ?)', [tok.flat_id, new Date(), repotrer, tok.reason, tok.about])
      conee.end()
      return true
    }
  }

}