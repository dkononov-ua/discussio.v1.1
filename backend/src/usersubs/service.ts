/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import conect2 from 'src/db_promise';


@Injectable()
export class Service {

  async countYUserSubs(user_id: string){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM user_subscribes WHERE user_id = ?", [user_id]);
      if (rows[0] !== undefined) {
        return rows[0].total
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  async countUserSubs(flat_id: string){
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT COUNT(*) AS total FROM user_subscribes WHERE flat_id = ?", [flat_id])
      if (rows[0] !== undefined) {
        return rows[0].total
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  async getUserIDFlats(user_id: string, offs: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT flat_id FROM user_subscribes WHERE user_id = ? LIMIT 10 OFFSET ?;', [user_id, offs.toString()])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return []
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }


  async getUserSubs(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute("SELECT users.user_id, users.firstName, users.lastName, users.surName, \
      features.country, features.region, features.city, features.distance_metro, features.distance_stop, features.about,\
      features.distance_shop, features.distance_green, features.distance_parking, features.woman, features.man, features.family,\
      features.students, features.animals, features.bunker, features.option_pay, features.price_of, features.price_to, features.house,\
      features.room, features.flat, features.agree_search, features.looking_woman, features.looking_man, features.rooms_of,\
      features.rooms_to, features.repair_status, features.area_of, features.area_to, features.balcony, features.purpose_rent, features.days,\
      features.weeks, features.mounths, features.years, features.day_counts, user_img.img, user_status.realll, user_status.checked \
      FROM users JOIN contacts ON users.user_id = contacts.user_id JOIN features ON users.user_id = features.user_id \
      JOIN user_img ON users.user_id = user_img.user_id JOIN user_status ON users.user_id = user_status.user_id WHERE users.user_id = ?", [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return [{ status: 'Немає підписників' }]
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }


  async getIDuserSubs(flat_id: string, offs: number) {
    const conect = await conect2.getConnection();
    try{
      const [rows, fields] = await conect.execute("SELECT * FROM user_subscribes WHERE flat_id = ? LIMIT 10 OFFSET ?;", [flat_id, offs.toString()])
      if (rows[0] !== undefined) {
        return rows
      } else {
        return []
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}
  }

  async user_subscribes(user_id: string, flat_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT * FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [flat_id, user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

  async feature_user(user_id: string) {
    const conect = await conect2.getConnection();
    try{
      let [rows, fields] = await conect.execute('SELECT user_id FROM features WHERE agree_search = true AND user_id = ?;', [user_id])
      if (rows[0] !== undefined) {
        return rows[0]
      } else {
        return false
      }
    }catch(err){
      console.log(err)
      return false
    }finally{conect.release();}

  }

}