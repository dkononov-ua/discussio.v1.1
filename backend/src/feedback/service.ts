/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conee from 'src/db';
import * as mm from 'mysql2/promise'
import config from 'src/dbpar';



const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getAdminFeedback(menuName: any) {
    let [rows, fields] = await (await conect).execute('SELECT user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE menuName = ?;', [menuName])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async getFeedback(user_id: any, menuName: any) {
    let [rows, fields] = await (await conect).execute('SELECT user_id, menuComment, menuName, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE user_id = ? AND menuName = ?  LIMIT 1;', [user_id, menuName])
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async addFeedback(tok: any, user_id: string) {
    let inf = await this.getFeedback(user_id, tok.menuName)
    if (inf[0]) {
      let [rows, fields] = await (await conect).execute('UPDATE feedback SET menuComment = ?, data = ?, optionComfort = ?, optionDesign = ?, optionDevice = ?, optionFunctional = ?, optionImpression = ? WHERE user_id = ? AND menuName = ?;',
        [tok.menuComment, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression, user_id, tok.menuName])
      return rows
    } else {
      let [rows, fields] = await (await conect).execute('INSERT INTO feedback (user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, tok.menuComment, tok.menuName, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression]) 
      return rows
    }
  }


}