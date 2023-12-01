/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';



const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getFlat(flat_id: string) {
    let [rows, fields] = await (await conect).execute("SELECT * FROM flat \
    JOIN parametrs ON flat.flat_id = parametrs.flat_id JOIN about ON flat.flat_id = about.flat_id JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE flat.flat_id = ?", [flat_id])
    let [img, fie]: [Array<any> | any, any] = await (await conect).execute("SELECT * FROM flat_img WHERE flat_id = ?", [flat_id])
    let [filling, fffff]: [Array<any> | any, any] = await (await conect).execute("SELECT * FROM filling WHERE flat_id = ?", [flat_id])
    let [citizen, ffaaf]: [Array<any> | any, any] = await (await conect).execute("SELECT * FROM citizen WHERE flat_id = ?", [flat_id])
    let [reports, ffaf]: [Array<any> | any, any] = await (await conect).execute("SELECT * FROM flat_reports WHERE flat_id = ?", [flat_id])
    if (rows[0] !== undefined) {
      return { flat: rows[0], img: await Promise.all(img.map((i: any) => i.img)), filling: filling, citizen: citizen, reports: reports }
    } else {
      return false
    }
  }


  async getUser(user_id: string) {
    let [rows, fields] = await (await conect).execute("SELECT * \
    FROM users JOIN contacts ON users.user_id = contacts.user_id JOIN features ON users.user_id = features.user_id \
    JOIN user_img ON users.user_id = user_img.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ?", [user_id])
    let [flats, fie]: [Array<any> | any, any] = await (await conect).execute("SELECT flat_id FROM flat WHERE owner_id = ?", [user_id])
    let [reports, ffaf]: [Array<any> | any, any] = await (await conect).execute("SELECT * FROM user_reports WHERE user_id = ?", [user_id])
    if (rows[0] !== undefined) {
      return {user: rows[0], flats : flats, reports : reports}
    } else {
      return [{ status: 'Немає підписників' }]
    }
  }

  async getUsers(tok: any) {
    let [rows, fields] = await (await conect).execute("SELECT users.user_id \
    FROM users \
    JOIN user_img ON users.user_id = user_img.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE \
    user_status.banned = ? AND user_status.realll = ? AND user_status.checked = ? AND user_status.admin = ? LIMIT 10 OFFSET ?", [tok.banned, tok.realll, tok.checked, tok.admin, tok.offs.toString()])
    let [rows2, fields2] = await (await conect).execute("SELECT COUNT(*) AS total \
    FROM users \
    JOIN user_img ON users.user_id = user_img.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE \
    banned = ? AND realll = ? AND checked = ? AND admin = ?", [tok.banned, tok.realll, tok.checked, tok.admin])
    if (rows[0] !== undefined) {
      return {users:rows, count_users:rows2[0].total}
    } else {
      return [{ status: 'Немає підписників' }]
    }
  }


  async getFlats(tok: any) {
    let [rows, fields] = await (await conect).execute("SELECT flat.flat_id, flat.owner_id FROM flat \
    JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE banned = ? AND realll = ? AND checked = ? LIMIT 10 OFFSET ?", [tok.banned, tok.realll, tok.checked, tok.offs.toString()])
    let [rows2, fields2] = await (await conect).execute("SELECT COUNT(*) AS total \
    FROM flat \
    JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE banned = ? AND realll = ? AND checked = ?", [tok.banned, tok.realll, tok.checked])
    if (rows[0] !== undefined) {
      return {flats:rows, count_flats:rows2[0].total} 
    } else {
      return false
    }
  }

  async getUsersReports(tok: any) {
    let [rows, fields] = await (await conect).execute("SELECT users.user_id FROM users \
    JOIN user_reports ON users.user_id = user_reports.user_id \
    JOIN user_status ON users.user_id = user_status.user_id \
    WHERE user_status.banned = ? AND user_status.realll = ? AND user_status.checked = ? AND user_status.admin = ? \
    GROUP BY user_id \
    ORDER BY COUNT(user_reports.user_id) DESC \
    LIMIT 10 OFFSET ?", [tok.banned, tok.realll, tok.checked, tok.admin, tok.offs.toString()])
    let [rows2, fields2] = await (await conect).execute("SELECT COUNT(*) AS total \
    FROM users \
    JOIN user_reports ON users.user_id = user_reports.user_id \
    JOIN user_status ON users.user_id = user_status.user_id \
    WHERE user_status.banned = ? AND user_status.realll = ? AND user_status.checked = ? AND user_status.admin = ? \
    GROUP BY user_id", [tok.banned, tok.realll, tok.checked, tok.admin])
    if (rows[0] !== undefined) {
      return {users:rows, count_users:rows2[0].total}
    } else {
      return [{ status: 'Немає підписників' }]
    }
  }


  async getFlatsReports(tok: any) {
    let [rows, fields] = await (await conect).execute( "SELECT flat.flat_id FROM flat \
    JOIN flat_reports ON flat.flat_id = flat_reports.flat_id \
    JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE flat_status.banned = ? AND flat_status.realll = ? AND flat_status.checked = ? \
    GROUP BY flat_id \
    ORDER BY COUNT(flat_reports.flat_id) DESC \
    LIMIT 10 OFFSET ?", [tok.banned, tok.realll, tok.checked, tok.offs.toString()])
    let [rows2, fields2] = await (await conect).execute("SELECT COUNT(*) AS total \
    FROM flat \
    JOIN flat_reports ON flat.flat_id = flat_reports.flat_id \
    JOIN flat_status ON flat.flat_id = flat_status.flat_id \
    WHERE banned = ? AND realll = ? AND checked = ? \
    GROUP BY flat_id", [tok.banned, tok.realll, tok.checked])
    if (rows[0] !== undefined) {
      return {flats:rows, count_flats:rows2[0].total} 
    } else {
      return false
    }
  }



  async changeFlat(tok: any) {
    let [rows, fields] = await (await conect).execute('UPDATE flat_status SET banned = ?, realll = ?, checked = ? WHERE flat_id = ?;',
      [tok.banned, tok.realll, tok.checked, tok.flat_id])
    if (rows) {
      return true
    } else {
      return false
    }
  }


  async changeUser(tok: any) {
    let [rows, fields] = await (await conect).execute('UPDATE user_status SET banned = ?, realll = ?, checked = ?, admin = ? WHERE user_id = ?;',
      [tok.banned, tok.realll, tok.checked, tok.admin, tok.user_id])
    if (rows) {
      return true
    } else {
      return false
    }
  }


  async deleteFlatReport(tok: any) {
    let [rows, fields] = await (await conect).execute('DELETE FROM flat_reports WHERE flat_id = ? AND repotrer = ?', [tok.flat_id, tok.repotrer])
    if (rows) {
      return true
    } else {
      return false
    }
  }


  async deleteUserReport(tok: any) {
    let [rows, fields] = await (await conect).execute('DELETE FROM user_reports WHERE user_id = ? AND repotrer = ?', [tok.user_id, tok.repotrer])
    if (rows) {
      return true
    } else {
      return false
    }
  }



}