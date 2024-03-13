/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';



@Injectable()
export class Service {

  async getAdminFeedback(menuName: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE menuName = ?;', [menuName])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return false
      } 
    }catch(err){return false}finally{conect.release();}
  }

  async getFeedback(user_id: any, menuName: any) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT user_id, menuComment, menuName, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression FROM feedback WHERE user_id = ? AND menuName = ?  LIMIT 1;', [user_id, menuName])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return false
      } 
    }catch(err){return false}finally{conect.release();}

  }

  async addFeedback(tok: any, user_id: string) {
    let inf = await this.getFeedback(user_id, tok.menuName)
    const conect = await conect2.getConnection();
    try{
      if (inf[0]) {
        let [rows, fields] = await conect.execute('UPDATE feedback SET menuComment = ?, data = ?, optionComfort = ?, optionDesign = ?, optionDevice = ?, optionFunctional = ?, optionImpression = ? WHERE user_id = ? AND menuName = ?;',
          [tok.menuComment, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression, user_id, tok.menuName])
        return rows
      } else {
        let [rows, fields] = await conect.execute('INSERT INTO feedback (user_id, menuComment, menuName, data, optionComfort, optionDesign, optionDevice, optionFunctional, optionImpression) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [user_id, tok.menuComment, tok.menuName, new Date(), tok.optionComfort, tok.optionDesign, tok.optionDevice, tok.optionFunctional, tok.optionImpression]) 
        return rows
      }
    }catch(err){return false}finally{conect.release();}

  }


}