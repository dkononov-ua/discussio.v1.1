/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


// const conect = mm.createConnection(config)



@Injectable()
export class Service {

  async getAdminFeedback(menuName: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE menuName = ?;', [menuName])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async getFeedback(user_id: any, menuName: any) {
    const conect = await conect2.getConnection();
    let [rows, fields] = await conect.execute('SELECT user_id, menuComment, menuName, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE user_id = ? AND menuName = ?  LIMIT 1;', [user_id, menuName])
    conect.release();
    if (rows[0] !== undefined) {
      return rows
    } else {
      return false
    } 
  }

  async addFeedback(tok: any, user_id: string) {
    let inf = await this.getFeedback(user_id, tok.menuName)
    const conect = await conect2.getConnection();
    if (inf[0]) {
      let [rows, fields] = await conect.execute('UPDATE feedback SET menuComment = ?, data = ?, optionComfort = ?, optionDesign = ?, optionDevice = ?, optionFunctional = ?, optionImpression = ? WHERE user_id = ? AND menuName = ?;',
        [tok.menuComment, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression, user_id, tok.menuName])
        conect.release();
      return rows
    } else {
      let [rows, fields] = await conect.execute('INSERT INTO feedback (user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, tok.menuComment, tok.menuName, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression])
        conect.release(); 
      return rows
    }
  }


}