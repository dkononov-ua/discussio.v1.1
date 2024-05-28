/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


@Injectable()
export class Service {

  async countCitizen(user_id: string){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM citizen WHERE user_id = ?", [user_id])
      if (rows[0] !== undefined) {
        return rows[0].total
      } else {
        return false
      }
    }catch(err){return false}finally{conect.release();}

  }

  async countYCitizen(flat_id: string){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM citizen WHERE flat_id = ?", [flat_id])
      if (rows[0] !== undefined) {
        return rows[0].total
      } else {
        return false
      }
    }catch(err){return false}finally{conect.release();}

  }

  async getUserSaveAgreement(flat_id: string, user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields]:[Array<any> | any, any] = await conect.execute(`SELECT flat_id, subscriber_id, owner_id
      FROM agreement WHERE flat_id = ? AND i_agree = true AND subscriber_id = ? LIMIT 1`, [flat_id, user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return  false 
      }
    }catch(err){return  false}finally{conect.release();}

  }

  async getIDCitizen(flat_id: string, offs: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT user_id, flat_id FROM citizen WHERE flat_id = ? LIMIT 10 OFFSET ?;', [flat_id, offs.toString()])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return []
      }
    }catch(err){return []}finally{conect.release();}

  }


  async getCitizen(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, citizen.acces_filling, citizen.acces_subs, citizen.acces_discuss, citizen.acces_agreement, citizen.acces_citizen, citizen.acces_comunal_indexes, citizen.acces_agent, citizen.acces_flat_features, citizen.acces_flat_chats, \
      contacts.viber, contacts.tell, contacts.mail, contacts.instagram, contacts.telegram, contacts.facebook, citizen.acces_added, citizen.acces_admin , citizen.flat_id, citizen.acces_services, citizen.acces_comunal, user_img.img, user_status.realll, user_status.checked \
      FROM users JOIN contacts ON users.user_id = contacts.user_id \
      JOIN user_img ON users.user_id = user_img.user_id JOIN citizen ON users.user_id = citizen.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ? AND citizen.flat_id = ?", [user_id, flat_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return [{ status: 'Немає мешканців' }]
      }
    }catch(err){return [{ status: 'Немає мешканців' }]}finally{conect.release();}

  }

  async getIDCitizenFlats(user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT flat_id FROM citizen WHERE user_id = ? LIMIT 10 OFFSET ?;', [user_id, offs.toString()])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return []
      }
    }catch(err){return []}finally{conect.release();}

  }

}